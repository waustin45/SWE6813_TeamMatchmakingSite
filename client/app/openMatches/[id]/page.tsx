'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getMatch, joinMatch, leaveMatch, MatchWithDetails } from './actions';

export default function MatchDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [match, setMatch] = useState<MatchWithDetails | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getMatch(Number(id)).then((res) => {
      if ('match' in res && res.match) setMatch(res.match);
      setLoading(false);
    });

    fetch('/api/auth/profile')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data?.user?.id) setCurrentUserId(data.user.id); });
  }, [id]);

  async function refreshMatch() {
    const res = await getMatch(Number(id));
    if ('match' in res && res.match) setMatch(res.match);
  }

  async function handleJoin() {
    setSubmitting(true);
    setActionError(null);
    const res = await joinMatch(Number(id));
    if ('error' in res) setActionError(res.error ?? 'Something went wrong');
    else await refreshMatch();
    setSubmitting(false);
  }

  async function handleLeave() {
    setSubmitting(true);
    setActionError(null);
    const res = await leaveMatch(Number(id));
    if ('error' in res) setActionError(res.error ?? 'Something went wrong');
    else await refreshMatch();
    setSubmitting(false);
  }

  if (loading) return <div className="container p-5 text-center">Loading...</div>;
  if (!match) return <div className="container p-5 text-center">Match not found.</div>;

  const isMember = match.members.some((m) => m.user.id === currentUserId);
  const isOwner = match.owner.id === currentUserId;

  return (
    <div className="container py-5" style={{ maxWidth: '720px' }}>
      <button className="btn btn-link ps-0 mb-3 text-muted" onClick={() => router.back()}>
        ← Back
      </button>

      <div className="card shadow-sm p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h2 className="section-title mb-0">{match.title}</h2>
          <span className={`badge ${match.status === 'open' ? 'bg-success' : 'bg-secondary'}`}>
            {match.status}
          </span>
        </div>

        <p className="mb-1"><strong>Game:</strong> {match.game.name}</p>
        <p className="mb-1"><strong>Host:</strong> {match.owner.gamerTag ?? 'Unknown'}</p>

        {match.description && (
          <p className="mt-3 mb-2">{match.description}</p>
        )}

        {match.tags.length > 0 && (
          <div className="d-flex flex-wrap gap-1 my-3">
            {match.tags.map((tag) => (
              <span key={tag.id} className={`badge bg-${tag.color}`}>{tag.label}</span>
            ))}
          </div>
        )}

        {actionError && <p className="text-danger small mt-2">{actionError}</p>}

        {!isOwner && match.status === 'open' && (
          isMember ? (
            <button
              className="btn btn-outline-danger mt-3"
              onClick={handleLeave}
              disabled={submitting}
            >
              {submitting ? 'Leaving...' : 'Leave Match'}
            </button>
          ) : (
            <button
              className="btn gradient-purple-btn border-0 mt-3"
              onClick={handleJoin}
              disabled={submitting}
            >
              {submitting ? 'Joining...' : 'Join Match'}
            </button>
          )
        )}
      </div>

      <h5 className="mt-5 mb-3">Members ({match.members.length})</h5>
      <div className="d-flex flex-wrap gap-3">
        {match.members.map((member) => (
          <div key={member.id} className="d-flex align-items-center gap-2 card px-3 py-2 shadow-sm">
            <Image
              src={member.user.avatarUrl ?? '/female_profile.jpg'}
              alt={member.user.gamerTag ?? 'Player'}
              width={36}
              height={36}
              className="rounded-circle object-fit-cover"
            />
            <div>
              <p className="mb-0 fw-semibold small">{member.user.gamerTag ?? 'Unknown'}</p>
              {member.user.id === match.owner.id && (
                <span className="badge bg-warning text-dark" style={{ fontSize: '0.65rem' }}>Host</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
