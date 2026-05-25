export default function HelloPage() {
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>✅ Hello from Vercel!</h1>
      <p>If you can see this, the deployment is working.</p>
      <p>Environment variables check:</p>
      <ul>
        <li>Supabase URL exists: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'YES ✓' : 'NO ✗'}</li>
        <li>Supabase Key exists: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'YES ✓' : 'NO ✗'}</li>
      </ul>
      {process.env.NEXT_PUBLIC_SUPABASE_URL && (
        <p>URL starts with: {process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 20)}...</p>
      )}
    </div>
  );
}
