import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const { data, error } = await supabase
      .from('item_actions')
      .insert({
        item_id: itemId,
        action: 'unchecked',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      timestamp: data.timestamp,
    });
  } catch (error) {
    console.error('Error unchecking item:', error);
    return NextResponse.json(
      { error: 'Failed to uncheck item' },
      { status: 500 }
    );
  }
}
