// Exact Apex Trust Bank Statement Dataset matching Eleanor V. Vance PDF

export const SAMPLE_STATEMENTS = [
  {
    id: "stmt_apex_trust_bank_pdf",
    name: "Apex_Trust_Bank_Oct_2024_Statement.pdf",
    bankName: "Apex Trust Bank",
    accountHolder: "Eleanor V. Vance",
    accountNumber: "•••• •••• 8492",
    routingNumber: "021000021",
    statementPeriod: "Oct 01, 2024 – Oct 31, 2024",
    fileSize: "1.2 MB",
    fileType: "PDF",
    currency: "USD",
    currencySymbol: "$",
    openingBalance: 5240.50,
    totalInflow: 5725.00,
    totalOutflow: 3847.15,
    netCashFlow: 1877.85,
    finalTotalBalance: 7118.35,
    transactionCount: 15,
    rawTextPreview: `APEX TRUST BANK - ACCOUNT STATEMENT
Statement Period: Oct 01, 2024 – Oct 31, 2024
Account Holder: ELEANOR V. VANCE (•••• 8492)
Opening Balance: $5,240.50 | Closing Balance: $7,118.35

Oct 31, 2024 | INT-00102 | Monthly Interest Paid (APY 0.75%) | CREDIT: $45.00 | BAL: $7,118.35
Oct 30, 2024 | POS-90184 | CVS Pharmacy Health & Wellness | DEBIT: $12.00 | BAL: $7,073.35
Oct 28, 2024 | POS-12903 | Starbucks Coffee #1920 | DEBIT: $14.86 | BAL: $7,085.35
Oct 26, 2024 | ACH-48190 | Chase Credit Card Auto Payment | DEBIT: $1,650.00 | BAL: $7,100.21
Oct 24, 2024 | POS-77412 | Target Supercenter Retail Purchase | DEBIT: $88.20 | BAL: $8,750.21
Oct 22, 2024 | ATM-00912 | ATM Cash Withdrawal - Main Branch | DEBIT: $200.00 | BAL: $8,838.41
Oct 20, 2024 | POS-33984 | Trader Joe's Groceries Store #22 | DEBIT: $96.45 | BAL: $9,038.41
Oct 18, 2024 | BP-49021  | ConEdison Electric Utility Bill Payment | DEBIT: $124.30 | BAL: $9,134.86
Oct 16, 2024 | ACH-91823 | Employer Payroll Direct Deposit - ACME CORP | CREDIT: $2,750.00 | BAL: $9,259.16
Oct 14, 2024 | ZLL-55201 | Zelle Transfer Received from Michael Vance | CREDIT: $180.00 | BAL: $6,509.16
Oct 11, 2024 | SUB-34190 | Netflix Digital Subscription | DEBIT: $19.99 | BAL: $6,329.16
Oct 08, 2024 | POS-88219 | Shell Fuel Station #4928 | DEBIT: $48.75 | BAL: $6,349.15
Oct 05, 2024 | POS-67321 | Whole Foods Market Store #104 | DEBIT: $142.60 | BAL: $6,397.90
Oct 03, 2024 | EFT-11843 | Mortgage Auto-Debit - Apex Home Loans | DEBIT: $1,450.00 | BAL: $6,540.50
Oct 02, 2024 | ACH-90412 | Employer Payroll Direct Deposit - ACME CORP | CREDIT: $2,750.00 | BAL: $7,990.50`,
    transactions: [
      { date: "2024-10-31", referenceNo: "INT-00102", description: "Monthly Interest Paid (APY 0.75%)", debit: 0, credit: 45.00, balance: 7118.35, type: "INCOME", category: "Interest Earned", subcategory: "Checking APY Interest", merchant: "Apex Trust Bank", aiConfidence: 99, aiExplanation: "Categorized as Interest Earned credit." },
      { date: "2024-10-30", referenceNo: "POS-90184", description: "CVS Pharmacy Health & Wellness", debit: 12.00, credit: 0, balance: 7073.35, type: "EXPENSE", category: "Health & Pharmacy", subcategory: "Pharmacy", merchant: "CVS Pharmacy", aiConfidence: 97, aiExplanation: "Recognized as Health & Pharmacy expense." },
      { date: "2024-10-28", referenceNo: "POS-12903", description: "Starbucks Coffee #1920", debit: 14.86, credit: 0, balance: 7085.35, type: "EXPENSE", category: "Groceries & Dining", subcategory: "Coffee", merchant: "Starbucks Coffee", aiConfidence: 96, aiExplanation: "Categorized under Groceries & Dining." },
      { date: "2024-10-26", referenceNo: "ACH-48190", description: "Chase Credit Card Auto Payment", debit: 1650.00, credit: 0, balance: 7100.21, type: "EXPENSE", category: "Credit Card Payments", subcategory: "Card Settlement", merchant: "Chase Credit Card", aiConfidence: 99, aiExplanation: "Categorized as Credit Card Payment auto-settlement." },
      { date: "2024-10-24", referenceNo: "POS-77412", description: "Target Supercenter Retail Purchase", debit: 88.20, credit: 0, balance: 8750.21, type: "EXPENSE", category: "Groceries & Dining", subcategory: "Retail Supercenter", merchant: "Target Supercenter", aiConfidence: 95, aiExplanation: "Categorized under Retail at Target." },
      { date: "2024-10-22", referenceNo: "ATM-00912", description: "ATM Cash Withdrawal - Main Branch", debit: 200.00, credit: 0, balance: 8838.41, type: "EXPENSE", category: "ATM Cash Withdrawal", subcategory: "Cash Withdrawal", merchant: "Apex ATM Branch", aiConfidence: 99, aiExplanation: "Identified as Main Branch ATM cash withdrawal." },
      { date: "2024-10-20", referenceNo: "POS-33984", description: "Trader Joe's Groceries Store #22", debit: 96.45, credit: 0, balance: 9038.41, type: "EXPENSE", category: "Groceries & Dining", subcategory: "Groceries", merchant: "Trader Joe's", aiConfidence: 98, aiExplanation: "Categorized as Groceries & Dining." },
      { date: "2024-10-18", referenceNo: "BP-49021", description: "ConEdison Electric Utility Bill Payment", debit: 124.30, credit: 0, balance: 9134.86, type: "EXPENSE", category: "Utilities & Electricity", subcategory: "Electric Utility", merchant: "ConEdison", aiConfidence: 99, aiExplanation: "Categorized as Electric Utility payment." },
      { date: "2024-10-16", referenceNo: "ACH-91823", description: "Employer Payroll Direct Deposit - ACME CORP", debit: 0, credit: 2750.00, balance: 9259.16, type: "INCOME", category: "Salary & Direct Deposit", subcategory: "Bi-weekly Payroll", merchant: "ACME CORP Payroll", aiConfidence: 99, aiExplanation: "Categorized as Salary Payroll Direct Deposit." },
      { date: "2024-10-14", referenceNo: "ZLL-55201", description: "Zelle Transfer Received from Michael Vance", debit: 0, credit: 180.00, balance: 6509.16, type: "INCOME", category: "Zelle Transfer Received", subcategory: "Zelle P2P", merchant: "Michael Vance", aiConfidence: 99, aiExplanation: "Identified as Zelle P2P transfer received." },
      { date: "2024-10-11", referenceNo: "SUB-34190", description: "Netflix Digital Subscription", debit: 19.99, credit: 0, balance: 6329.16, type: "EXPENSE", category: "Subscriptions & SaaS", subcategory: "Streaming", merchant: "Netflix", aiConfidence: 98, aiExplanation: "Categorized as Digital Subscription." },
      { date: "2024-10-08", referenceNo: "POS-88219", description: "Shell Fuel Station #4928", debit: 48.75, credit: 0, balance: 6349.15, type: "EXPENSE", category: "Travel & Fuel", subcategory: "Fuel Station", merchant: "Shell Fuel", aiConfidence: 98, aiExplanation: "Recognized as Travel & Fuel expense." },
      { date: "2024-10-05", referenceNo: "POS-67321", description: "Whole Foods Market Store #104", debit: 142.60, credit: 0, balance: 6397.90, type: "EXPENSE", category: "Groceries & Dining", subcategory: "Groceries", merchant: "Whole Foods Market", aiConfidence: 97, aiExplanation: "Categorized as Groceries & Dining." },
      { date: "2024-10-03", referenceNo: "EFT-11843", description: "Mortgage Auto-Debit - Apex Home Loans", debit: 1450.00, credit: 0, balance: 6540.50, type: "EXPENSE", category: "Mortgage & Housing", subcategory: "Mortgage Auto-debit", merchant: "Apex Home Loans", aiConfidence: 99, aiExplanation: "Categorized as Mortgage & Housing auto-debit." },
      { date: "2024-10-02", referenceNo: "ACH-90412", description: "Employer Payroll Direct Deposit - ACME CORP", debit: 0, credit: 2750.00, balance: 7990.50, type: "INCOME", category: "Salary & Direct Deposit", subcategory: "Bi-weekly Payroll", merchant: "ACME CORP Payroll", aiConfidence: 99, aiExplanation: "Categorized as Salary Payroll Direct Deposit." }
    ]
  }
];
