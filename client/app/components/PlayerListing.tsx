"use client";

import { useState } from "react";

const PlayerListing = ({ players, games, tags }) => {
  const [playerState, setPlayerState] = useState(players);

  const filterPlayers = (games, tags) => {
    const filteredPlayers = players.filter((player) => {
      const matchGames = players.gameIds
        ? player.gameIds.indludes(players.gameIds)
        : true;

      const matchesTags = players.selectedTagIds.every((tagId) =>
        player.tagIds.includes(tagId),
      );

      return matchGames && matchesTags;
    });
    setPlayerState(filteredPlayers);
  };

  return (
    <section className="container-fluid">
        <div className="row row-cols-4">
      <div className="container mt-5 col-3">
        <div className="row">
          <div className="col">
            <div className="card shadow-md border border-secondary bg-light">
              <div className="card-body">
                <h5 className="card-title mb-4">Find Your Squad</h5>

                <div className="mb-4">
                  <label className="form-label fw-bold small text-uppercase">
                    Search Gamertag
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Vortex..."
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold small text-uppercase">
                    Game
                  </label>
                  <select className="form-select">
                    <option value="0">All Games</option>
                    <option value="1">Counter-Strike 2</option>
                    <option value="2">Minecraft</option>
                    <option value="3">League of Legends</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold small text-uppercase">
                    Playstyle
                  </label>
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="101"
                      id="tagComp"
                    />
                    <label className="form-check-label">Competitive</label>
                  </div>
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="102"
                      id="tagCasual"
                    />
                    <label className="form-check-label">Casual / Vibes</label>
                  </div>
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="103"
                      id="tagMic"
                    />
                    <label className="form-check-label">Mic Required</label>
                  </div>
                </div>
                <div className="d-flex flex-column gap-2">
                    <button className="btn btn-primary " type="button">
                      Search
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      type="button"
                    >
                      Clear All Filters
                    </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-5 col-9">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {playerState.length > 0 &&
            playerState.map((player, index) => {
              return (
                <div key={index} className="col">
                  <div key={index} className="card h-100 shadow-sm bg-light">
                    <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">@{player.gamertag}</h5>
                      <span className="badge rounded-pill bg-success">
                        Online
                      </span>
                    </div>

                    <div className="card-body">
                      <p className="card-text text-muted small">{player.bio}</p>

                      <h6 className="card-subtitle mb-2 text-uppercase fw-bold">
                        Top Games
                      </h6>
                      <div className="mb-3">
                        {player.gameIds.map((gameId, index) => {
                          return (
                            <div
                              key={index}
                              className="badge bg-secondary me-1"
                            >
                              {
                                games.filter((game) => game.id === gameId)[0]
                                  .name
                              }
                            </div>
                          );
                        })}
                      </div>

                      <h6 className="card-subtitle mb-2 text-uppercase fw-bold">
                        Playstyle
                      </h6>
                      <div>
                        {player.tagIds.map((tagId, index) => {
                          return (
                            <div
                              key={index}
                              className="badge border border-primary text-primary me-1"
                            >
                              {tags.filter((tag) => tag.id === tagId)[0].label}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="card-footer bg-transparent border-top-0 pb-3">
                      <div className="d-grid gap-2">
                        <button className="btn btn-primary" type="button">
                          Request Match
                        </button>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          type="button"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
        </div>




    </section>
  );
};

export default PlayerListing;
