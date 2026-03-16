// src/app/api/technologies/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/db/supabase';

// GET - List all technologies
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('technologies')
      .select(`
        *,
        category:tech_categories(
          id,
          name
        )
      `)
      .order('name', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ technologies: data || [] });
  } catch (error) {
    console.error('GET /api/technologies error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch technologies' },
      { status: 500 }
    );
  }
}

// POST - Create new technology
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, category_id } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Technology name is required' },
        { status: 400 }
      );
    }

    // Check for duplicate
    const { data: existing } = await supabaseAdmin
      .from('technologies')
      .select('id')
      .eq('name', name)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Technology with this name already exists' },
        { status: 409 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('technologies')
      .insert({
        name,
        category_id: category_id || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ technology: data }, { status: 201 });
  } catch (error) {
    console.error('POST /api/technologies error:', error);
    return NextResponse.json(
      { error: 'Failed to create technology' },
      { status: 500 }
    );
  }
}

// PUT - Update technology
export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, category_id } = body;

    if (!id || !name) {
      return NextResponse.json(
        { error: 'Technology ID and name are required' },
        { status: 400 }
      );
    }

    // Check for duplicate (excluding current)
    const { data: existing } = await supabaseAdmin
      .from('technologies')
      .select('id')
      .eq('name', name)
      .neq('id', id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Technology with this name already exists' },
        { status: 409 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('technologies')
      .update({
        name,
        category_id: category_id || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ technology: data });
  } catch (error) {
    console.error('PUT /api/technologies error:', error);
    return NextResponse.json(
      { error: 'Failed to update technology' },
      { status: 500 }
    );
  }
}

// DELETE - Delete technology
export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Technology ID is required' },
        { status: 400 }
      );
    }

    // Check if used in any projects
    const { data: projectTechs } = await supabaseAdmin
      .from('project_technologies')
      .select('project_id')
      .eq('technology_id', id)
      .limit(1);

    if (projectTechs && projectTechs.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete technology that is used in projects' },
        { status: 409 }
      );
    }

    const { error } = await supabaseAdmin
      .from('technologies')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/technologies error:', error);
    return NextResponse.json(
      { error: 'Failed to delete technology' },
      { status: 500 }
    );
  }
}