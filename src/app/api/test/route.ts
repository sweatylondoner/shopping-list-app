import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Check environment variables
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!hasUrl || !hasKey) {
      return NextResponse.json({
        error: 'Environment variables missing',
        hasUrl,
        hasKey,
      }, { status: 500 });
    }

    // Try to connect to Supabase
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .limit(1);

    if (error) {
      return NextResponse.json({
        error: 'Supabase error',
        details: error,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connected!',
      data,
    });
  } catch (err: any) {
    return NextResponse.json({
      error: 'Exception caught',
      message: err.message,
      stack: err.stack,
    }, { status: 500 });
  }
}
