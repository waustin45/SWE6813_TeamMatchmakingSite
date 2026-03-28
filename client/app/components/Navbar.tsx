'use client';
import checkUser from '@/helpers/checkUser';
import Link from 'next/link';
import { useEffect, useState } from 'react';
export interface Profile {
  email: string | null;
  name: string | null;
  gamerTag: string | null;
  playStyle: string | null;
}
export default function Navbar() {
  const [profile, setProfile] = useState<Profile | null>(null);
  useEffect(() => {
    
    checkUser(setProfile)
  },[]);

  
  return (
    <nav className="navbar navbar-expand-lg navbar-dark gradient-purple p-3">
      <div className="container">
        <Link href="/" className="navbar-brand section-title fw-bold">
          SQUAD DESTINATION
        </Link>
        {
          profile?.email && (
            <div className="d-flex align-items-center gap-3">
              <span className="text-light">Welcome, {profile.gamerTag || profile.name || profile.email}</span>
              <Link href="/profile" className="btn btn-outline-light rounded-pill px-4">
                Profile
              </Link>
              <Link href="/playerListing" className="btn btn-outline-light rounded-pill px-4">
                Find Players
              </Link>
            </div>
          ) 
        }
        {
          !profile?.email && (
                    <div className="d-flex gap-3">
          <Link href="/auth/login" className="btn btn-outline-light rounded-pill px-4">
            Login
          </Link>
          <Link href="/auth/signup" className="btn btn-light rounded-pill px-4">
            Sign Up
          </Link>
        </div>
          )
        }

      </div>
    </nav>
  );
}