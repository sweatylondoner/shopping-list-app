import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PATCH(
  request: Request,
  { params }: { params: { itemId: string } }
) {
  try {
    const body = await request.json();
    const { isFavorite } = body;

    if (typeof isFavorite !== 'boolean') {
      return NextResponse.json(
        { error: 'isFavorite must be a boolean' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('items')
      .update({ is_favorite: isFavorite })
      .eq('id', params.itemId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      isFavorite: data.is_favorite,
    });
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return NextResponse.json(
      { error: 'Failed to toggle favorite' },
      { status: 500 }
    );
  }
}
