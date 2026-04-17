export default function MatchRequests() {
    const match = [
        {id: 1, name: "Rara1900", match: "86% match", detail: "Casual gamer"},
        {id: 2, name: "StarryN9te", match: "92% match", detail: "FPS shooting games"},
        {id: 3, name: "pheonixf1reX", match: "73% match", detail: "Fortnite player"},
        {id: 4, name: "KirbyTree23", match: "71% match", detail: "Strategic games"},
        {id: 5, name: "soccer_rules7", match: "95% match", detail: "Horror games"}
    ];

    return (
        <main className="container py-5">
            <div className="text-center mb-5">
                <h2 className="fw-bold">Players that match your playstyle</h2>
                <p className="text-muted">Review matches and decide who you want to connect with</p>
            </div>

            <div className="row g-4">
                {match.map((player) => (
                    <div key={player.id} className="col-md-6 col-lg-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">{player.name}</h5>
                                <p className="card-text mb-1"><strong>{player.match}</strong></p>
                                <p className="card-text text-muted">{player.detail}</p>
                                <div className="d-flex gap-2 mt-3">
                                    <button className="btn btn-success">Accept</button>
                                    <button className="btn btn-outline-secondary">Decline</button>
                                </div>

                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </main>
    );
}