'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/user';
import { updateProfile, updateAvatar, uploadCV } from '@/lib/actions/user.actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Upload, Save, Loader2, User as UserIcon, FileText, Download } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface ProfileFormProps {
  user: User;
  cvUrl: string | null;
}

export default function ProfileForm({ user, cvUrl }: ProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar_url);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCV, setIsUploadingCV] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(user.id, formData);

    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }

    setIsLoading(false);
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append('avatar', file);

    const result = await updateAvatar(user.id, formData);

    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
      setAvatarPreview(user.avatar_url);
    }

    setIsUploadingAvatar(false);
  }

  async function handleCVUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCV(true);
    const formData = new FormData();
    formData.append('cv_file', file);

    const result = await uploadCV(formData);

    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }

    setIsUploadingCV(false);
    e.target.value = '';
  }

  return (
    <div className="space-y-8">
      {/* Avatar Section */}
      <div className="glass-strong rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-primary" />
          Profile Picture
        </h2>
        <div className="flex items-center gap-6">
          <div className="relative">
            {avatarPreview ? (
              <Image
                src={avatarPreview}
                alt="Avatar"
                width={120}
                height={120}
                className="w-32 h-32 rounded-full object-cover border-2 border-primary/30"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/30">
                <UserIcon className="w-16 h-16 text-primary/50" />
              </div>
            )}
            {isUploadingAvatar && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}
          </div>
          <div>
            <Label
              htmlFor="avatar"
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 glass rounded-lg hover:glass-strong transition-all"
            >
              <Upload className="w-4 h-4" />
              Change Avatar
            </Label>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
              disabled={isUploadingAvatar}
            />
            <p className="text-sm text-gray-400 mt-2">
              JPG, PNG or GIF. Max size 2MB.
            </p>
          </div>
        </div>
      </div>

      {/* Personal Info Form */}
      <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-6 space-y-6">
        <h2 className="text-xl font-bold mb-4">Personal Information</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="full_name">
              Full Name <span className="text-red-400">*</span>
            </Label>
            <Input
              id="full_name"
              name="full_name"
              defaultValue={user.full_name}
              required
              className="glass"
            />
          </div>

          {/* Nickname */}
          <div className="space-y-2">
            <Label htmlFor="nickname">Nickname</Label>
            <Input
              id="nickname"
              name="nickname"
              defaultValue={user.nickname || ''}
              className="glass"
            />
          </div>

          {/* Email (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user.email}
              disabled
              className="glass opacity-50 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400">Email cannot be changed</p>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={user.phone || ''}
              className="glass"
            />
          </div>

          {/* Birthday */}
          <div className="space-y-2">
            <Label htmlFor="birthday">Birthday</Label>
            <Input
              id="birthday"
              name="birthday"
              type="date"
              defaultValue={user.birthday || ''}
              className="glass"
            />
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              defaultValue={user.country || ''}
              className="glass"
            />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            name="address"
            defaultValue={user.address || ''}
            rows={3}
            className="glass"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-primary text-black hover:bg-primary/90 font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>

      {/* CV Management */}
      <div className="glass-strong rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          CV Management
        </h2>
        <div className="space-y-4">
          {cvUrl && (
            <div className="flex items-center justify-between glass rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-medium">Current CV</p>
                  <p className="text-sm text-gray-400">Last updated</p>
                </div>
              </div>
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 glass rounded-lg hover:glass-strong transition-all"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </div>
          )}

          <div>
            <Label
              htmlFor="cv_file"
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg font-semibold hover:bg-primary/90 transition-all"
            >
              {isUploadingCV ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload New CV
                </>
              )}
            </Label>
            <Input
              id="cv_file"
              type="file"
              accept=".pdf"
              onChange={handleCVUpload}
              className="hidden"
              disabled={isUploadingCV}
            />
            <p className="text-sm text-gray-400 mt-2">PDF only. Max size 5MB.</p>
          </div>
        </div>
      </div>
    </div>
  );
}