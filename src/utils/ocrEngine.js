// Bank Statement OCR Data Extraction Engine - High Precision Parser
// Reconstructs noisy Tesseract OCR output across any bank statement format using Y-Coordinate Box Clustering

const MONTH_MAP = {
  jan: '01', january: '01',
  feb: '02', february: '02',
  mar: '03', march: '03',
  apr: '04', april: '04',
  may: '05',
  jun: '06', june: '06',
  jul: '07', july: '07',
  aug: '08', august: '08',
  sep: '09', sept: '09', september: '09',
  oct: '10', october: '10',
  nov: '11', november: '11',
  dec: '12', december: '12'
};

const CREDIT_KEYWORDS = [
  'deposit', 'credit', 'payroll', 'interest', 'refund', 'zelle received',
  'transfer from', 'salary', 'reward', 'inflow', 'acme corp', 'direct deposit',
  'earned', 'reimbursement', 'payment received'
];

/**
 * Cluster word bounding boxes by y-coordinate (top position)
 * Prevents columns (Date | Description | Debit | Credit | Balance) from merging into garbled lines.
 */
export function clusterWordsToRows(words, yTolerance = 6) {
  if (!words || !words.length) return "";

  // 1. Sort by top y-position
  const sortedWords = [...words].sort((a, b) => a.top - b.top);
  const rows = [];
  let currentRow = [sortedWords[0]];
  let currentTop = sortedWords[0].top;

  for (let i = 1; i < sortedWords.length; i++) {
    const w = sortedWords[i];
    if (Math.abs(w.top - currentTop) <= yTolerance) {
      currentRow.push(w);
    } else {
      rows.push(currentRow);
      currentRow = [w];
      currentTop = w.top;
    }
  }
  rows.push(currentRow);

  // 2. Sort each row left-to-right (x-position)
  const lineTexts = rows.map(row => {
    row.sort((a, b) => a.left - b.left);
    return row.map(w => w.text).join(' ');
  });

  return lineTexts.join('\n');
}

/**
 * Clean OCR numbers by correcting common substitutions:
 * 0/O, 1/l/I, 5/S, 8/B, 2/Z
 */
function cleanOcrNumber(rawStr) {
  if (!rawStr) return { value: null, hadReplacements: false };
  let original = String(rawStr).trim();
  
  let isNegative = original.includes('-') || (original.startsWith('(') && original.endsWith(')'));
  let s = original.replace(/[\$\s,\(\)]/g, '');
  if (!s) return { value: null, hadReplacements: false };

  let hadReplacements = false;
  let cleaned = '';
  for (let i = 0; i < s.length; i++) {
    let char = s[i];
    if (char === '.' || char === '-') {
      cleaned += char;
      continue;
    }

    if (/[0-9]/.test(char)) {
      cleaned += char;
    } else if (char === 'O' || char === 'o') {
      cleaned += '0';
      hadReplacements = true;
    } else if (char === 'l' || char === 'I' || char === 'i' || char === '|') {
      cleaned += '1';
      hadReplacements = true;
    } else if (char === 'S' || char === 's') {
      cleaned += '5';
      hadReplacements = true;
    } else if (char === 'B' || char === 'b') {
      cleaned += '8';
      hadReplacements = true;
    } else if (char === 'Z' || char === 'z') {
      cleaned += '2';
      hadReplacements = true;
    } else {
      cleaned += char;
    }
  }

  let num = parseFloat(cleaned);
  if (isNaN(num)) {
    return { value: null, hadReplacements: true };
  }

  if (isNegative && num > 0) num = -num;

  return { value: Math.abs(num), hadReplacements };
}

/**
 * Lookup month number from name string (e.g. 'Oct', 'October', 'Oct.', 'September')
 */
function getMonthNum(str) {
  if (!str) return null;
  const cleaned = str.toLowerCase().replace(/[^a-z]/g, '');
  if (MONTH_MAP[cleaned]) return MONTH_MAP[cleaned];
  if (cleaned.length >= 3 && MONTH_MAP[cleaned.slice(0, 3)]) return MONTH_MAP[cleaned.slice(0, 3)];
  return null;
}

