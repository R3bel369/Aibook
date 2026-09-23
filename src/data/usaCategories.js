// Comprehensive USA Bank Statement Categories for Bookkeeping & Accounting
// Covers Chase, Bank of America, Wells Fargo, Citi, Capital One, US Bank, Amex, Fidelity, Schwab, etc.

export const USA_BANK_CATEGORIES = {
  INCOME: [
    {
      id: "inc_payroll",
      name: "Salary & Direct Deposit",
      group: "Primary Income",
      description: "Employer W-2 salary, payroll direct deposits, stipend payments",
      examples: ["Payroll Direct Deposit", "ADP Payroll", "Gusto Payroll", "Paychex"]
    },
    {
      id: "inc_sales",
      name: "Sales Revenue & Customer Invoices",
      group: "Primary Income",
      description: "Customer invoice payouts, business sales receipts",
      examples: ["Client Payout", "Invoice #1024", "Square Sales", "POS Deposit"]
    },
    {
      id: "inc_merchant",
      name: "Merchant Services & Payment Processing",
      group: "Primary Income",
      description: "Stripe, Square, PayPal, Clover, Shopify merchant payouts",
      examples: ["Stripe Transfer", "PayPal Payout", "Shopify Payout", "Clover Deposit"]
    },
    {
      id: "inc_p2p",
      name: "Zelle / Venmo / CashApp Inflow",
      group: "Transfers & P2P",
      description: "Incoming P2P transfer payments from clients or associates",
      examples: ["Zelle Transfer Recd", "Venmo Cashout", "CashApp Transfer"]
    },
    {
      id: "inc_interest",
      name: "Interest & Yield Income",
      group: "Investments & Banking",
      description: "Checking, savings APY interest, money market dividends",
      examples: ["Monthly Interest Paid", "APY Earned", "Money Market Interest"]
    },
    {
      id: "inc_dividends",
      name: "Dividends & Investment Capital",
      group: "Investments & Banking",
      description: "Stock dividends, mutual fund payouts, capital gains",
      examples: ["Fidelity Dividend", "Schwab Distribution", "Vanguard Dividend"]
    },
    {
      id: "inc_refunds",
      name: "Refunds, Returns & Cashbacks",
      group: "Adjustments & Rewards",
      description: "Merchant refunds, credit card cashback rewards, returned items",
      examples: ["Amazon Refund", "Statement Reward Credit", "Merchant Return"]
    },
    {
      id: "inc_transfer_in",
      name: "Internal & External Transfers In",
      group: "Transfers & P2P",
      description: "ACH credits, wire transfers received, inter-account transfers",
      examples: ["Online Transfer From Checking", "Wire Credit", "ACH Deposit"]
    },
    {
      id: "inc_tax_refund",
      name: "Tax Refunds (IRS & State)",
      group: "Government & Tax",
      description: "IRS Federal tax refunds, State Department of Revenue refunds",
      examples: ["IRS Treas 310 Tax Ref", "State Tax Refund"]
    },
    {
      id: "inc_capital",
      name: "Owner Capital & Equity Contribution",
      group: "Equity & Loans",
      description: "Owner equity injection, partner investment funds",
      examples: ["Owner Capital Deposit", "Member Contribution"]
    },
    {
      id: "inc_loans",
      name: "Grants, Loans & Financing",
      group: "Equity & Loans",
      description: "SBA loans, line of credit drawdowns, business financing",
      examples: ["SBA Loan Disbursement", "Line of Credit Advance"]
    },
    {
      id: "inc_rental",
      name: "Rental & Real Estate Income",
      group: "Primary Income",
      description: "Tenant rental payments, lease income, property earnings",
      examples: ["Tenant Rent Credit", "Property Lease Income"]
    },
    {
      id: "inc_other",
      name: "Other Income",
      group: "Miscellaneous",
      description: "Miscellaneous credits and unclassified inflow",
      examples: ["Misc Credit", "Uncategorized Deposit"]
    }
  ],

  EXPENSES: [
    {
      id: "exp_marketing",
      name: "Marketing & Advertising",
      group: "Operating Expenses",
      description: "Digital ads (Google, Meta, LinkedIn), promos, sponsorships",
      examples: ["Google Ads", "Meta Ads / Facebook", "LinkedIn Ads", "TikTok Ads"]
    },
    {
      id: "exp_software",
      name: "Software, Cloud & SaaS",
      group: "Technology & Operations",
      description: "Cloud hosting, dev tools, workspace productivity apps",
      examples: ["AWS", "Google Workspace", "GitHub", "Adobe Creative", "Zoom", "Slack", "OpenAI / ChatGPT"]
    },
    {
      id: "exp_rent",
      name: "Office Rent & Coworking",
      group: "Facilities & Real Estate",
      description: "Commercial lease, WeWork/Regus coworking spaces, storage units",
      examples: ["Office Rent Lease", "WeWork Workspace", "Public Storage"]
    },
    {
      id: "exp_utilities",
      name: "Utilities & Telecom",
      group: "Facilities & Real Estate",
      description: "Electric, water, gas, internet, mobile phone bills",
      examples: ["ConEdison / Electric", "AT&T Business", "Verizon Wireless", "Comcast Xfinity", "Water & Waste"]
    },
    {
      id: "exp_payroll",
      name: "Payroll, Wages & Contractors",
      group: "Personnel & Labor",
      description: "W-2 employee wages, 1099 contractor payments, stipends",
      examples: ["Gusto Payroll Pay", "ADP Payroll Debit", "1099 Contractor Payout"]
    },
    {
      id: "exp_prof_services",
      name: "Professional & Legal Services",
      group: "Professional Services",
      description: "Legal retainers, CPA accounting, tax advisory, consultants",
      examples: ["Legal Counsel Fee", "CPA Accounting Services", "Consulting Fee"]
    },
    {
      id: "exp_cc_payment",
      name: "Credit Card Payments & Auto-Pay",
      group: "Banking & Debt",
      description: "Monthly credit card bill payoffs via ACH debit",
      examples: ["Chase Credit Card AutoPay", "Amex EPAYment", "Capital One Payment"]
    },
    {
      id: "exp_mortgage",
      name: "Mortgage & Real Estate Loans",
      group: "Facilities & Real Estate",
      description: "Commercial or residential bank mortgage loan payments",
      examples: ["Bank Mortgage Payment", "Apex Home Loans Auto Debit"]
    },
    {
      id: "exp_travel",
      name: "Travel & Lodging",
      group: "Travel & Entertainment",
      description: "Airlines, hotels, car rentals, rideshare services",
      examples: ["Delta Air Lines", "United Airlines", "Marriott Hotel", "Uber", "Lyft", "Hertz Rent-A-Car"]
    },
    {
      id: "exp_meals",
      name: "Meals, Dining & Entertainment",
      group: "Travel & Entertainment",
      description: "Client business meals, team lunches, coffee, restaurants",
      examples: ["Starbucks", "DoorDash", "Uber Eats", "Local Bistro / Restaurant", "Whole Foods Market"]
    },
    {
      id: "exp_vehicle",
      name: "Vehicle, Fuel & Parking",
      group: "Travel & Entertainment",
      description: "Gas stations, EV charging, tolls, parking, auto maintenance",
      examples: ["Shell Gas Station", "Chevron", "E-ZPass Toll", "City Parking Meter", "Jiffy Lube"]
    },
    {
      id: "exp_office_supplies",
      name: "Office Supplies & Equipment",
      group: "Operating Expenses",
      description: "Stationery, tech hardware, computers, office furniture",
      examples: ["Amazon Business", "Staples", "Apple Store Hardware", "Best Buy Office"]
    },
    {
      id: "exp_insurance",
      name: "Insurance (Business, Health, Auto)",
      group: "Risk & Compliance",
      description: "Commercial liability, workers comp, health insurance",
      examples: ["Geico Commercial", "Blue Cross Health", "Hartford Business Insurance"]
    },
    {
      id: "exp_bank_fees",
      name: "Bank Fees & Service Charges",
      group: "Banking & Debt",
      description: "Monthly account maintenance, wire transfer fee, overdraft, ATM fee",
      examples: ["Monthly Service Charge", "Outgoing Wire Fee", "Non-Network ATM Fee"]
    },
    {
      id: "exp_taxes",
      name: "Taxes & Licenses",
      group: "Government & Tax",
      description: "IRS estimated tax payments, state sales tax, local permits",
      examples: ["EFTPS USA Tax Payment", "State Sales Tax Payment", "City License Fee"]
    },
    {
      id: "exp_subscriptions",
      name: "Subscriptions & Dues",
      group: "Operating Expenses",
      description: "Trade association dues, news publications, subscriptions",
      examples: ["Wall Street Journal", "NY Times Subscription", "Chamber of Commerce Dues"]
    },
    {
      id: "exp_transfer_out",
      name: "Transfers Out & Wire Out",
      group: "Transfers & P2P",
      description: "ACH debits out, wire transfers sent, inter-account transfers",
      examples: ["Online Transfer To Savings", "Outgoing Wire Transfer"]
    },
    {
      id: "exp_atm",
      name: "ATM & Cash Withdrawals",
      group: "Banking & Debt",
      description: "Branch ATM cash withdrawals",
      examples: ["Branch ATM Cash Withdrawal"]
    },
    {
      id: "exp_cogs",
      name: "Cost of Goods Sold (COGS)",
      group: "Direct Costs",
      description: "Raw materials, inventory purchases, wholesale supplies",
      examples: ["Wholesale Material Supply", "Inventory Bulk Purchase"]
    },
    {
      id: "exp_repairs",
      name: "Repairs & Maintenance",
      group: "Facilities & Real Estate",
      description: "Facility maintenance, equipment repairs, IT maintenance",
      examples: ["HVAC Repair Service", "IT Maintenance Corp"]
    },
    {
      id: "exp_donations",
      name: "Charitable Donations",
      group: "Miscellaneous",
      description: "501(c)(3) tax-deductible non-profit contributions",
      examples: ["Red Cross Donation", "Local Non-Profit Charity"]
    },
    {
      id: "exp_other",
      name: "Other Expenses",
      group: "Miscellaneous",
      description: "General uncategorized business expenses",
      examples: ["Misc Expense", "General Business Outflow"]
    }
  ]
};

// Flattened arrays for quick selects
export const USA_INCOME_CATEGORY_NAMES = USA_BANK_CATEGORIES.INCOME.map(c => c.name);
export const USA_EXPENSE_CATEGORY_NAMES = USA_BANK_CATEGORIES.EXPENSES.map(c => c.name);
export const ALL_USA_CATEGORY_NAMES = [
  ...USA_INCOME_CATEGORY_NAMES,
  ...USA_EXPENSE_CATEGORY_NAMES
];

// Helper to check if a category is Income/Inflow
export function isIncomeCategory(categoryName) {
  if (!categoryName) return false;
  const nameLower = categoryName.toLowerCase();
  return (
    nameLower.includes("income") ||
    nameLower.includes("deposit") ||
    nameLower.includes("salary") ||
    nameLower.includes("revenue") ||
    nameLower.includes("inflow") ||
    nameLower.includes("yield") ||
    nameLower.includes("dividend") ||
    nameLower.includes("refund") ||
    nameLower.includes("credit") ||
    nameLower.includes("gain") ||
    USA_INCOME_CATEGORY_NAMES.includes(categoryName)
  );
}
