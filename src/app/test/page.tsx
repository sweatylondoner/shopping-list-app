import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function TestPage() {
  try {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .limit(1);

    if (error) {
      return (
        <div style={{ padding: '20px', fontFamily: 'monospace' }}>
          <h1>Supabase Error</h1>
          <pre>{JSON.stringify(error, null, 2)}</pre>
          <h2>Environment Variables</h2>
          <p>URL exists: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'YES' : 'NO'}</p>
          <p>Key exists: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'YES' : 'NO'}</p>
        </div>
      );
    }

    return (
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
        <h1>✅ Supabase Connected!</h1>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  } catch (err: any) {
    return (
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
        <h1>Exception Caught</h1>
        <pre>{err.toString()}</pre>
        <pre>{err.stack}</pre>
      </div>
    );
  }
}
