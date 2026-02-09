'use server';

import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/db/supabase';
import { contactSchema, type ContactFormData } from '@/lib/validations/contact.schema';
import { Resend } from 'resend';
import { z } from 'zod';
import { 
  markAsRead, 
  markAsUnread, 
  markAsReplied, 
  deleteContact 
} from '@/lib/db/queries/contacts';

// Initialize Resend (if API key exists)
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface ActionResponse {
  success: boolean;
  message: string;
  error?: string;
}

// ============================================
// PUBLIC CONTACT FORM SUBMISSION
// ============================================

export async function submitContactForm(
  data: ContactFormData
): Promise<ActionResponse> {
  try {
    // 1. Validate data
    const validatedData = contactSchema.parse(data);

    // 2. Save to Supabase
    const { error: dbError } = await supabase
      .from('contacts')
      .insert({
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject || null,
        message: validatedData.message,
        is_read: false,
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to save message to database');
    }

    // 3. Send email notification (if Resend is configured)
    if (resend && process.env.RESEND_FROM_EMAIL) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
          to: 'anurmustakim@gmail.com', // Your email
          subject: `New Contact: ${validatedData.subject || 'No Subject'}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #00D9FF;">New Contact Form Submission</h2>
              
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>From:</strong> ${validatedData.name}</p>
                <p><strong>Email:</strong> ${validatedData.email}</p>
                <p><strong>Subject:</strong> ${validatedData.subject || 'No Subject'}</p>
              </div>

              <div style="background: #fff; padding: 20px; border-left: 4px solid #00D9FF; margin: 20px 0;">
                <h3>Message:</h3>
                <p style="white-space: pre-wrap;">${validatedData.message}</p>
              </div>

              <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
              
              <p style="color: #888; font-size: 12px;">
                This email was sent from your portfolio contact form.
              </p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the whole operation if email fails
      }
    }

    return {
      success: true,
      message: 'Message sent successfully! I\'ll get back to you soon.',
    };
  } catch (error) {
    console.error('Contact form error:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Validation error',
        error: error.issues[0]?.message || 'Invalid input',
      };
    }

    return {
      success: false,
      message: 'Failed to send message. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================
// ADMIN MESSAGE MANAGEMENT ACTIONS
// ============================================

export async function toggleReadStatus(id: string, currentStatus: boolean) {
  try {
    if (currentStatus) {
      await markAsUnread(id);
    } else {
      await markAsRead(id);
    }

    revalidatePath('/admin/messages');
    return { success: true, message: 'Status updated successfully' };
  } catch (error: any) {
    console.error('Toggle read status error:', error);
    return { success: false, message: error.message || 'Failed to update status' };
  }
}

export async function replyToMessage(id: string) {
  try {
    await markAsReplied(id);

    revalidatePath('/admin/messages');
    return { success: true, message: 'Marked as replied' };
  } catch (error: any) {
    console.error('Reply to message error:', error);
    return { success: false, message: error.message || 'Failed to mark as replied' };
  }
}

export async function deleteMessage(id: string) {
  try {
    await deleteContact(id);

    revalidatePath('/admin/messages');
    return { success: true, message: 'Message deleted successfully' };
  } catch (error: any) {
    console.error('Delete message error:', error);
    return { success: false, message: error.message || 'Failed to delete message' };
  }
}