// AI API Integration Service for Bank Statement Analysis & Financial Intelligence
// Supports Google Gemini, Anthropic Claude, and OpenAI APIs with Fallback

const CONFIG_STORAGE_KEY = "ai_bookkeeper_api_config";

export const AI_PROVIDERS = [
  {
    id: "gemini",
    name: "Google Gemini",
    icon: "Sparkles",
    badge: "Recommended / 100% Free Tier",
    description: "Google Gemini 1.5/2.5 Flash - Ultra fast, zero cost API key available at AI Studio",
    defaultModel: "gemini-1.5-flash",
    models: [
      { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash (Fast & Stable - Free Tier)" },
      { id: "gemini-1.5-flash-latest", name: "Gemini 1.5 Flash Latest (Auto-Updating)" },
      { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro (Deep Accounting Reasoning)" }
    ],
    keyDocsUrl: "https://aistudio.google.com/app/apikey"
  },
  {
    id: "claude",
    name: "Anthropic Claude",
    icon: "Brain",
    badge: "Superior Reasoning",
    description: "Claude 3.5 Sonnet / Haiku - Unmatched precision in financial audit & complex statements",
    defaultModel: "claude-3-5-sonnet-20241022",
    models: [
      { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet (Best Precision & Analysis)" },
      { id: "claude-3-haiku-20240307", name: "Claude 3 Haiku (Lightning Fast)" }
    ],
    keyDocsUrl: "https://console.anthropic.com/settings/keys"
  },
  {
    id: "openai",
    name: "OpenAI GPT-4o",
    icon: "Zap",
    badge: "Requires Pre-paid Billing",
    description: "GPT-4o / GPT-4o-mini - Requires pre-paid credit balance ($5 min) on platform.openai.com",
    defaultModel: "gpt-4o-mini",
    models: [
      { id: "gpt-4o-mini", name: "GPT-4o Mini (Efficient & Fast)" },
      { id: "gpt-4o", name: "GPT-4o (Omni High Performance)" }
    ],
    keyDocsUrl: "https://platform.openai.com/api-keys"
  }
];

export function getAiApiConfig() {
  try {
    const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : {};

    let geminiModel = parsed.geminiModel || "gemini-1.5-flash";
    if (geminiModel === "gemini-2.0-flash") {
      geminiModel = "gemini-1.5-flash";
    }

    return {
      provider: parsed.provider || "gemini",
      geminiApiKey: (parsed.geminiApiKey && parsed.geminiApiKey.trim()) ? parsed.geminiApiKey : (import.meta.env ? import.meta.env.VITE_GEMINI_API_KEY || "" : ""),
      claudeApiKey: (parsed.claudeApiKey && parsed.claudeApiKey.trim()) ? parsed.claudeApiKey : (import.meta.env ? import.meta.env.VITE_CLAUDE_API_KEY || "" : ""),
      openaiApiKey: (parsed.openaiApiKey && parsed.openaiApiKey.trim()) ? parsed.openaiApiKey : (import.meta.env ? import.meta.env.VITE_OPENAI_API_KEY || "" : ""),
      geminiModel: geminiModel,
      claudeModel: parsed.claudeModel || "claude-3-5-sonnet-20241022",
      openaiModel: parsed.openaiModel || "gpt-4o-mini",
      enableAiApi: parsed.enableAiApi !== false
    };
  } catch (e) {
    return {
      provider: "gemini",
      geminiApiKey: "",
      claudeApiKey: "",
      openaiApiKey: "",
      geminiModel: "gemini-1.5-flash",
      claudeModel: "claude-3-5-sonnet-20241022",
      openaiModel: "gpt-4o-mini",
      enableAiApi: true
    };
  }
}

export function saveAiApiConfig(newConfig) {
  try {
    const current = getAiApiConfig();
    const updated = { ...current, ...newConfig };
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to save AI config to localStorage:", e);
    return newConfig;
  }
}

// Active API Key helper
export function getActiveApiKey(config = getAiApiConfig()) {
  if (config.provider === "gemini") return config.geminiApiKey;
  if (config.provider === "claude") return config.claudeApiKey;
  if (config.provider === "openai") return config.openaiApiKey;
  return "";
}

// Helper to sanitize & extract JSON from LLM markdown codeblocks
function cleanJsonOutput(rawResponseText) {
  if (!rawResponseText) return "";
  let clean = rawResponseText.trim();
  if (clean.startsWith("```json")) {
    clean = clean.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (clean.startsWith("```")) {
    clean = clean.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  return clean.trim();
}

// Core LLM caller
export async function callAiApi({ systemPrompt = "", prompt = "", jsonMode = true }) {
  const config = getAiApiConfig();
  const apiKey = getActiveApiKey(config);

  if (!apiKey) {
    throw new Error(`NO_API_KEY:${config.provider.toUpperCase()}`);
  }

  if (config.provider === "gemini") {
    return await callGeminiApi(config.geminiApiKey, config.geminiModel, systemPrompt, prompt, jsonMode);
  } else if (config.provider === "claude") {
    return await callClaudeApi(config.claudeApiKey, config.claudeModel, systemPrompt, prompt, jsonMode);
  } else if (config.provider === "openai") {
    return await callOpenAiApi(config.openaiApiKey, config.openaiModel, systemPrompt, prompt, jsonMode);
  }

  throw new Error(`Unsupported AI Provider: ${config.provider}`);
}

// 1. Google Gemini API Handler with Multi-Model Fallback
async function callGeminiApi(apiKey, model, systemPrompt, userPrompt, jsonMode) {
  const cleanKey = (apiKey || "").trim();

  // List of fallback model names to try in sequence
  const modelCandidates = [
    model || "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro"
  ].filter(Boolean);

  const uniqueModels = [...new Set(modelCandidates)].filter(m => m !== "gemini-2.0-flash");
  let lastError = null;

  for (const activeModel of uniqueModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${activeModel}:generateContent?key=${cleanKey}`;

      const contents = [
        {
          role: "user",
          parts: [
            { text: systemPrompt ? `${systemPrompt}\n\nUSER REQUEST / INPUT:\n${userPrompt}` : userPrompt }
          ]
        }
      ];

      const body = {
        contents,
        generationConfig: {
          temperature: 0.2,
          responseMimeType: jsonMode ? "application/json" : "text/plain"
        }
      };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.error?.message || `Gemini API HTTP Error ${response.status}`;

        if (errorMsg.includes("API key not valid") || errorMsg.includes("API_KEY_INVALID") || response.status === 400) {
          throw new Error(`Invalid Gemini API Key ("${cleanKey.slice(0, 8)}..."). Google Gemini API keys start with 'AIzaSy...'. Get a free 1-click key at https://aistudio.google.com/app/apikey`);
        }

        lastError = new Error(errorMsg);
        if (response.status === 404 || errorMsg.includes("not found")) {
          continue; // Try next model candidate
        }
        throw lastError;
      }

      const data = await response.json();
      const candidate = data.candidates?.[0];
      const text = candidate?.content?.parts?.[0]?.text || "";
      return cleanJsonOutput(text);
    } catch (err) {
      lastError = err;
      if (err.message.includes("Invalid Gemini API Key")) {
        throw err;
      }
    }
  }

  throw lastError || new Error("Gemini API connection failed.");
}

// 2. Anthropic Claude API Handler
async function callClaudeApi(apiKey, model, systemPrompt, userPrompt, jsonMode) {
  const url = "https://api.anthropic.com/v1/messages";

  const body = {
    model: model || "claude-3-5-sonnet-20241022",
    max_tokens: 4096,
    temperature: 0.2,
    system: systemPrompt + (jsonMode ? "\nReturn ONLY valid JSON without Markdown text." : ""),
    messages: [
      { role: "user", content: userPrompt }
    ]
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey.trim(),
      "anthropic-version": "2023-06-01",
      "dangerously-allow-browser": "true"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Claude API HTTP Error ${response.status}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text || "";
  return cleanJsonOutput(text);
}

// 3. OpenAI GPT API Handler
async function callOpenAiApi(apiKey, model, systemPrompt, userPrompt, jsonMode) {
  const url = "https://api.openai.com/v1/chat/completions";

  const messages = [];
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: userPrompt });

  const body = {
    model: model || "gpt-4o-mini",
    temperature: 0.2,
    messages
  };

  if (jsonMode) {
    body.response_format = { type: "json_object" };
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey.trim()}`
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const rawMsg = errorData.error?.message || `OpenAI API HTTP Error ${response.status}`;
    if (errorData.error?.code === "insufficient_quota" || rawMsg.includes("quota")) {
      throw new Error("OpenAI API error: Insufficient Quota. OpenAI requires a pre-paid credit balance ($5 min at platform.openai.com/account/billing). Tip: Switch to Google Gemini for a 100% free tier key at aistudio.google.com!");
    }
    throw new Error(rawMsg);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "";
  return cleanJsonOutput(text);
}

// ==========================================
// HIGH LEVEL AI DOMAIN FUNCTIONS
// ==========================================

export async function analyzeBankStatementWithAI(rawText, fileName = "Statement.pdf") {
  const config = getAiApiConfig();
  const apiKey = getActiveApiKey(config);
  
  if (!apiKey) {
    throw new Error("NO_API_KEY");
  }

  const systemPrompt = `You are a Senior Certified Public Accountant (CPA) and AI Financial Extraction Expert.
Your task is to analyze raw bank statement text (extracted via OCR or text parsing) and parse EVERY SINGLE transaction into clean, structured JSON format.

RULES:
1. Return ONLY valid JSON matching this schema:
{
  "bankName": "Name of Bank (e.g. Chase, HDFC, Apex Trust Bank)",
  "accountNumber": "Last 4 digits or ID if found, else N/A",
  "openingBalance": number or 0,
  "closingBalance": number or 0,
  "currency": "USD" or "INR" or "EUR",
  "transactions": [
    {
      "date": "YYYY-MM-DD",
      "referenceNo": "Ref/Check/TXN number or generated REF-1001",
      "description": "Full original description",
      "debit": number (0 if credit),
      "credit": number (0 if debit),
      "balance": number,
      "category": "One of: Sales Revenue, Salary Income, Software & SaaS, Office Rent & Lease, Marketing & Advertising, Salaries & Wages, Travel & Transport, Food & Client Dining, Utilities & Electricity, Office Supplies, Investment Income, Refund & Cashbacks, Other Expenses",
      "subcategory": "Specific detail",
      "merchant": "Vendor/Payer Name",
      "confidence": "high" or "medium" or "low",
      "aiExplanation": "Why this category was chosen",
      "isBusinessExpense": boolean,
      "isRecurring": boolean
    }
  ]
}

2. Calculate debit vs credit carefully. If a number is spent/withdrawn, debit > 0 and credit = 0. If deposited/received, credit > 0 and debit = 0.
3. Ensure dates are standardized as YYYY-MM-DD.
4. Do not drop any transactions. Extract all transaction line items found in the raw text.`;

  const prompt = `Analyze this bank statement file content ("${fileName}") and extract all ledger transactions from ALL pages without dropping any line items:

--- RAW STATEMENT TEXT ---
${rawText.slice(0, 60000)}
--- END STATEMENT TEXT ---`;

  const jsonResponse = await callAiApi({ systemPrompt, prompt, jsonMode: true });
  return JSON.parse(jsonResponse);
}

export async function askAIAssistant(userQuery, transactions = [], financialTotals = {}, userContext = {}) {
  const config = getAiApiConfig();
  const apiKey = getActiveApiKey(config);

  if (!apiKey) {
    throw new Error("NO_API_KEY");
  }

  const topTransactionsSummary = transactions.slice(0, 30).map(t => 
    `${t.date} | ${t.description} | Category: ${t.category} | Debit: $${t.debit} | Credit: $${t.credit}`
  ).join("\n");

  const systemPrompt = `You are the AI Financial Advisor & Bookkeeper for ${userContext.businessName || "the business"}.
You have direct access to their active bank statement records and financial metrics.

FINANCIAL CONTEXT:
- Business Name: ${userContext.businessName || "My Business"}
- Currency: ${userContext.currency || "USD"}
- Total Revenue / Income: $${financialTotals.totalIncome || 0}
- Total Expenses: $${financialTotals.totalExpenses || 0}
- Net Profit: $${financialTotals.netProfit || 0}
- Total Transactions Loaded: ${transactions.length}

ACTIVE LEDGER TRANSACTIONS SNAPSHOT:
${topTransactionsSummary}

INSTRUCTIONS:
- Answer the user's question clearly, concisely, and accurately based on their financial data.
- Provide practical tax savings tips, expense management insights, or breakdown numbers where appropriate.
- Format response with clear markdown, bold key figures, and bullet points.`;

  return await callAiApi({ systemPrompt, prompt: userQuery, jsonMode: false });
}

export async function generateFinancialAnalysisWithAI(transactions = [], financialTotals = {}, userContext = {}) {
  const config = getAiApiConfig();
  const apiKey = getActiveApiKey(config);

  if (!apiKey) {
    throw new Error("NO_API_KEY");
  }

  const transactionsSummary = transactions.slice(0, 40).map(t => 
    `${t.date} | ${t.description} | ${t.category} | ${t.debit ? 'Spent: $' + t.debit : 'Received: $' + t.credit}`
  ).join("\n");

  const systemPrompt = `You are a Chief Financial Officer (CFO) and Tax Strategist.
Analyze the user's active transaction ledger and generate a structured JSON Financial Audit Report.

Return JSON matching this schema:
{
  "auditScore": number (0 to 100),
  "healthStatus": "EXCELLENT" or "STABLE" or "ATTENTION_NEEDED",
  "executiveSummary": "Concise summary of business cash flow & P&L health",
  "keyRecommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
  "anomaliesDetected": [
    {
      "title": "Anomaly title",
      "description": "Details",
      "severity": "high" or "medium" or "low"
    }
  ],
  "taxSavingsOpportunities": [
    {
      "opportunity": "Title",
      "estimatedSavings": "Dollar amount or estimate",
      "actionItem": "What user should do"
    }
  ],
  "recurringSubscriptionAudit": "Analysis of software & monthly recurring charges"
}`;

  const prompt = `Analyze financial data for ${userContext.businessName || "Business"}:
Total Income: $${financialTotals.totalIncome || 0}
Total Expenses: $${financialTotals.totalExpenses || 0}
Net Profit: $${financialTotals.netProfit || 0}

Ledger Records:
${transactionsSummary}`;

  const jsonResponse = await callAiApi({ systemPrompt, prompt, jsonMode: true });
  return JSON.parse(jsonResponse);
}

export async function testAiApiConnection(provider, apiKey, model) {
  if (!apiKey || !apiKey.trim()) {
    return { success: false, message: "API key cannot be empty." };
  }

  try {
    let activeModel = model || "gemini-1.5-flash";
    if (activeModel === "gemini-2.0-flash") activeModel = "gemini-1.5-flash";

    const testConfig = {
      provider,
      geminiApiKey: provider === "gemini" ? apiKey : "",
      claudeApiKey: provider === "claude" ? apiKey : "",
      openaiApiKey: provider === "openai" ? apiKey : "",
      geminiModel: activeModel,
      claudeModel: model || "claude-3-5-sonnet-20241022",
      openaiModel: model || "gpt-4o-mini"
    };

    let result = "";
    if (provider === "gemini") {
      result = await callGeminiApi(apiKey, testConfig.geminiModel, "", "Ping test. Respond with JSON: {\"status\": \"ok\"}", true);
    } else if (provider === "claude") {
      result = await callClaudeApi(apiKey, testConfig.claudeModel, "", "Ping test. Respond with JSON: {\"status\": \"ok\"}", true);
    } else if (provider === "openai") {
      result = await callOpenAiApi(apiKey, testConfig.openaiModel, "", "Ping test. Respond with JSON: {\"status\": \"ok\"}", true);
    }

    if (result && (result.includes("ok") || result.includes("status"))) {
      return { success: true, message: `Connected successfully to ${provider.toUpperCase()} API (${testConfig.geminiModel || model})!` };
    }
    return { success: true, message: `Response received from ${provider.toUpperCase()} API.` };
  } catch (err) {
    return { success: false, message: err.message || "Failed to authenticate API key." };
  }
}
