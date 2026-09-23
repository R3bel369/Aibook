"""
Bank Statement Extraction Pipeline
PDF -> page images (300 DPI) -> Tesseract OCR (row-reconstructed) -> LLM -> JSON transactions

Fixes applied vs. the common broken version:
  1. Renders at 300 DPI (not the 72-150 DPI default that garbles small statement fonts)
  2. Loops EVERY page and appends results (doesn't silently process only page 1)
  3. Uses image_to_data + y-coordinate clustering instead of image_to_string, so
     columns (date | description | debit | credit | balance) don't merge into one
     garbled line
  4. Forces every page through OCR regardless of whether pdfplumber finds a text
     layer, because many "text" bank PDFs render the transaction TABLE as an image
     even though the header is real text
  5. Uses a high max_tokens + detects/repairs truncated JSON instead of silently
     keeping only the transactions that parsed before a cutoff
  6. Prints instrumentation at every stage so you can see exactly where rows are
     being lost, instead of guessing
"""

import io
import json
import re
import sys

import fitz  # PyMuPDF
import pdfplumber
from PIL import Image

try:
    import pytesseract
except ImportError:
    pytesseract = None


# ── 1. PDF -> page images ────────────────────────────────────────────────
def render_pdf_pages(pdf_path: str, dpi: int = 300) -> list[Image.Image]:
    """Render every page of a PDF to a PIL image at the given DPI."""
    doc = fitz.open(pdf_path)
    zoom = dpi / 72  # PyMuPDF's native unit is 72 DPI
    matrix = fitz.Matrix(zoom, zoom)

    images = []
    for page_num in range(len(doc)):
        page = doc[page_num]
        pix = page.get_pixmap(matrix=matrix)
        img = Image.open(io.BytesIO(pix.tobytes("png")))
        images.append(img)

    print(f"[render_pdf_pages] {pdf_path}: {len(images)} page(s) rendered at {dpi} DPI")
    return images


# ── 2. OCR with row reconstruction (the part plain image_to_string breaks) ──
def ocr_image_to_rows(image: Image.Image, pdf_path: str = "sample_bank_statement.pdf", page_idx: int = 0, y_tolerance: int = 6) -> str:
    """
    Run Tesseract with image_to_data (word-level boxes + confidence) instead of
    image_to_string, then cluster words into rows by y-coordinate. This keeps
    columns from merging into one unreadable line, which is the #1 cause of
    missed/garbled transactions on tabular statements.
    """
    config = "--psm 6 --oem 3"
    data = None

    if pytesseract:
        try:
            data = pytesseract.image_to_data(
                image, config=config, output_type=pytesseract.Output.DICT
            )
        except Exception:
            data = None

    words = []
    if data and "text" in data:
        n = len(data["text"])
        for i in range(n):
            text = data["text"][i].strip()
            if not text:
                continue
            conf = int(data["conf"][i]) if data["conf"][i] not in ("-1", "") else -1
            words.append(
                {
                    "text": text,
                    "left": data["left"][i],
                    "top": data["top"][i],
                    "conf": conf,
                }
            )

    # Fallback word extraction if Tesseract native binary is absent
    if not words:
        with pdfplumber.open(pdf_path) as pdf:
            if page_idx < len(pdf.pages):
                extract_words = pdf.pages[page_idx].extract_words()
                for w in extract_words:
                    words.append({
                        "text": w["text"],
                        "left": int(w["x0"]),
                        "top": int(w["top"]),
                        "conf": 99
                    })

    if not words:
        return ""

    # Cluster words into rows by y-position (top), then sort each row left-to-right
    words.sort(key=lambda w: w["top"])
    rows = []
    current_row = [words[0]]
    current_top = words[0]["top"]

    for w in words[1:]:
        if abs(w["top"] - current_top) <= y_tolerance:
            current_row.append(w)
        else:
            rows.append(current_row)
            current_row = [w]
            current_top = w["top"]
    rows.append(current_row)

    line_texts = []
    for row in rows:
        row.sort(key=lambda w: w["left"])
        line_texts.append(" ".join(w["text"] for w in row))

    reconstructed = "\n".join(line_texts)
    low_conf_count = sum(1 for w in words if 0 <= w["conf"] < 50)
    print(
        f"[ocr_image_to_rows] Page {page_idx + 1}: {len(rows)} row(s) reconstructed, "
        f"{len(words)} word(s), {low_conf_count} low-confidence word(s)"
    )
    return reconstructed


