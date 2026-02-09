import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/db/supabase';
import { NextResponse } from 'next/server';

  export async function POST(request: Request) {
    try {
      const session = await auth();

      if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const data = await request.json();
      const { technologies, images, ...projectData } = data;

      // Insert project
      const { data: project, error: projectError } = await supabaseAdmin
        .from('projects')
        .insert({
          ...projectData,
          created_by: session.user.id,
        })
        .select()
        .single();

      if (projectError) {
        console.error('Project insert error:', projectError);
        return NextResponse.json(
          { error: projectError.message },
          { status: 400 }
        );
      }

      // Insert project technologies
      if (technologies && technologies.length > 0) {
        const techRelations = technologies.map((techId: string) => ({
          project_id: project.id,
          technology_id: techId,
        }));

        const { error: techError } = await supabaseAdmin
          .from('project_technologies')
          .insert(techRelations);

        if (techError) {
          console.error('Tech relation error:', techError);
        }
      }

      // ✅ Assign images to project
      if (images && images.length > 0) {
        const { error: imageError } = await supabaseAdmin
          .from('project_images')
          .update({ project_id: project.id })
          .in('id', images);

        if (imageError) {
          console.error('Image assignment error:', imageError);
        }
      }

      return NextResponse.json({ success: true, project });
    } catch (error) {
      console.error('API error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

  export async function PUT(request: Request) {
    try {
      const session = await auth();

      if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const data = await request.json();
      const { id, technologies, images, ...projectData } = data;

      if (!id) {
        return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
      }

      // Update project
      const { data: project, error: projectError } = await supabaseAdmin
        .from('projects')
        .update(projectData)
        .eq('id', id)
        .select()
        .single();

      if (projectError) {
        return NextResponse.json(
          { error: projectError.message },
          { status: 400 }
        );
      }

      // Update technologies
      if (technologies) {
        await supabaseAdmin
          .from('project_technologies')
          .delete()
          .eq('project_id', id);

        if (technologies.length > 0) {
          const techRelations = technologies.map((techId: string) => ({
            project_id: id,
            technology_id: techId,
          }));

          await supabaseAdmin
            .from('project_technologies')
            .insert(techRelations);
        }
      }

      // ✅ Update images
      if (images) {
        // Unassign old images
        await supabaseAdmin
          .from('project_images')
          .update({ project_id: null })
          .eq('project_id', id);

        // Assign new images
        if (images.length > 0) {
          await supabaseAdmin
            .from('project_images')
            .update({ project_id: id })
            .in('id', images);
        }
      }

      return NextResponse.json({ success: true, project });
    } catch (error) {
      console.error('API error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    // Soft delete - set deleted_at
    const { error } = await supabaseAdmin
      .from('projects')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}