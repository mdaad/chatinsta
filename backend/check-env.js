const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://nuxhirqgbgyjftakagpa.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51eGhpcnFnYmd5amZ0YWthZ3BhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwMjYxNTAsImV4cCI6MjA1NzYwMjE1MH0.XxQvZ3R5x8K3L9p2mN4qR7sT1vW5yZ8cB2eF4hJ6kM9';

console.log('🔑 Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key length:', supabaseKey.length);

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
  
  if (error) {
    console.log('❌ Error:', error.message);
  } else {
    console.log('✅ Connected successfully!');
  }
}

test();