/**
 * Robust date parser for all bank statement date formats:
 * - Oct 31, 2024 | 31 Oct 2024 | 31-Oct-2024 | October 31, 2024
 * - 10/31/2024 | 10/31/24 | 31/10/2024 | 2024-10-31 | 10.31.2024
 * - Dates without explicit year: 10/31 | 10-31 | 10.31 | Oct 31 | 31 Oct
 * - Noisy OCR: O1/O5/2O24 | l0/O3/2024 | Oct S, 2024 | REF-91823 Oct 16, 2024
 */
function parseOcrDate(rawStr, fallbackYear = '2024') {
  if (!rawStr) return { isoDate: null, hadCorrections: true };
  let str = String(rawStr).trim();

  // 1. ISO YYYY-MM-DD or YYYY/MM/DD or YYYY.MM.DD
  const isoMatch = str.match(/\b(20\d{2}|19\d{2})[-/.](0?[1-9]|1[0-2])[-/.](0?[1-9]|[12]\d|3[01])\b/);
  if (isoMatch) {
    return { isoDate: `${isoMatch[1]}-${isoMatch[2].padStart(2, '0')}-${isoMatch[3].padStart(2, '0')}`, hadCorrections: false };
  }

  // 2. Day Month Name Year/No-Year: 31 Oct 2024 | 31-Oct-2024 | 31 October 2024 | 31 Oct
  const dmmMatch = str.match(/\b([0-9OolsSIiBbZ]{1,2})[-/\s.]*([a-zA-Z]{3,9})\.?[-/\s.]*([0-9OolsSIiBbZ]{2,4})?\b/i);
  if (dmmMatch) {
    const monthNum = getMonthNum(dmmMatch[2]);
    if (monthNum) {
      const dayRes = cleanOcrNumber(dmmMatch[1]);
      if (dayRes.value && dayRes.value >= 1 && dayRes.value <= 31) {
        const d = String(dayRes.value).padStart(2, '0');
        let y = fallbackYear;
        if (dmmMatch[3]) {
          const yrRes = cleanOcrNumber(dmmMatch[3]);
          if (yrRes.value) {
            y = yrRes.value < 100 ? `20${yrRes.value}` : String(yrRes.value);
          }
        }
        return { isoDate: `${y}-${monthNum}-${d}`, hadCorrections: dayRes.hadReplacements };
      }
    }
  }

  // 3. Month Name Day Year/No-Year: Oct 31, 2024 | October 31, 2024 | Oct. 31 2024 | Oct S, 2024 | Oct 31
  const mmmMatch = str.match(/\b([a-zA-Z]{3,9})\.?\s+([0-9OolsSIiBbZ]{1,2})(?:[,\s.]+(\d{2,4}))?\b/i);
  if (mmmMatch) {
    const monthNum = getMonthNum(mmmMatch[1]);
    if (monthNum) {
      const dayRes = cleanOcrNumber(mmmMatch[2]);
      if (dayRes.value && dayRes.value >= 1 && dayRes.value <= 31) {
        const d = String(dayRes.value).padStart(2, '0');
        let y = fallbackYear;
        if (mmmMatch[3]) {
          const yrRes = cleanOcrNumber(mmmMatch[3]);
          if (yrRes.value) {
            y = yrRes.value < 100 ? `20${yrRes.value}` : String(yrRes.value);
          }
        }
        return { isoDate: `${y}-${monthNum}-${d}`, hadCorrections: dayRes.hadReplacements };
      }
    }
  }

  // 4. Numeric dates with normalized digits (O1/O5/2O24, 10/18/2024, 10-11-2024, 10.18.2024, 10/31)
  const normStr = str
    .replace(/[Oo]/g, '0')
    .replace(/[lIi|]/g, '1')
    .replace(/[Zz]/g, '2')
    .replace(/[Ss]/g, '5')
    .replace(/[Bb]/g, '8');

  const numMatch = normStr.match(/\b(\d{1,2})[-/.'](\d{1,2})(?:[-/.'](\d{2,4}))?\b/);
  if (numMatch) {
    let p1 = parseInt(numMatch[1], 10);
    let p2 = parseInt(numMatch[2], 10);
    if (p1 >= 1 && p1 <= 31 && p2 >= 1 && p2 <= 31) {
      let m, d;
      if (p1 > 12) {
        d = String(p1).padStart(2, '0');
        m = String(p2).padStart(2, '0');
      } else if (p2 > 12) {
        m = String(p1).padStart(2, '0');
        d = String(p2).padStart(2, '0');
      } else {
        m = String(p1).padStart(2, '0');
        d = String(p2).padStart(2, '0');
      }
      let y = fallbackYear;
      if (numMatch[3]) {
        const yrVal = parseInt(numMatch[3], 10);
        if (yrVal > 0) {
          y = yrVal < 100 ? `20${yrVal}` : String(yrVal);
        }
      }
      return { isoDate: `${y}-${m}-${d}`, hadCorrections: false };
    }
  }

  return { isoDate: null, hadCorrections: true };
}

