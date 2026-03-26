"use client";
import { useState } from "react";

const PlayerListing = ({ players, games, tags }) => {
  // 1. Setup state for filters
  const [playerState, setPlayerState] = useState(players);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGame, setSelectedGame] = useState("");

  const handleSearch = () => {
    const filtered = players.filter((player) => {
      // Filter by Gamertag (Case-insensitive)
      const matchesSearch = player.gamerTag?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by Game ID (if a game is selected)
      const matchesGame = selectedGame 
        ? player.games.some(g => g.id.toString() === selectedGame) 
        : true;

      return matchesSearch && matchesGame;
    });
    setPlayerState(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedGame("");
    setPlayerState(players);
  };

  return (
    <section className="container-fluid">
      <div className="row">
        {/* Sidebar / Filters */}
        <div className="col-lg-3 mt-5">
          <div className="card shadow-md border border-secondary bg-light">
            <div className="card-body">
              <h5 className="card-title mb-4">Find Your Squad</h5>

              {/* Search Gamertag */}
              <div className="mb-4">
                <label className="form-label fw-bold small text-uppercase">Search Gamertag</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Vortex..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Game Select */}
              <div className="mb-4">
                <label className="form-label fw-bold small text-uppercase">Game</label>
                <select 
                  className="form-select" 
                  value={selectedGame}
                  onChange={(e) => setSelectedGame(e.target.value)}
                >
                  <option value="">All Games</option>
                  {games.map((game) => (
                    <option key={game.id} value={game.id}>{game.name}</option>
                  ))}
                </select>
              </div>

              <div className="d-flex flex-column gap-2">
                <button className="btn btn-primary" onClick={handleSearch}>Search</button>
                <button className="btn btn-outline-danger btn-sm" onClick={clearFilters}>Clear All</button>
              </div>
            </div>
          </div>
        </div>

        {/* Player Grid */}
        <div className="col-lg-9 mt-5">
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {playerState.map((player, index) => (
              <div key={player.id} className="col">
                <div className="card h-100 shadow-sm bg-light">
                  <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">@{player.gamerTag}</h5>
                    <span className={`badge rounded-pill bg-${index % 4 === 0 ? "success" : "danger"}`}>{index % 2 === 0 ? "Online" : "Offline"}</span>
                  </div>

                  <div className="card-body">
                    <p className="card-text text-muted small">{player.bio}</p>

                    <h6 className="card-subtitle mb-2 text-uppercase fw-bold">Top Games</h6>
                    <div className="mb-3">
                      {player.games.map((game) => (
                        <span key={game.id} className="badge bg-secondary me-1">
                          {game.name} {/* ✅ Fixed: Rendering game.name instead of object */}
                        </span>
                      ))}
                    </div>

                    <h6 className="card-subtitle mb-2 text-uppercase fw-bold">Playstyle</h6>
                    <div>
                      {player.tags.map((tag) => (
                        <span key={tag.id} className={`badge bg-${tag.color} me-1`}>
                          {tag.label} {/* ✅ Fixed: Rendering tag.label instead of object */}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="card-footer bg-transparent border-top-0 pb-3">
                    <div className="d-grid gap-2">
                      <button className="btn btn-primary">Request Match</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlayerListing;