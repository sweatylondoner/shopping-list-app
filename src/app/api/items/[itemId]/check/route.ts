import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(
  request: Request,
  context: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await context.params;
    const { data, error } = await supabase
      .from('item_actions')
      .insert({
        item_id: itemId,
        action: 'checked',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      timestamp: data.timestamp,
    });
  } catch (error) {
    console.error('Error checking item:', error);
    return NextResponse.json(
      { error: 'Failed to check item' },
      { status: 500 }
    );
  }
}