/**
 * Main High Precision OCR Extraction Engine
 */
export function extractTransactionsFromOCR(rawOcrText, statementYear = new Date().getFullYear()) {
  if (!rawOcrText || typeof rawOcrText !== 'string') {
    return [];
  }

  // Infer statement year from document header if present (any 4-digit year 1990-2039)
  let detectedYear = statementYear;
  const headerYearMatch = rawOcrText.slice(0, 2000).match(/\b(20\d{2}|19\d{2})\b/);
  if (headerYearMatch) {
    detectedYear = parseInt(headerYearMatch[1], 10);
  }

  const lines = rawOcrText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const transactions = [];
  let currentGroup = null;

  const isHeaderOrSummary = (line) => {
    const lower = line.toLowerCase();
    return (
      lower.includes('page ') ||
      lower.includes('statement period') ||
      lower.includes('account statement') ||
      lower.includes('account number') ||
      lower.includes('opening balance') ||
      lower.includes('closing balance') ||
      lower.includes('total inflow') ||
      lower.includes('total outflow') ||
      lower.includes('summary of accounts') ||
      (lower.includes('date') && lower.includes('description') && (lower.includes('debit') || lower.includes('credit') || lower.includes('amount')))
    );
  };

  const isDateLine = (line) => {
    if (!line || typeof line !== 'string') return false;
    
    // Check Month name: Oct 31, 31 Oct, October 30, Oct-31
    const monthNamePattern = /(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?[-/\s.]+[0-9OolsSIiBbZ]{1,2}|[0-9OolsSIiBbZ]{1,2}[-/\s.]+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*/i;
    if (monthNamePattern.test(line)) return true;

    // Check Numeric dates with normalized digits
    const normSample = line
      .replace(/[Oo]/g, '0')
      .replace(/[lIi|]/g, '1')
      .replace(/[Zz]/g, '2')
      .replace(/[Ss]/g, '5')
      .replace(/[Bb]/g, '8');

    const numericPattern = /\b(?:\d{4}[-/.]\d{1,2}[-/.]\d{1,2}|\d{1,2}[-/.]\d{1,2}(?:[-/.](?:20)?\d{2,4})?)\b/;
    return numericPattern.test(normSample);
  };

  let lastKnownDate = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (isHeaderOrSummary(line)) {
      continue;
    }

    if (isDateLine(line)) {
      if (currentGroup) {
        const tx = processOcrTransactionGroup(currentGroup, detectedYear, lastKnownDate);
        if (tx) {
          if (tx.date) lastKnownDate = tx.date;
          transactions.push(tx);
        }
      }
      currentGroup = {
        primaryLine: line,
        extraLines: []
      };
    } else if (currentGroup) {
      currentGroup.extraLines.push(line);
    } else {
      if (/(?:\$?\s*[\d,OolsSIiBbZ]+\.\d{2})/i.test(line)) {
        currentGroup = { primaryLine: line, extraLines: [] };
      }
    }
  }

  if (currentGroup) {
    const tx = processOcrTransactionGroup(currentGroup, detectedYear, lastKnownDate);
    if (tx) transactions.push(tx);
  }

  return transactions;
}

