"use client";
import { useEffect, useState } from "react";
import { getGamesTagsData, saveGamesAndTags } from "./gamesTagsActions";

type Game = { id: number; name: string; genres: { id: number; name: string; color: string }[] };
type Tag  = { id: number; label: string; color: string };

export default function GamesTagsForm() {
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [allTags, setAllTags]   = useState<Tag[]>([]);
  const [selectedGames, setSelectedGames] = useState<Set<number>>(new Set());
  const [selectedTags, setSelectedTags]   = useState<Set<number>>(new Set());
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [message, setMessage]   = useState<string | null>(null);

  useEffect(() => {
    getGamesTagsData().then((data) => {
      setAllGames(data.allGames);
      setAllTags(data.allTags);
      setSelectedGames(new Set(data.savedGameIds));
      setSelectedTags(new Set(data.savedTagIds));
      setLoading(false);
    });
  }, []);

  function toggleGame(id: number) {
    setSelectedGames((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleTag(id: number) {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const result = await saveGamesAndTags(
      Array.from(selectedGames),
      Array.from(selectedTags)
    );
    setMessage("error" in result ? result.error ?? "Error" : "Saved!");
    setSaving(false);
  }

  if (loading) return <p className="mt-4">Loading games & tags...</p>;

  return (
    <div className="mt-6 max-w-xl space-y-6">
      <div>
        <h2 className="block font-medium mb-2">Favorite Games</h2>
        <div className="d-flex flex-wrap gap-2">
          {allGames.map((game) => (
            <button
              key={game.id}
              type="button"
              onClick={() => toggleGame(game.id)}
              className={`btn d-flex gap-1 justify-content-center align-items-center btn-sm ${selectedGames.has(game.id) ? "btn-primary" : "btn-outline-secondary"}`}
            >
              {game.name}
              {game.genres.length > 0 && (
                <span className=" badge bg-secondary">{game.genres[0].name}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="block font-medium mb-2">Tags</h2>
        <div className="d-flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
              className={`btn btn-sm ${selectedTags.has(tag.id) ? `btn-${tag.color}` : "btn-outline-secondary"}`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary px-4 mt-4"
        >
          {saving ? "Saving..." : "Save Games & Tags"}
        </button>
        {message && <span className="ms-3 text-sm">{message}</span>}
      </div>
    </div>
  );
}
