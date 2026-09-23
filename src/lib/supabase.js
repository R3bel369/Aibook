import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env ? import.meta.env.VITE_SUPABASE_URL : '';
const rawKey = import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY : '';

const supabaseUrl = (rawUrl && rawUrl.trim()) ? rawUrl.trim() : 'https://nyiwbgfdfjjdenaigpzz.supabase.co';
const supabaseAnonKey = (rawKey && rawKey.trim()) 
  ? rawKey.trim() 
  : 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function checkSupabaseConnection() {
  try {
    const { count, error } = await supabase.from('transactions').select('*', { count: 'exact', head: true });
    if (!error) {
      return {
        isConfigured: true,
        isConnected: true,
        url: supabaseUrl,
        count: count || 0,
        status: 200,
        statusText: 'OK'
      };
    }
    return {
      isConfigured: true,
      isConnected: false,
      url: supabaseUrl,
      error: error.message
    };
  } catch (error) {
    console.warn("Supabase connection check warning:", error);
    return {
      isConfigured: true,
      isConnected: false,
      url: supabaseUrl,
      error: error.message
    };
  }
}

export async function syncTransactionsToSupabase(transactions) {
  if (!transactions || !transactions.length) return { success: false, message: 'No transactions to sync' };

  try {
    const formatted = transactions.map((t, idx) => ({
      id: String(t.id || `tx_${Date.now()}_${idx}`),
      date: t.date,
      reference_no: t.referenceNo || t.reference_no || `REF-${1000 + idx}`,
      description: t.description,
      debit: Number(t.debit || 0),
      credit: Number(t.credit || 0),
      balance: Number(t.balance || 0),
      type: t.type || 'EXPENSE',
      category: t.category || 'Other Expenses',
      subcategory: t.subcategory || '',
      merchant: t.merchant || '',
      ai_confidence: Number(t.aiConfidence || 95),
      ai_explanation: t.aiExplanation || '',
      status: t.status || 'APPROVED',
      is_business_expense: Boolean(t.isBusinessExpense !== false),
      is_recurring: Boolean(t.isRecurring),
      bank_name: t.bankName || 'Apex Trust Bank',
      notes: t.notes || ''
    }));

    const { data, error } = await supabase
      .from('transactions')
      .upsert(formatted, { onConflict: 'id' });

    if (error) {
      const isMissingTable = error.code === 'PGRST205' || (error.message && (error.message.includes('not find the table') || error.message.includes('schema cache')));
      return {
        success: false,
        error: error.message,
        code: error.code,
        needsTableSetup: isMissingTable
      };
    }

    return {
      success: true,
      count: formatted.length,
      data
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
      needsTableSetup: false
    };
  }
}

export async function fetchTransactionsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    const transactions = (data || []).map(t => ({
      id: t.id,
      date: t.date,
      referenceNo: t.reference_no,
      description: t.description,
      debit: Number(t.debit),
      credit: Number(t.credit),
      balance: Number(t.balance),
      type: t.type,
      category: t.category,
      subcategory: t.subcategory,
      merchant: t.merchant,
      aiConfidence: Number(t.ai_confidence),
      aiExplanation: t.ai_explanation,
      status: t.status,
      isBusinessExpense: t.is_business_expense,
      isRecurring: t.is_recurring,
      bankName: t.bank_name,
      notes: t.notes
    }));

    return { success: true, transactions };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
