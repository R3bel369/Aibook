import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const url = process.env.VITE_SUPABASE_URL || 'https://nyiwbgfdfjjdenaigpzz.supabase.co';
const secretKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-key';
const publishableKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-key';

const supabase = createClient(url, secretKey);

async function attemptSetup() {
  console.log("Attempting database setup...");
  const sql = fs.readFileSync('./supabase_schema.sql', 'utf8');

  // Check if we can execute via rpc or postgres query
  try {
    const res = await fetch(`${url}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': secretKey,
        'Authorization': `Bearer ${secretKey}`
      },
      body: JSON.stringify({ query: sql })
    });
    console.log("exec_sql response status:", res.status);
  } catch (err) {
    console.log("exec_sql error:", err.message);
  }
}

attemptSetup();