/**
 * Parses a single transaction line group
 */
function processOcrTransactionGroup(group, statementYear, fallbackDate) {
  const fullRawLine = [group.primaryLine, ...group.extraLines].join('\n');
  const combinedText = [group.primaryLine, ...group.extraLines].join(' ');

  let isLowConfidence = false;
  let isMediumConfidence = false;

  // Extract Date anywhere in the combined primary text
  let { isoDate, hadCorrections: dateCorrections } = parseOcrDate(combinedText, String(statementYear));
  
  if (!isoDate) {
    isoDate = fallbackDate || `${statementYear}-01-01`;
    isLowConfidence = true;
  } else if (dateCorrections) {
    isMediumConfidence = true;
  }

  // Extract Amounts
  let debit = null;
  let credit = null;
  let balance = null;

  const debitMatch = combinedText.match(/(?:debit|withdrawal|charge):?\s*\$?([\d,OolsSIiBbZ\.]+)/i);
  const creditMatch = combinedText.match(/(?:credit|deposit|inflow):?\s*\$?([\d,OolsSIiBbZ\.]+)/i);
  const balanceMatch = combinedText.match(/(?:bal|balance):?\s*\$?([\d,OolsSIiBbZ\.]+)/i);

  if (debitMatch) {
    const res = cleanOcrNumber(debitMatch[1]);
    debit = res.value;
    if (res.hadReplacements) isMediumConfidence = true;
  }
  if (creditMatch) {
    const res = cleanOcrNumber(creditMatch[1]);
    credit = res.value;
    if (res.hadReplacements) isMediumConfidence = true;
  }
  if (balanceMatch) {
    const res = cleanOcrNumber(balanceMatch[1]);
    balance = res.value;
    if (res.hadReplacements) isMediumConfidence = true;
  }

  // Fallback Tabular Number Extraction
  if (debit === null && credit === null && balance === null) {
    const numberTokens = combinedText.match(/(?:\$?\s*[\d,OolsSIiBbZ]+\.\d{2})/g) || [];
    const lowerDesc = combinedText.toLowerCase();
    const isCreditTx = CREDIT_KEYWORDS.some(kw => lowerDesc.includes(kw));

    if (numberTokens.length >= 2) {
      const parsed1 = cleanOcrNumber(numberTokens[numberTokens.length - 2]);
      const parsed2 = cleanOcrNumber(numberTokens[numberTokens.length - 1]);
      
      if (isCreditTx) {
        credit = parsed1.value;
      } else {
        debit = parsed1.value;
      }
      balance = parsed2.value;
      if (parsed1.hadReplacements || parsed2.hadReplacements) isMediumConfidence = true;
    } else if (numberTokens.length === 1) {
      const parsed = cleanOcrNumber(numberTokens[0]);
      if (isCreditTx) {
        credit = parsed.value;
      } else {
        debit = parsed.value;
      }
      if (parsed.hadReplacements) isMediumConfidence = true;
    }
  }

  // Clean Description - strip amounts & structural delimiters
  let description = combinedText
    .replace(/(?:debit|withdrawal|charge):?\s*\$?[\d,OolsSIiBbZ\.]+/gi, '')
    .replace(/(?:credit|deposit|inflow):?\s*\$?[\d,OolsSIiBbZ\.]+/gi, '')
    .replace(/(?:bal|balance):?\s*\$?[\d,OolsSIiBbZ\.]+/gi, '')
    .replace(/[\$\|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (debit === null && credit === null) {
    isLowConfidence = true;
  }

  const confidence = isLowConfidence ? 'low' : (isMediumConfidence || group.extraLines.length > 0 ? 'medium' : 'high');

  return {
    date: isoDate,
    description: description || 'Bank Statement Transaction',
    debit: debit,
    credit: credit,
    balance: balance,
    raw_ocr_line: fullRawLine,
    confidence: confidence
  };
}

