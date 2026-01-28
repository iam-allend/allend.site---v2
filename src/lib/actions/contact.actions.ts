'use server';

import { supabase } from '@/lib/db/supabase';
import { contactSchema, type ContactFormData } from '@/lib/validations/contact.schema';
import { Resend } from 'resend';

// Initialize Resend (if API key exists)
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface ActionResponse {
  success: boolean;
  message: string;
  error?: string;
}

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
        error: error.errors[0].message,
      };
    }

    return {
      success: false,
      message: 'Failed to send message. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}