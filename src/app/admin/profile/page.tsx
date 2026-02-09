import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getUserByEmail } from '@/lib/db/queries/users';
import { getCurrentCV } from '@/lib/actions/user.actions';
import ProfileForm from '@/components/features/admin/ProfileForm';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect('/login');
  }

  // Fetch user data
  const user = await getUserByEmail(session.user.email);

  // Fetch CV URL
  const cvResult = await getCurrentCV();

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-gray-400 mt-1">Manage your personal information and CV</p>
      </div>

      <ProfileForm user={user} cvUrl={cvResult.cvUrl} />
    </div>
  );
}