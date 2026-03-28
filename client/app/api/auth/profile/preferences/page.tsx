'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Profile } from '@/app/components/Navbar';

export default function PreferencesPage() {
  const [formData, setFormData] = useState<Partial<Profile>>({
    name: '',
    gamerTag: '',
    playStyle: 'Casual'
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Fetch current user data to pre-populate the form
    const fetchProfile = async () => {
      const res = await fetch('/api/auth/profile');
      if (res.ok) {
        const data = await res.json();
        setFormData(data.user);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Preferences updated!");
      router.push('/'); // Redirect to home or dashboard
    }
  };

  if (loading) return <div className="container p-5 text-center">Loading...</div>;

  return (
    <div className="page container d-flex justify-content-center align-items-center">
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm w-100" style={{ maxWidth: '500px' }}>
        <h2 className="section-title mb-4 text-center">User Preferences</h2>
        
        <label className="form-label">Display Name</label>
        <input 
          type="text" 
          value={formData.name || ''} 
          className="form-control mb-3" 
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
        />

        <label className="form-label">Gamer Tag</label>
        <input 
          type="text" 
          value={formData.gamerTag || ''} 
          className="form-control mb-3" 
          onChange={(e) => setFormData({...formData, gamerTag: e.target.value})} 
        />

        <label className="form-label">Play Style</label>
        <select 
          className="form-select mb-4" 
          value={formData.playStyle || 'Casual'}
          onChange={(e) => setFormData({...formData, playStyle: e.target.value})}
        >
          <option value="Casual">Casual</option>
          <option value="Competitive">Competitive</option>
          <option value="Pro">Pro</option>
        </select>

        <button type="submit" className="btn btn-primary gradient-purple w-100 border-0">
          Save Preferences
        </button>
      </form>
    </div>
  );
}
