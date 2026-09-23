-- ====================================================================
-- SUPABASE DATABASE SCHEMA SETUP FOR AI BOOKKEEPING APP
-- Copy and run this script in Supabase Dashboard -> SQL Editor
-- ====================================================================

-- 1. Create Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
    id TEXT PRIMARY KEY,
    date DATE NOT NULL,
    reference_no TEXT,
    description TEXT NOT NULL,
    debit NUMERIC(12, 2) DEFAULT 0,
    credit NUMERIC(12, 2) DEFAULT 0,
    balance NUMERIC(12, 2) DEFAULT 0,
    type TEXT DEFAULT 'EXPENSE',
    category TEXT DEFAULT 'Other Expenses',
    subcategory TEXT,
    merchant TEXT,
    ai_confidence NUMERIC(5, 2) DEFAULT 95,
    ai_explanation TEXT,
    status TEXT DEFAULT 'APPROVED',
    is_business_expense BOOLEAN DEFAULT TRUE,
    is_recurring BOOLEAN DEFAULT FALSE,
    bank_name TEXT DEFAULT 'Apex Trust Bank',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies allowing full read/write access for public key
DROP POLICY IF EXISTS "Allow public read transactions" ON public.transactions;
CREATE POLICY "Allow public read transactions" ON public.transactions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert transactions" ON public.transactions;
CREATE POLICY "Allow public insert transactions" ON public.transactions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update transactions" ON public.transactions;
CREATE POLICY "Allow public update transactions" ON public.transactions FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete transactions" ON public.transactions;
CREATE POLICY "Allow public delete transactions" ON public.transactions FOR DELETE USING (true);

-- 4. Enable Realtime Replication
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
