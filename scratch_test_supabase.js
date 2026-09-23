import { createClient } from '@supabase/supabase-js';

const url = 'https://nyiwbgfdfjjdenaigpzz.supabase.co';
const key = 'sb_publishable_NCDNJUDBN58s8uvSCIfFEQ_Wf6HNOo7';

const supabase = createClient(url, key);

async function testConnection() {
  console.log('--- Supabase Connection Verification ---');
  console.log('Target URL:', url);

  try {
    const res = await fetch(`${url}/rest/v1/`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });

    console.log('HTTP Status Code:', res.status, res.statusText);
    if (res.ok || res.status === 200 || res.status === 404 || res.status === 401) {
      console.log('✅ Handshake Successful! Supabase REST API server is responsive.');
    } else {
      console.log('⚠️ Server returned non-standard status:', res.status);
    }
  } catch (err) {
    console.error('❌ Connection Failed:', err.message);
  }
}

testConnection();
