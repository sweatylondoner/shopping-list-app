import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, storeId } = body;

    // Validate input
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Item name required' },
        { status: 400 }
      );
    }

    if (!storeId) {
      return NextResponse.json(
        { error: 'Store ID required' },
        { status: 400 }
      );
    }

    // Insert item
    const { data, error } = await supabase
      .from('items')
      .insert({
        name: name.trim(),
        store_id: storeId,
        is_favorite: false,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: data.id,
      name: data.name,
      isChecked: false,
      isFavorite: false,
    });
  } catch (error) {
    console.error('Error adding item:', error);
    return NextResponse.json(
      { error: 'Failed to add item' },
      { status: 500 }
    );
  }
}