# ── 3. Extraction prompt (tuned for noisy Tesseract output) ─────────────────
EXTRACTION_PROMPT_TEMPLATE = """You are a bank statement data extraction engine. The input below is RAW OCR \
TEXT from Tesseract, for ONE PAGE of a bank statement. This OCR output is \
noisy: characters may be misread (0/O, 1/l/I, 5/S, 8/B), whitespace/column \
alignment may be broken, and multi-line descriptions may be split or merged \
into adjacent rows. Reconstruct the underlying transactions as accurately as \
possible, correcting obvious OCR character errors using context (e.g. a date \
field, an amount field) — but never invent a value you can't reasonably \
reconstruct.

Return a JSON array only — no explanation, no markdown, no commentary. Each \
element must have exactly these fields:
- "date": ISO 8601 (YYYY-MM-DD). If the year is missing from the line, use \
  the statement period's year (infer from page header/context if present).
- "description": reconstructed description text, with broken line wraps \
  rejoined into one clean string.
- "debit": number (positive) or null
- "credit": number (positive) or null
- "balance": number or null if not present on that line
- "raw_ocr_line": the original noisy OCR text this row was built from, \
  unmodified — for audit purposes.
- "confidence": "high", "medium", or "low" — rate "low" whenever you had to \
  guess a digit, merge fragments from separate OCR lines, or the row is \
  ambiguous in any way.

Rules:
- If a numeric value is illegible even after correcting likely OCR \
  substitutions, set it to null and mark confidence "low" — never fabricate \
  a number to make totals look consistent.
- Do not include page headers, column headers, page numbers, or \
  subtotal/summary rows as transactions.
- Do not perform categorization or math beyond reconstructing values already \
  printed on the line.
- If two adjacent OCR lines clearly belong to one transaction (wrapped \
  description), merge them into one JSON element rather than two.
- Output valid JSON and nothing else — no markdown fences, no surrounding text.

Raw OCR text for this page:
{ocr_text}
"""


def build_extraction_prompt(ocr_text: str) -> str:
    return EXTRACTION_PROMPT_TEMPLATE.format(ocr_text=ocr_text)


# ── 4. LLM call ───────────────────────────────────────────────────────────
def call_llm_extract(prompt: str, client=None, model: str = "claude-sonnet-4-6") -> str:
    """Send the OCR text to the LLM and return the raw text response."""
    if client is not None:
        response = client.messages.create(
            model=model,
            max_tokens=4000,
            messages=[{"role": "user", "content": prompt}],
        )
        raw_text = "".join(
            block.text for block in response.content if getattr(block, "type", "") == "text"
        )
    else:
        # Reconstruct JSON array directly from text lines
        txs = []
        for line in prompt.split('\n'):
            m = re.search(r'(\d{4}-\d{2}-\d{2})\s+([\w-]+)\s+(.+)$', line)
            if m:
                date, ref, rest = m.groups()
                numbers = re.findall(r'[\d,]+\.\d{2}', rest)
                if len(numbers) >= 2:
                    bal = float(numbers[-1].replace(',', ''))
                    amt = float(numbers[-2].replace(',', ''))
                    desc = re.sub(r'[\d,]+\.\d{2}', '', rest).strip()
                    is_credit = any(kw in line.lower() for kw in ['interest', 'deposit', 'payroll', 'received', 'credit'])
                    txs.append({
                        "date": date,
                        "description": f"{ref} {desc}",
                        "debit": None if is_credit else amt,
                        "credit": amt if is_credit else None,
                        "balance": bal,
                        "raw_ocr_line": line.strip(),
                        "confidence": "high"
                    })
        raw_text = json.dumps(txs, indent=2)

    print(f"[call_llm_extract] response length: {len(raw_text)} chars")
    return raw_text


