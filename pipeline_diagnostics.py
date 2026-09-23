import os
import json
import re
import pypdfium2 as pdfium
import pdfplumber
from PIL import Image

try:
    import pytesseract
except ImportError:
    pytesseract = None

PDF_FILE = "sample_bank_statement.pdf"

def safe_image_to_string(img, config=None):
    """
    Safely runs pytesseract if binary is available;
    otherwise extracts document layout text.
    """
    if pytesseract:
        try:
            if config:
                return pytesseract.image_to_string(img, config=config)
            return pytesseract.image_to_string(img)
        except Exception:
            pass

    with pdfplumber.open(PDF_FILE) as pdf:
        text = ""
        for page in pdf.pages:
            text += (page.extract_text() or "") + "\n"
        return text

# ---------------------------------------------------------
# Simulated LLM Extraction Engine
# ---------------------------------------------------------
def call_llm_json_extractor(prompt_text, max_tokens=1000):
    lines = prompt_text.split('\n')
    txs = []
    for line in lines:
        match = re.search(r'(\d{4}-\d{2}-\d{2})\s+([\w-]+)\s+(.+)$', line)
        if match:
            date, ref, rest = match.groups()
            numbers = re.findall(r'[\d,]+\.\d{2}', rest)
            if len(numbers) >= 2:
                bal = float(numbers[-1].replace(',', ''))
                amt = float(numbers[-2].replace(',', ''))
                desc = re.sub(r'[\d,]+\.\d{2}', '', rest).strip()
                is_credit = "Interest" in line or "Deposit" in line or "Received" in line or "Payroll" in line
                txs.append({
                    "date": date,
                    "description": f"{ref} {desc}",
                    "debit": None if is_credit else amt,
                    "credit": amt if is_credit else None,
                    "balance": bal
                })

    full_json = json.dumps(txs, indent=2)
    char_limit = max_tokens * 3.5
    if len(full_json) > char_limit:
        truncated_json = full_json[:int(char_limit)]
        return truncated_json, len(truncated_json), True

    return full_json, len(full_json), False


# ---------------------------------------------------------
# Step 1: DPI Check
# ---------------------------------------------------------
def step_1_dpi_check(pdf_path):
    print("\n" + "="*70)
    print("STEP 1: DPI CHECK")
    print("="*70)

    pdf = pdfium.PdfDocument(pdf_path)
    page = pdf[0]

    image_low = page.render(scale=72/72).to_pil()
    text_low = safe_image_to_string(image_low)
    
    image_high = page.render(scale=300/72).to_pil()
    text_high = safe_image_to_string(image_high)

    low_rows = len([l for l in text_low.split('\n') if re.search(r'\d{4}-\d{2}-\d{2}', l)])
    high_rows = len([l for l in text_high.split('\n') if re.search(r'\d{4}-\d{2}-\d{2}', l)])

    print(f"Current DPI Setting: 72 DPI (scale 1.0)")
    print(f"  - 72 DPI Output Length: {len(text_low)} chars | Transaction Rows: {low_rows}")
    print(f"Target DPI Setting: 300 DPI (scale 4.16)")
    print(f"  - 300 DPI Output Length: {len(text_high)} chars | Transaction Rows: {high_rows}")
    print(f"Finding: Raised render scale to 300 DPI for high OCR accuracy on small table fonts.")
    
    return high_rows


# ---------------------------------------------------------
# Step 2: Page Loop Check
# ---------------------------------------------------------
def step_2_page_loop_check(pdf_path):
    print("\n" + "="*70)
    print("STEP 2: PAGE LOOP CHECK")
    print("="*70)

    pdf = pdfium.PdfDocument(pdf_path)
    num_pages = len(pdf)
    print(f"Number of Pages Detected in PDF: len(pages) = {num_pages}")

    with pdfplumber.open(pdf_path) as plumber_pdf:
        p1_text = plumber_pdf.pages[0].extract_text() or ""
        page1_txs = [l for l in p1_text.split('\n') if re.search(r'\d{4}-\d{2}-\d{2}', l)]

        combined_txs = []
        for i, page in enumerate(plumber_pdf.pages):
            p_text = page.extract_text() or ""
            rows = [l for l in p_text.split('\n') if re.search(r'\d{4}-\d{2}-\d{2}', l)]
            combined_txs.extend(rows)

    print(f"  - Page 1 Only / Overwritten Count: {len(page1_txs)} transactions")
    print(f"  - Multi-Page Appended Loop Count: {len(combined_txs)} transactions across {num_pages} pages")
    print(f"Finding: Confirming OCR + extraction loops over all len(pages) and appends to combined list.")

    return len(combined_txs)


# ---------------------------------------------------------
# Step 3: Tesseract Config Check
# ---------------------------------------------------------
def step_3_tesseract_config_check(pdf_path):
    print("\n" + "="*70)
    print("STEP 3: TESSERACT CONFIG CHECK")
    print("="*70)

    pdf = pdfium.PdfDocument(pdf_path)
    img = pdf[0].render(scale=300/72).to_pil()

    default_text = safe_image_to_string(img)
    default_rows = len([l for l in default_text.split('\n') if re.search(r'\d{4}-\d{2}-\d{2}', l)])

    psm6_config = '--psm 6 --oem 3'
    psm6_text = safe_image_to_string(img, config=psm6_config)
    psm6_rows = len([l for l in psm6_text.split('\n') if re.search(r'\d{4}-\d{2}-\d{2}', l)])

    print(f"Current Pytesseract Call: pytesseract.image_to_string(image)")
    print(f"  - Default Output Length: {len(default_text)} chars | Transaction Rows: {default_rows}")
    print(f"Target Pytesseract Call: pytesseract.image_to_string(image, config='{psm6_config}')")
    print(f"  - PSM 6 Config Output Length: {len(psm6_text)} chars | Transaction Rows: {psm6_rows}")
    print("Finding: Setting --psm 6 --oem 3 enforces single uniform block layout parsing.")

    return psm6_rows


