'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import AnimatedBackground from '@/components/shared/AnimatedBackground';
import CustomCursor from '@/components/shared/CustomCursor';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

import { submitContactForm } from '@/lib/actions/contact.actions';
import { contactSchema, type ContactFormData } from '@/lib/validations/contact.schema';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'idle' | 'success' | 'error';
    message: string;
  }>({ type: 'idle', message: '' });

  // React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  // Contact Info
  const contactInfo = [
    {
      icon: '📧',
      label: 'Email',
      value: 'anurmustakim@gmail.com',
      link: 'mailto:anurmustakim@gmail.com',
    },
    {
      icon: '📱',
      label: 'Phone',
      value: '+62 851-5629-2952',
      link: 'tel:+6285156292952',
    },
    {
      icon: '📍',
      label: 'Location',
      value: 'Semarang, Central Java, Indonesia',
      link: null,
    },
  ];

  // Social Links
  const socialLinks = [
    {
      name: 'GitHub',
      icon: '💻',
      url: 'https://github.com/iam-allend',
      username: '@iam-allend',
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      url: 'https://linkedin.com/in/anur-mustakim-465865280',
      username: 'Anur Mustakim',
    },
    {
      name: 'Instagram',
      icon: '📸',
      url: 'https://instagram.com/anurmustakim',
      username: '@anurmustakim',
    },
    {
      name: 'Portfolio',
      icon: '🌐',
      url: 'https://allend.vercel.app',
      username: 'allend.vercel.app',
    },
  ];

  // Handle Form Submit
  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: 'idle', message: '' });

    try {
      const result = await submitContactForm(data);

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: result.message,
        });
        reset(); // Clear form

        // Auto-hide success message after 5s
        setTimeout(() => {
          setSubmitStatus({ type: 'idle', message: '' });
        }, 5000);
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || result.message,
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <CustomCursor />
      <AnimatedBackground />
      <Header />
      
      <main>
        <div className="min-h-screen pt-20 px-6 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12 mt-20">
              <h1 className="text-4xl lg:text-6xl font-bold mb-4">
                Get In <span className="neon-text">Touch</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Have a project in mind? Let's discuss how we can work together.
                I'm always open to new opportunities and collaborations.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left - Contact Form */}
              <div className="lg:col-span-2">
                <div className="glass-strong rounded-3xl p-8">
                  <h2 className="text-2xl font-bold mb-6 text-[#00D9FF]">
                    Send Message
                  </h2>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        {...register('name')}
                        className={`w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D9FF] bg-transparent transition-all ${
                          errors.name ? 'ring-2 ring-red-500' : ''
                        }`}
                        placeholder="Your name"
                      />
                      {errors.name && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        {...register('email')}
                        className={`w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D9FF] bg-transparent transition-all ${
                          errors.email ? 'ring-2 ring-red-500' : ''
                        }`}
                        placeholder="your.email@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Subject */}
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        {...register('subject')}
                        className="w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D9FF] bg-transparent transition-all"
                        placeholder="What's this about?"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        {...register('message')}
                        rows={6}
                        className={`w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D9FF] bg-transparent resize-none transition-all ${
                          errors.message ? 'ring-2 ring-red-500' : ''
                        }`}
                        placeholder="Tell me about your project..."
                      />
                      {errors.message && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-8 py-4 bg-[#00D9FF] text-black rounded-lg font-semibold neon-glow hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        'Send Message →'
                      )}
                    </button>

                    {/* Success/Error Messages */}
                    {submitStatus.type === 'success' && (
                      <div className="glass-strong border border-green-500/50 rounded-lg p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <p className="text-green-400 flex items-center gap-2">
                          <span className="text-xl">✓</span>
                          {submitStatus.message}
                        </p>
                      </div>
                    )}

                    {submitStatus.type === 'error' && (
                      <div className="glass-strong border border-red-500/50 rounded-lg p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <p className="text-red-400 flex items-center gap-2">
                          <span className="text-xl">✕</span>
                          {submitStatus.message}
                        </p>
                      </div>
                    )}
                  </form>
                </div>
              </div>

              {/* Right - Contact Info & Social */}
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="glass-strong rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-6 text-[#00D9FF]">
                    Contact Info
                  </h3>
                  <div className="space-y-4">
                    {contactInfo.map((info) => (
                      <div key={info.label}>
                        {info.link ? (
                          <a
                            href={info.link}
                            className="flex items-start gap-3 glass p-3 rounded-lg hover:glass-strong transition-all group"
                          >
                            <span className="text-2xl">{info.icon}</span>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">
                                {info.label}
                              </div>
                              <div className="text-sm group-hover:text-[#00D9FF] transition-colors">
                                {info.value}
                              </div>
                            </div>
                          </a>
                        ) : (
                          <div className="flex items-start gap-3 glass p-3 rounded-lg">
                            <span className="text-2xl">{info.icon}</span>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">
                                {info.label}
                              </div>
                              <div className="text-sm">{info.value}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Availability Status */}
                <div className="glass-strong rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-[#00D9FF] rounded-full animate-pulse"></div>
                    <h3 className="text-lg font-bold">Available for Work</h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    Open to new opportunities, collaborations, and freelance
                    projects in Web Development & Design.
                  </p>
                </div>

                {/* Social Links */}
                <div className="glass-strong rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-[#00D9FF]">
                    Connect
                  </h3>
                  <div className="space-y-3">
                    {socialLinks.map((social) => (
                      
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between glass p-3 rounded-lg hover:glass-strong hover:scale-105 transition-all group">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{social.icon}</span>
                          <div>
                            <div className="text-sm font-medium">
                              {social.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {social.username}
                            </div>
                          </div>
                        </div>
                        <span className="text-[#00D9FF] group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </>
  );
}