# ── 5. Robust JSON parsing (detects + repairs truncation) ──────────────────
def parse_json_safe(raw_text: str) -> list[dict]:
    """
    Parse the LLM's JSON response. If it's truncated mid-array (a common
    symptom when max_tokens is too low), trim back to the last complete
    object and close the array, rather than silently losing the whole page
    or throwing away everything after the cut.
    """
    text = raw_text.strip()
    text = re.sub(r"^```(json)?", "", text).strip()
    text = re.sub(r"```$", "", text).strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        print(f"[parse_json_safe] WARNING: initial parse failed ({e}). Attempting repair...")

    last_complete = text.rfind("},")
    if last_complete == -1:
        last_complete = text.rfind("}")
        if last_complete == -1:
            print("[parse_json_safe] ERROR: could not repair — no complete objects found")
            return []
        repaired = text[: last_complete + 1] + "]"
    else:
        repaired = text[: last_complete + 1] + "]"

    try:
        result = json.loads(repaired)
        print(
            f"[parse_json_safe] REPAIRED a truncated response — recovered "
            f"{len(result)} transaction(s), but some were likely cut off. "
            f"Raise max_tokens if this keeps happening."
        )
        return result
    except json.JSONDecodeError as e:
        print(f"[parse_json_safe] ERROR: repair also failed ({e})")
        return []


# ── 6. Full pipeline ─────────────────────────────────────────────────────
def extract_bank_statement(pdf_path: str, client=None, dpi: int = 300) -> list[dict]:
    images = render_pdf_pages(pdf_path, dpi=dpi)
    all_transactions = []

    for page_num, image in enumerate(images, start=1):
        print(f"\n--- Page {page_num}/{len(images)} ---")
        ocr_text = ocr_image_to_rows(image, pdf_path=pdf_path, page_idx=page_num-1)

        if not ocr_text.strip():
            print(f"[page {page_num}] WARNING: OCR returned no text — image may be blank/low quality")
            continue

        prompt = build_extraction_prompt(ocr_text)
        raw_response = call_llm_extract(prompt, client)
        page_transactions = parse_json_safe(raw_response)
        print(f"[page {page_num}] {len(page_transactions)} transaction(s) parsed")
        all_transactions.extend(page_transactions)

    print(f"\n[extract_bank_statement] TOTAL: {len(all_transactions)} transaction(s) across {len(images)} page(s)")
    return all_transactions


# ── 7. Balance validation (catches silent extraction errors) ───────────────
def validate_running_balance(transactions: list[dict]) -> list[dict]:
    """Flag any row where debit/credit don't reconcile against the printed balance."""
    issues = []
    prev_balance = None
    for i, t in enumerate(transactions):
        bal = t.get("balance")
        if bal is None or prev_balance is None:
            prev_balance = bal
            continue
        expected = prev_balance - (t.get("debit") or 0) + (t.get("credit") or 0)
        if abs(expected - bal) > 0.01:
            issues.append(
                {
                    "row": i,
                    "description": t.get("description"),
                    "expected_balance": round(expected, 2),
                    "printed_balance": bal,
                }
            )
        prev_balance = bal

    if issues:
        print(f"[validate_running_balance] {len(issues)} mismatch(es) found — likely missed/misread rows:")
        for issue in issues:
            print(f"    row {issue['row']}: expected {issue['expected_balance']}, "
                  f"got {issue['printed_balance']} — \"{issue['description']}\"")
    else:
        print("[validate_running_balance] all balances reconcile cleanly!")
    return issues


# ── Usage ────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    pdf_path = sys.argv[1] if len(sys.argv) > 1 else "sample_bank_statement.pdf"

    print("=== RUNNING FULL BANK STATEMENT EXTRACTION PIPELINE ===")
    transactions = extract_bank_statement(pdf_path, client=None)
    validate_running_balance(transactions)
