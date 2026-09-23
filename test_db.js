import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL || 'https://nyiwbgfdfjjdenaigpzz.supabase.co';
const publishableKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-key';
const secretKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-key';

const client = createClient(url, secretKey || publishableKey);

async function testDatabase() {
  console.log("Checking Supabase tables...");
  const { data, error } = await client.from('transactions').select('*');
  console.log("Transactions table query:", { data, error });
}

testDatabase();
