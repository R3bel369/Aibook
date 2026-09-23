// AI Transaction Categorization & Explanation Engine

const USER_CORRECTION_MEMORY_KEY = "ai_bookkeeper_user_rules";

// Fetch user custom learning overrides from localStorage
function getUserRules() {
  try {
    const saved = localStorage.getItem(USER_CORRECTION_MEMORY_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    return {};
  }
}

// Save user correction to memory so AI learns for future matching
export function saveUserCategorizationRule(keyword, newCategory, subcategory) {
  try {
    const rules = getUserRules();
    rules[keyword.toUpperCase().trim()] = { category: newCategory, subcategory };
    localStorage.setItem(USER_CORRECTION_MEMORY_KEY, JSON.stringify(rules));
  } catch (e) {
    console.error("Failed to save user rule", e);
  }
}

export function categorizeTransaction(description = "", debit = 0, credit = 0) {
  const descUpper = description.toUpperCase().trim();
  const userRules = getUserRules();

  // 1. Check User Learned Memory Rules first
  for (const [key, rule] of Object.entries(userRules)) {
    if (descUpper.includes(key)) {
      return {
        category: rule.category,
        subcategory: rule.subcategory || "Custom Category",
        type: credit > 0 ? "INCOME" : "EXPENSE",
        aiConfidence: 100,
        aiExplanation: `Categorized as '${rule.category}' based on your previous manual categorization rule for '${key}'.`
      };
    }
  }

  // 2. Direct Rule-based AI Engine
  if (credit > 0) {
    if (descUpper.includes("SALARY") || descUpper.includes("PAYROLL")) {
      return {
        category: "Salary Income",
        subcategory: "Direct Deposit",
        type: "INCOME",
        aiConfidence: 99,
        aiExplanation: "Categorized as Salary Income because the transaction description contains payroll salary references."
      };
    }
    if (descUpper.includes("CLIENT") || descUpper.includes("INVOICE") || descUpper.includes("PAYOUT") || descUpper.includes("RETAINER") || descUpper.includes("CORP")) {
      return {
        category: "Sales Revenue",
        subcategory: "Client Payment",
        type: "INCOME",
        aiConfidence: 98,
        aiExplanation: "Identified as Sales Revenue because the credit description contains client invoice payout indicators."
      };
    }
    if (descUpper.includes("FREELANCE") || descUpper.includes("CONSULTING") || descUpper.includes("PROJECT")) {
      return {
        category: "Freelance / Consulting",
        subcategory: "Consulting Fee",
        type: "INCOME",
        aiConfidence: 96,
        aiExplanation: "Categorized as Freelance / Consulting based on contractor payout terms in description."
      };
    }
    if (descUpper.includes("REFUND") || descUpper.includes("CASHBACK") || descUpper.includes("REVERSAL")) {
      return {
        category: "Refund & Cashbacks",
        subcategory: "Merchant Refund",
        type: "INCOME",
        aiConfidence: 95,
        aiExplanation: "Categorized as Refund & Cashbacks due to credit reversal terminology."
      };
    }
    if (descUpper.includes("DIVIDEND") || descUpper.includes("INTEREST") || descUpper.includes("MUTUAL")) {
      return {
        category: "Investment Income",
        subcategory: "Dividends & Interest",
        type: "INCOME",
        aiConfidence: 94,
        aiExplanation: "Recognized as Investment Income from interest or dividend distributions."
      };
    }
    return {
      category: "Other Income",
      subcategory: "General Credit",
      type: "INCOME",
      aiConfidence: 85,
      aiExplanation: "Categorized as Other Income credit to bank account."
    };
  }

  // Expenses Engine
  if (descUpper.includes("GOOGLE ADS") || descUpper.includes("META ADS") || descUpper.includes("FACEBOOK ADS") || descUpper.includes("MARKETING")) {
    return {
      category: "Marketing & Advertising",
      subcategory: "Digital Advertising",
      type: "EXPENSE",
      aiConfidence: 98,
      aiExplanation: "This transaction was categorized as Marketing & Advertising because the description contains online ad platform identifiers (Google/Meta Ads)."
    };
  }
  if (descUpper.includes("WEWORK") || descUpper.includes("RENT") || descUpper.includes("LEASE") || descUpper.includes("REGUS")) {
    return {
      category: "Office Rent & Lease",
      subcategory: "Workspace Lease",
      type: "EXPENSE",
      aiConfidence: 97,
      aiExplanation: "Categorized as Office Rent & Lease based on workspace provider vendor name and monthly rental terms."
    };
  }
  if (descUpper.includes("AWS") || descUpper.includes("AMAZON WEB SERVICES") || descUpper.includes("GOOGLE WORKSPACE") || descUpper.includes("CHATGPT") || descUpper.includes("OPENAI") || descUpper.includes("GITHUB") || descUpper.includes("HEROKU") || descUpper.includes("ADOBE") || descUpper.includes("ZOOM")) {
    return {
      category: "Software & SaaS",
      subcategory: "Cloud & Dev Tools",
      type: "EXPENSE",
      aiConfidence: 96,
      aiExplanation: "Recognized as Software & SaaS expense because the merchant is a verified digital service software vendor."
    };
  }
  if (descUpper.includes("SALARY") || descUpper.includes("PAYROLL") || descUpper.includes("STIPEND") || descUpper.includes("BONUS")) {
    return {
      category: "Salaries & Wages",
      subcategory: "Employee Payroll",
      type: "EXPENSE",
      aiConfidence: 99,
      aiExplanation: "Identified as Salaries & Wages due to payroll batch transfer keywords."
    };
  }
  if (descUpper.includes("UBER") || descUpper.includes("OLA") || descUpper.includes("AIR INDIA") || descUpper.includes("INDIGO") || descUpper.includes("FLIGHT") || descUpper.includes("PETROL") || descUpper.includes("FUEL")) {
    return {
      category: "Travel & Transport",
      subcategory: "Business Travel",
      type: "EXPENSE",
      aiConfidence: 95,
      aiExplanation: "Categorized as Travel & Transport because the merchant is a commercial airline, cab, or transit service."
    };
  }
  if (descUpper.includes("SWIGGY") || descUpper.includes("ZOMATO") || descUpper.includes("STARBUCKS") || descUpper.includes("DINING") || descUpper.includes("RESTAURANT")) {
    return {
      category: "Food & Client Dining",
      subcategory: "Team Meals",
      type: "EXPENSE",
      aiConfidence: 94,
      aiExplanation: "Categorized as Food & Client Dining based on restaurant and food delivery merchant keywords."
    };
  }
  if (descUpper.includes("NETFLIX") || descUpper.includes("SPOTIFY") || descUpper.includes("PRIME") || descUpper.includes("DISNEY")) {
    return {
      category: "Entertainment",
      subcategory: "Streaming Subscriptions",
      type: "EXPENSE",
      aiConfidence: 98,
      aiExplanation: "Detected monthly subscription to digital media entertainment service."
    };
  }
  if (descUpper.includes("ELECTRICITY") || descUpper.includes("BESCOM") || descUpper.includes("UTILITY") || descUpper.includes("WATER") || descUpper.includes("INTERNET") || descUpper.includes("AIRTEL") || descUpper.includes("JIO")) {
    return {
      category: "Utilities & Electricity",
      subcategory: "Office Utilities",
      type: "EXPENSE",
      aiConfidence: 99,
      aiExplanation: "Identified as Utilities & Electricity based on utility provider account billing format."
    };
  }
  if (descUpper.includes("APPLE") || descUpper.includes("AMAZON") || descUpper.includes("STATIONERY") || descUpper.includes("DELL") || descUpper.includes("LENOVO")) {
    return {
      category: "Office Supplies",
      subcategory: "Hardware & Equipment",
      type: "EXPENSE",
      aiConfidence: 91,
      aiExplanation: "Categorized as Office Supplies / Hardware asset purchase from retail vendor."
    };
  }

  // Low confidence default
  return {
    category: "Other Expenses",
    subcategory: "General Expense",
    type: "EXPENSE",
    aiConfidence: 58,
    aiExplanation: "Assigned default category 'Other Expenses' due to lack of distinct merchant match in description."
  };
}
