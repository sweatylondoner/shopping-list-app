import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(
  request: Request,
  { params }: { params: { itemId: string } }
) {
  try {
    const { data, error } = await supabase
      .from('item_actions')
      .insert({
        item_id: params.itemId,
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
