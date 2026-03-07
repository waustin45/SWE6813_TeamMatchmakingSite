'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '', password: '', name: '', gamerTag: '', playStyle: 'Casual'
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    if (res.ok) router.push('/login');
    else alert('Registration failed');
  };

  return (
    <div className="page container d-flex justify-content-center align-items-center">
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm w-100" style={{ maxWidth: '400px' }}>
        <h2 className="section-title mb-4 text-center">Create Account</h2>
        <input type="text" placeholder="Name" className="form-control mb-3" 
               onChange={(e) => setFormData({...formData, name: e.target.value})} />
        <input type="text" placeholder="Gamer Tag" className="form-control mb-3" 
               onChange={(e) => setFormData({...formData, gamerTag: e.target.value})} />
        <input type="email" placeholder="Email" className="form-control mb-3" required 
               onChange={(e) => setFormData({...formData, email: e.target.value})} />
        <input type="password" placeholder="Password" className="form-control mb-3" required 
               onChange={(e) => setFormData({...formData, password: e.target.value})} />
        <button type="submit" className="btn btn-primary gradient-purple w-100 border-0">Sign Up</button>
      </form>
    </div>
  );
}