// src/app/api/projects/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/db/supabase';

// POST - Create new project
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      slug,
      description,
      role,
      field_id,
      status,
      start_date,
      end_date,
      is_current,
      is_featured,
      project_url,
      github_url,
      technologies,
      images, // Array of project_images.id in order
    } = body;

    // Create project
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .insert({
        title,
        slug,
        description,
        role,
        field_id,
        status,
        start_date,
        end_date,
        is_current,
        is_featured,
        project_url,
        github_url,
        created_by: session.user.id,
      })
      .select()
      .single();

    if (projectError) throw projectError;

    // Insert technologies
    if (technologies && technologies.length > 0) {
      const techRecords = technologies.map((tech_id: string) => ({
        project_id: project.id,
        technology_id: tech_id,
      }));

      await supabaseAdmin.from('project_technologies').insert(techRecords);
    }

    // ✅ Link images ke project baru - hanya update project_id dan sort_order
    // URL di project_images TIDAK diubah
    if (images && images.length > 0) {
      for (let index = 0; index < images.length; index++) {
        await supabaseAdmin
          .from('project_images')
          .update({ project_id: project.id, sort_order: index })
          .eq('id', images[index]);
      }
    }

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('POST /api/projects error:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

// PUT - Update project
export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      title,
      slug,
      description,
      role,
      field_id,
      status,
      start_date,
      end_date,
      is_current,
      is_featured,
      project_url,
      github_url,
      technologies,
      images, // Array of project_images.id in order
    } = body;

    // Update project
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .update({
        title,
        slug,
        description,
        role,
        field_id,
        status,
        start_date,
        end_date,
        is_current,
        is_featured,
        project_url,
        github_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (projectError) throw projectError;

    // Update technologies (delete all and re-insert)
    await supabaseAdmin
      .from('project_technologies')
      .delete()
      .eq('project_id', id);

    if (technologies && technologies.length > 0) {
      const techRecords = technologies.map((tech_id: string) => ({
        project_id: id,
        technology_id: tech_id,
      }));

      await supabaseAdmin.from('project_technologies').insert(techRecords);
    }

    // ✅ Update images - hanya ubah project_id dan sort_order, URL TIDAK disentuh
    // Step 1: Unlink semua images yang sebelumnya terhubung ke project ini
    await supabaseAdmin
      .from('project_images')
      .update({ project_id: null })
      .eq('project_id', id);

    // Step 2: Link images yang dipilih dengan sort_order baru
    if (images && images.length > 0) {
      for (let index = 0; index < images.length; index++) {
        await supabaseAdmin
          .from('project_images')
          .update({ project_id: id, sort_order: index })
          .eq('id', images[index]);
      }
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('PUT /api/projects error:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE - Soft delete project
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
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Unlink images sebelum soft delete
    await supabaseAdmin
      .from('project_images')
      .update({ project_id: null })
      .eq('project_id', id);

    const { error } = await supabaseAdmin
      .from('projects')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/projects error:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}