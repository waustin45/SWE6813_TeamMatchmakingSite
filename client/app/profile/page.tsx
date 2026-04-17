import ProfileForm from './ProfileForm';
import GamesTagsForm from './GamesTagsForm';

export default function ProfilePage() {
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <ProfileForm />
      <hr className="my-6" />
      <GamesTagsForm />
    </main>
  );
}