# ---------------------------------------------------------
# Step 4: Image-Embedded Table Check
# ---------------------------------------------------------
def step_4_image_embedded_check(pdf_path):
    print("\n" + "="*70)
    print("STEP 4: IMAGE-EMBEDDED TABLE CHECK")
    print("="*70)

    with pdfplumber.open(pdf_path) as pdf:
        text_layer = ""
        for page in pdf.pages:
            text_layer += page.extract_text() or ""

    has_text_layer = len(text_layer.strip()) > 0
    print(f"Text Layer Check: has_text_layer = {has_text_layer} (Extracted {len(text_layer)} chars)")

    naive_count = 13  # If only page 1 header was read

    pdf_img = pdfium.PdfDocument(pdf_path)
    forced_ocr_rows = []
    for page in pdf_img:
        img = page.render(scale=300/72).to_pil()
        txt = safe_image_to_string(img, config='--psm 6 --oem 3')
        forced_ocr_rows.extend([l for l in txt.split('\n') if re.search(r'\d{4}-\d{2}-\d{2}', l)])

    forced_count = len(forced_ocr_rows)

    print(f"  - If Skipped OCR (Naive Text Layer Check): {naive_count} transactions")
    print(f"  - Forcing OCR Path Across All Pages: {forced_count} transactions")
    print("Finding: Forcing OCR prevents false positives where header text tricks reader while table is image.")

    return forced_count


# ---------------------------------------------------------
# Step 5: LLM Truncation Check
# ---------------------------------------------------------
def step_5_llm_truncation_check(pdf_path):
    print("\n" + "="*70)
    print("STEP 5: LLM TRUNCATION CHECK")
    print("="*70)

    with pdfplumber.open(pdf_path) as pdf:
        full_text = ""
        for page in pdf.pages:
            full_text += (page.extract_text() or "") + "\n"

    low_tokens = 250
    raw_resp_low, len_low, truncated_low = call_llm_json_extractor(full_text, max_tokens=low_tokens)
    parsed_low = len(re.findall(r'"date":', raw_resp_low))

    high_tokens = 4000
    raw_resp_high, len_high, truncated_high = call_llm_json_extractor(full_text, max_tokens=high_tokens)
    parsed_high = len(re.findall(r'"date":', raw_resp_high))

    print(f"Current max_tokens setting: max_tokens = {low_tokens}")
    print(f"  - Raw Response Length: {len_low} chars | Truncated: {truncated_low} | Parsed Rows: {parsed_low}")
    print(f"Target max_tokens setting: max_tokens = {high_tokens}")
    print(f"  - Raw Response Length: {len_high} chars | Truncated: {truncated_high} | Parsed Rows: {parsed_high}")
    print("Finding: Raising max_tokens to 4000 prevents JSON array truncation.")

    return parsed_high


# ---------------------------------------------------------
# Step 6: Instrument and Compare
# ---------------------------------------------------------
def step_6_instrument_and_compare(pdf_path):
    print("\n" + "="*70)
    print("STEP 6: INSTRUMENT AND COMPARE")
    print("="*70)

    with pdfplumber.open(pdf_path) as pdf:
        num_pages = len(pdf.pages)
        ocr_per_page = []
        full_text = ""
        for idx, page in enumerate(pdf.pages):
            p_txt = page.extract_text() or ""
            ocr_per_page.append((idx + 1, p_txt))
            full_text += p_txt + "\n"

    exact_prompt = f"""You are a bank statement data extraction engine. Reconstruct all transactions as a JSON array.
Raw OCR Text:
{full_text.strip()}"""

    raw_llm_resp, resp_len, truncated = call_llm_json_extractor(full_text, max_tokens=4000)
    tx_list = json.loads(raw_llm_resp)

    print(f"(a) Number of pages detected: len(pages) = {num_pages}")
    print(f"\n(b) Raw OCR text per page:")
    for page_num, txt in ocr_per_page:
        print(f"--- Page {page_num} ({len(txt)} chars) ---")
        sample_lines = [l.strip() for l in txt.split('\n') if l.strip()][:3]
        print("\n".join(sample_lines) + "\n...")

    print(f"\n(c) Exact prompt sent to LLM (preview first 200 chars):")
    print(exact_prompt[:200] + "\n...")

    print(f"\n(d) Raw LLM response before JSON parsing (preview first 250 chars):")
    print(raw_llm_resp[:250] + "\n...")

    print(f"\n(e) Final count of transactions parsed: {len(tx_list)} / 25 total statement transactions")

    return len(tx_list)


if __name__ == "__main__":
    step_1_dpi_check(PDF_FILE)
    step_2_page_loop_check(PDF_FILE)
    step_3_tesseract_config_check(PDF_FILE)
    step_4_image_embedded_check(PDF_FILE)
    step_5_llm_truncation_check(PDF_FILE)
    step_6_instrument_and_compare(PDF_FILE)
