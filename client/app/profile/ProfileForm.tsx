'use client';
import { useEffect, useState } from 'react';

const AVATARS = [
  '/avatars/avatar1.png',
  '/avatars/avatar2.png',
];

// Replace localToken() with your auth token retrieval s
function localToken() {
  // Example: return localStorage.getItem('token') || '';
  return '';
}

export default function ProfileForm() {
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [prefs, setPrefs] = useState({ voiceChat: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/profile', { headers: { Authorization: 'Bearer ' + localToken() } })
      .then(r => r.json())
      .then(data => {
        if (data?.user) {
          setBio(data.user.bio ?? '');
          setAvatarUrl(data.user.avatarUrl ?? null);
          setPrefs(data.user.preferences ?? { voiceChat: false });
        }
      });
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localToken()
        },
        body: JSON.stringify({ bio, avatarUrl, preferences: prefs })
      });
      if (!res.ok) throw new Error('Save failed');
      alert('Profile saved');
    } catch (err) {
      console.error(err);
      alert('Save failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-xl">
      <div>
        <label className="block font-medium">Choose an avatar</label>
        <div className="grid grid-cols-5 gap-2 mt-2">
          {AVATARS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAvatarUrl(a)}
              className={`border rounded p-1 ${avatarUrl === a ? 'ring-2 ring-blue-500' : ''}`}
            >
              <img src={a} alt="avatar" className="w-20 h-20 object-cover rounded-full" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-medium">Preview</label>
        <div className="mt-2">
          <img src={avatarUrl ?? '/avatars/avatar1.png'} alt="preview" className="w-24 h-24 rounded-full object-cover" />
        </div>
      </div>

      <div>
        <label className="block font-medium">Bio</label>
        <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} className="w-full border p-2" />
      </div>

      <div>
        <label className="block font-medium">Preferences</label>
        <label className="flex items-center gap-2 mt-2">
          <input type="checkbox" checked={prefs.voiceChat} onChange={e => setPrefs({ ...prefs, voiceChat: e.target.checked })} />
          Voice chat
        </label>
      </div>

      <div>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
          {loading ? 'Saving...' : 'Save profile'}
        </button>
      </div>
    </form>
  );
}
