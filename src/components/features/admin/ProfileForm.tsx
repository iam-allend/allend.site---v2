'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { updateProfile, updateAvatar, uploadCV, deleteCV, getCVHistory } from '@/lib/actions/user.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import CVPreview from './CVPreview';
import { Loader2, Upload, User, FileText } from 'lucide-react';
import Image from 'next/image';

const profileFormSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  nickname: z.string().optional(),
  phone: z.string().optional(),
  birthday: z.string().optional(),
  country: z.string().optional(),
  address: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  user: any;
  cvUrl?: string | null;
}

export default function ProfileForm({ user, cvUrl: initialCvUrl }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [cvLoading, setCvLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar_url || null);
  const [cvUrl, setCvUrl] = useState<string | null>(initialCvUrl || null);
  const [cvFileName, setCvFileName] = useState<string>('');
  const [showUploadConfirm, setShowUploadConfirm] = useState(false);
  const [pendingCvFile, setPendingCvFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: user?.full_name || '',
      nickname: user?.nickname || '',
      phone: user?.phone || '',
      birthday: user?.birthday || '',
      country: user?.country || '',
      address: user?.address || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    const result = await updateProfile(user.id, formData);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setAvatarLoading(true);
    const formData = new FormData();
    formData.append('avatar', file);

    const result = await updateAvatar(user.id, formData);

    if (result.success) {
      toast.success(result.message);
      if (result.avatarUrl) {
        setAvatarPreview(result.avatarUrl);
      }
    } else {
      toast.error(result.message);
      // Revert preview
      setAvatarPreview(user?.avatar_url || null);
    }

    setAvatarLoading(false);
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    // Show confirmation dialog
    setPendingCvFile(file);
    setCvFileName(file.name);
    setShowUploadConfirm(true);
  };

  const confirmCvUpload = async () => {
    if (!pendingCvFile) return;

    setShowUploadConfirm(false);
    setCvLoading(true);

    const formData = new FormData();
    formData.append('cv_file', pendingCvFile);

    const result = await uploadCV(formData);

    if (result.success) {
      toast.success(result.message, {
        description: 'Your CV is now available for download on your portfolio',
        duration: 5000,
      });
      if (result.cvUrl) {
        setCvUrl(result.cvUrl);
        setCvFileName(result.fileName || '');
      }
    } else {
      toast.error(result.message);
    }

    setCvLoading(false);
    setPendingCvFile(null);
  };

  const handleDeleteCV = async () => {
    if (!cvFileName) return;

    setCvLoading(true);

    const result = await deleteCV(cvFileName);

    if (result.success) {
      toast.success(result.message);
      // Refresh CV history to get latest
      const historyResult = await getCVHistory();
      if (historyResult.success && historyResult.files.length > 0) {
        setCvUrl(historyResult.files[0].url);
        setCvFileName(historyResult.files[0].name);
      } else {
        setCvUrl(null);
        setCvFileName('');
      }
    } else {
      toast.error(result.message);
    }

    setCvLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <div className="glass-strong rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">Personal Information</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar Upload */}
          <div className="space-y-3">
            <Label>Profile Picture</Label>
            <div className="flex items-center gap-6">
              <div className="relative">
                {avatarPreview ? (
                  <Image
                    src={avatarPreview}
                    alt="Avatar"
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full object-cover glass-strong"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full glass-strong flex items-center justify-center">
                    <User className="w-10 h-10 text-gray-400" />
                  </div>
                )}
                {avatarLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                )}
              </div>
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={avatarLoading}
                  className="glass"
                />
                <p className="text-xs text-gray-400 mt-2">
                  Recommended: Square image, at least 400x400px, max 2MB
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                {...register('full_name')}
                className="glass"
              />
              {errors.full_name && (
                <p className="text-sm text-red-400">{errors.full_name.message}</p>
              )}
            </div>

            {/* Nickname */}
            <div className="space-y-2">
              <Label htmlFor="nickname">Nickname</Label>
              <Input
                id="nickname"
                {...register('nickname')}
                className="glass"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                {...register('phone')}
                className="glass"
              />
            </div>

            {/* Birthday */}
            <div className="space-y-2">
              <Label htmlFor="birthday">Birthday</Label>
              <Input
                id="birthday"
                type="date"
                {...register('birthday')}
                className="glass"
              />
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                {...register('country')}
                className="glass"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              {...register('address')}
              rows={3}
              className="glass"
            />
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
              'Save Profile'
            )}
          </Button>
        </form>
      </div>

      {/* CV Upload Section */}
      <div className="glass-strong rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">Curriculum Vitae (CV)</h2>
        </div>

        <div className="space-y-6">
          {/* Upload Form */}
          <div className="space-y-3">
            <Label htmlFor="cv_file">Upload New CV</Label>
            <div className="flex gap-3">
              <Input
                id="cv_file"
                type="file"
                accept=".pdf"
                onChange={handleCvChange}
                disabled={cvLoading}
                className="glass flex-1"
              />
              {cvLoading && (
                <div className="flex items-center gap-2 text-primary">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Uploading...</span>
                </div>
              )}
            </div>
            <div className="flex items-start gap-2 text-xs text-gray-400">
              <div className="mt-0.5">ℹ️</div>
              <div>
                <p>• Only PDF files are allowed (max 10MB)</p>
                <p>• System keeps 2 latest versions for backup</p>
                <p>• Old CV will be automatically replaced when 3rd file is uploaded</p>
              </div>
            </div>
          </div>

          {/* CV Preview */}
          {cvUrl ? (
            <CVPreview
              cvUrl={cvUrl}
              fileName={cvFileName}
              showDelete={false}
            />
          ) : (
            <div className="glass rounded-xl p-8 text-center border-2 border-dashed border-white/10">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-400 mb-1">No CV uploaded yet</p>
              <p className="text-sm text-gray-500">
                Upload your CV to make it available on your portfolio
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Confirmation Dialog */}
      <AlertDialog open={showUploadConfirm} onOpenChange={setShowUploadConfirm}>
        <AlertDialogContent className="glass-strong border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>Upload new CV?</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-2">
                <p>You are about to upload: <span className="font-medium text-white">{cvFileName}</span></p>
                <p className="text-xs text-gray-400">
                  • System keeps 2 latest versions for backup<br />
                  • Current CV will be replaced<br />
                  • Visitors will see the new CV on your portfolio
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="glass hover:glass-strong"
              onClick={() => setPendingCvFile(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmCvUpload}
              className="bg-primary text-black hover:bg-primary/90"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload CV
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}