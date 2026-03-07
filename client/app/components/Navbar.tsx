'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark gradient-purple p-3">
      <div className="container">
        <Link href="/" className="navbar-brand section-title fw-bold">
          SQUAD DESTINATION
        </Link>
        <div className="d-flex gap-3">
          <Link href="/login" className="btn btn-outline-light rounded-pill px-4">
            Login
          </Link>
          <Link href="/signup" className="btn btn-light rounded-pill px-4">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}