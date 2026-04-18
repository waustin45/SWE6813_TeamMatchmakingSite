'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllGames } from '@/app/serverActions/playerListingPage/getGames';
import { getAllTags } from '@/app/serverActions/playerListingPage/getTags';
import GameDataInterface from '@/interfaces/gameDataInterface';
import TagDataInterface from '@/interfaces/tagDataInterface';

export default function CreateMatchPage() {
  const [games, setGames] = useState<GameDataInterface[]>([]);
  const [tags, setTags] = useState<TagDataInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    selectedGameId: '',
    selectedTagIds: [] as number[],
  });
  
  const router = useRouter();

  // Fetch games and tags to populate the form options on mount]
  useEffect(() => {
    const fetchData = async () => {
      const [gamesRes, tagsRes] = await Promise.all([
        getAllGames(),
        getAllTags()
      ]);
      
      if (gamesRes.success && gamesRes.data) setGames(gamesRes.data);
      if (tagsRes.success && tagsRes.data) setTags(tagsRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating match:", formData);
  };

  if (loading) return <div className="container p-5 text-center">Loading...</div>;

  return (
    <div className="page container d-flex justify-content-center align-items-center">
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm w-100" style={{ maxWidth: '600px' }}>
        <h2 className="section-title mb-4 text-center">Create Open Match</h2>
        
        {/* Match Title */}
        <div className="mb-3">
          <label className="form-label fw-bold">Match Title</label>
          <input 
            type="text" 
            placeholder="e.g., Casual Friday Valorant" 
            className="form-control" 
            required
            onChange={(e) => setFormData({...formData, title: e.target.value})} 
          />
        </div>

        {/* Game Selection */}
        <div className="mb-3">
          <label className="form-label fw-bold">Select Game</label>
          <select 
            className="form-select" 
            required 
            onChange={(e) => setFormData({...formData, selectedGameId: e.target.value})}
          >
            <option value="">Choose a game...</option>
            {games.map((game) => (
              <option key={game.id} value={game.id}>{game.name}</option>
            ))}
          </select>
        </div>

        {/* Tag Selection */}
        <div className="mb-3">
          <label className="form-label fw-bold">Requirements (Tags)</label>
          <div className="d-flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div key={tag.id} className="form-check">
                <input 
                  type="checkbox" 
                  className="form-check-input" 
                  id={`tag-${tag.id}`}
                  onChange={(e) => {
                    const newTags = e.target.checked 
                      ? [...formData.selectedTagIds, tag.id]
                      : formData.selectedTagIds.filter(id => id !== tag.id);
                    setFormData({...formData, selectedTagIds: newTags});
                  }}
                />
                <label className={`form-check-label badge bg-${tag.color}`} htmlFor={`tag-${tag.id}`}>
                  {tag.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="form-label fw-bold">Description</label>
          <textarea 
            className="form-control" 
            rows={3} 
            placeholder="What are the vibes for this match?"
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary gradient-purple w-100 border-0">
          Post Open Match
        </button>
      </form>
    </div>
  );
}