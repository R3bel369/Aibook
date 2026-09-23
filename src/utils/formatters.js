// Currency and visual formatters for AI Bookkeeping app

export const CURRENCY_SYMBOLS = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£"
};

export function formatCurrency(amount, currencyCode = "USD", showDecimals = true) {
  const symbol = CURRENCY_SYMBOLS[currencyCode] || "$";
  const absAmount = Math.abs(amount || 0);

  let formattedNumber;
  if (currencyCode === "INR") {
    // Indian Numbering format (Lakhs / Crores)
    formattedNumber = absAmount.toLocaleString("en-IN", {
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0
    });
  } else {
    formattedNumber = absAmount.toLocaleString("en-US", {
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0
    });
  }

  const prefix = amount < 0 ? "-" : "";
  return `${prefix}${symbol}${formattedNumber}`;
}

export function formatDate(dateString) {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  } catch (e) {
    return dateString;
  }
}

export function formatPercent(value) {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value}%`;
}

export function getCategoryBadgeColor(categoryName) {
  const name = (categoryName || "").toLowerCase();

  if (name.includes("sales") || name.includes("income") || name.includes("consulting") || name.includes("freelance")) {
    return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
  }
  if (name.includes("rent") || name.includes("lease")) {
    return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
  }
  if (name.includes("marketing") || name.includes("ads") || name.includes("advertising")) {
    return "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20";
  }
  if (name.includes("software") || name.includes("saas") || name.includes("cloud")) {
    return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
  }
  if (name.includes("salary") || name.includes("wages") || name.includes("payroll")) {
    return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
  }
  if (name.includes("food") || name.includes("dining")) {
    return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20";
  }
  if (name.includes("travel") || name.includes("transport")) {
    return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20";
  }
  if (name.includes("utility") || name.includes("electricity")) {
    return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
  }
  if (name.includes("office") || name.includes("supplies")) {
    return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
  }
  return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
}
