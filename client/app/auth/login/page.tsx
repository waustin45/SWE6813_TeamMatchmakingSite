'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) window.location.href ='/profile';
    else alert('Invalid credentials');
  };

  return (
    <div className="page container d-flex justify-content-center align-items-center">
      <form onSubmit={handleLogin} className="card p-4 shadow-sm w-100" style={{ maxWidth: '400px' }}>
        <h2 className="section-title mb-4 text-center">Login</h2>
        <input type="email" placeholder="Email" className="form-control mb-3" required 
               onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="form-control mb-3" required 
               onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="btn btn-primary gradient-purple w-100 border-0">Login</button>
      </form>
    </div>
  );
}