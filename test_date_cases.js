import { extractTransactionsFromOCR } from './src/utils/ocrEngine.js';

const testCases = [
  // 1. Standard Month Day Year
  "Oct 31, 2024 | INT-00102 | Monthly Interest Paid | CREDIT: $45.00 | BAL: $7,118.35",
  "October 30, 2024 | POS-90184 | CVS Pharmacy | DEBIT: $12.00 | BAL: $7,073.35",
  "31 Oct 2024 | POS-12903 | Starbucks | DEBIT: $14.86 | BAL: $7,085.35",
  "31-Oct-2024 | ACH-48190 | Chase Credit | DEBIT: $1,650.00 | BAL: $7,100.21",

  // 2. Numeric Slash / Dash / Dot
  "10/24/2024 | POS-77412 | Target Purchase | DEBIT: $88.20 | BAL: $8,750.21",
  "10/22/24 | ATM-00912 | ATM Cash Withdrawal | DEBIT: $200.00 | BAL: $8,838.41",
  "2024-10-20 | POS-33984 | Trader Joe's | DEBIT: $96.45 | BAL: $9,038.41",
  "10.18.2024 | BP-49021 | ConEdison Utility | DEBIT: $124.30 | BAL: $9,134.86",

  // 3. Leading reference / transaction code before date
  "REF-91823 Oct 16, 2024 | ACME CORP Payroll | CREDIT: $2,750.00 | BAL: $9,259.16",
  "[TXN-55201] 10/14/2024 | Zelle Received Michael Vance | CREDIT: $180.00 | BAL: $6,509.16",
  "ROW#11 10-11-2024 | Netflix Subscription | DEBIT: $19.99 | BAL: $6,329.16",

  // 4. OCR Noisy Characters in dates (O/0, l/1, S/5, B/8)
  "O1/O5/2O24 | Whole Foods Market | DEBIT: $142.60 | BAL: $6,397.90",
  "l0/O3/2024 | Apex Home Loans | DEBIT: $1,450.00 | BAL: $6,540.50",
  "Oct S, 2024 | ACME CORP Payroll | CREDIT: $2,750.00 | BAL: $7,990.50"
];

const sampleDocument = `APEX TRUST BANK - ACCOUNT STATEMENT
Statement Period: Oct 01, 2024 – Oct 31, 2024

` + testCases.join("\n");

console.log("Testing OCR Extraction on Noisy Date Strings...\n");
const results = extractTransactionsFromOCR(sampleDocument, 2024);

results.forEach((tx, idx) => {
  console.log(`[Item ${idx + 1}] Date: ${tx.date} | Raw Line: ${tx.raw_ocr_line.slice(0, 45)}...`);
});

console.log(`\nTotal parsed: ${results.length} / ${testCases.length}`);
