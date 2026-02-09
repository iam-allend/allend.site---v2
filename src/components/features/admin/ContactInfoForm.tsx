'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { updateContactInfo } from '@/lib/actions/settings.actions';
import { contactInfoSchema, type ContactInfo } from '@/lib/validations/settings.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Phone, MapPin } from 'lucide-react';

interface ContactInfoFormProps {
  initialData?: ContactInfo;
}

export default function ContactInfoForm({ initialData }: ContactInfoFormProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactInfo>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: initialData || {
      displayEmail: '',
      displayPhone: '',
      displayLocation: '',
      recipientEmail: '',
    },
  });

  const onSubmit = async (data: ContactInfo) => {
    setLoading(true);

    const result = await updateContactInfo(data);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message || 'Failed to update contact info');
    }

    setLoading(false);
  };

  return (
    <div className="glass-strong rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-2">Contact Information</h2>
      <p className="text-sm text-gray-400 mb-6">
        Contact details displayed on public pages
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Display Email */}
        <div className="space-y-2">
          <Label htmlFor="displayEmail" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Display Email *
          </Label>
          <Input
            id="displayEmail"
            type="email"
            {...register('displayEmail')}
            placeholder="your@email.com"
            className="glass"
          />
          <p className="text-xs text-gray-400">
            Email shown to visitors on your contact page
          </p>
          {errors.displayEmail && (
            <p className="text-sm text-red-400">{errors.displayEmail.message}</p>
          )}
        </div>

        {/* Recipient Email */}
        <div className="space-y-2">
          <Label htmlFor="recipientEmail" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Notification Email *
          </Label>
          <Input
            id="recipientEmail"
            type="email"
            {...register('recipientEmail')}
            placeholder="notifications@email.com"
            className="glass"
          />
          <p className="text-xs text-gray-400">
            Email where contact form messages will be sent
          </p>
          {errors.recipientEmail && (
            <p className="text-sm text-red-400">{errors.recipientEmail.message}</p>
          )}
        </div>

        {/* Display Phone */}
        <div className="space-y-2">
          <Label htmlFor="displayPhone" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Display Phone
          </Label>
          <Input
            id="displayPhone"
            type="tel"
            {...register('displayPhone')}
            placeholder="+62 xxx xxx xxxx"
            className="glass"
          />
          <p className="text-xs text-gray-400">
            Optional phone number to display (leave empty to hide)
          </p>
          {errors.displayPhone && (
            <p className="text-sm text-red-400">{errors.displayPhone.message}</p>
          )}
        </div>

        {/* Display Location */}
        <div className="space-y-2">
          <Label htmlFor="displayLocation" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Display Location
          </Label>
          <Input
            id="displayLocation"
            {...register('displayLocation')}
            placeholder="Semarang, Indonesia"
            className="glass"
          />
          <p className="text-xs text-gray-400">
            Location displayed to visitors
          </p>
          {errors.displayLocation && (
            <p className="text-sm text-red-400">{errors.displayLocation.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-black hover:bg-primary/90 neon-glow"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Contact Information'
          )}
        </Button>
      </form>
    </div>
  );
}