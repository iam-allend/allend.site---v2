import { supabase } from '@/lib/db/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test query
    const { data, error } = await supabase
      .from('fields')
      .select('*')
      .limit(5);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Supabase connected!',
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}