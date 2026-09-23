import { extractTransactionsFromOCR } from './src/utils/ocrEngine.js';

const noisyTesseractOcrText = `
APEX TRUST BANK - ACCOUNT STATEMENT
Statement Period: Oct 01, 2024 – Oct 31, 2024
Page 1 of 3

Oct 31, 2024 | INT-00102 | Monthly Interest Paid (APY 0.75%) | CREDIT: $45.00 | BAL: $7,118.35
Oct 30, 2024 | POS-90184 | CVS Pharmacy Health & Wellness
  Store #4912 Prescriptions & Medical
  DEBIT: $12.00 | BAL: $7,073.35
Oct 26, 2024 | ACH-48190 | Chase Credit Card Auto Payment | DEBIT: $1,65O.OO | BAL: $7,100.21
Oct 03, 2024 | EFT-11843 | Mortgage Auto-Debit - Apex Home Loans | DEBIT: $l,450.00 | BAL: $6,S40.50
`;

console.log("Running Tesseract OCR Extraction Engine Test...");
const results = extractTransactionsFromOCR(noisyTesseractOcrText, 2024);

console.log("\nReconstructed Transactions JSON Array:");
console.log(JSON.stringify(results, null, 2));
