'use client';

import { useEffect, useState } from 'react';
import { getOpenMatches } from './actions';
import Link from 'next/link';

type Match = Awaited<ReturnType<typeof getOpenMatches>>['matches'][number];

export default function OpenMatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOpenMatches().then((res) => {
      if (res.success) setMatches(res.matches);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="container p-5 text-center">Loading...</div>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-title mb-0">Open Matches</h2>
        <Link href="/createMatch" className="btn gradient-purple-btn border-0">
          + Create Match
        </Link>
      </div>

      {matches.length === 0 ? (
        <p className="text-center text-muted">No open matches yet. Be the first to create one!</p>
      ) : (
        <div className="row g-4">
          {matches.map((match) => (
            <div key={match.id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{match.title}</h5>
                  <p className="text-muted small mb-1">
                    <strong>Game:</strong> {match.game.name}
                  </p>
                  <p className="text-muted small mb-2">
                    <strong>Host:</strong> {match.owner.gamerTag ?? "Unknown"}
                  </p>
                  {match.description && (
                    <p className="card-text small flex-grow-1">{match.description}</p>
                  )}
                  <div className="d-flex flex-wrap gap-1 my-2">
                    {match.tags.map((tag) => (
                      <span key={tag.id} className={`badge bg-${tag.color}`}>
                        {tag.label}
                      </span>
                    ))}
                  </div>
                  <p className="text-muted small mb-3">
                    {match.members.length} member{match.members.length !== 1 ? 's' : ''}
                  </p>
                  <Link href={`/openMatches/${match.id}`} className="btn btn-sm gradient-purple-btn border-0 mt-auto">
                    View Match
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
