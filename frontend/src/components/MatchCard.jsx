function MatchCard({ match, isSelected, onSelect, onClose }) {
  const { sport, homeTeam, awayTeam, status, startTime, homeScore, awayScore } =
    match;

  const isLive = status?.toLowerCase() === "live";

  const formattedTime = startTime
    ? new Date(startTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--:--";

  return (
    <article className={`match-card ${isSelected ? "selected-card" : ""}`}>
      {/* =========================================
          TOP ROW
      ========================================= */}

      <div className="match-top-row">
        <span className="sport-badge">{sport?.toUpperCase()}</span>

        <div
          className={`match-status ${
            isLive ? "live-status" : "finished-status"
          }`}
        >
          <span
            className={`status-dot ${isLive ? "live-dot" : "finished-dot"}`}
          ></span>

          {isLive ? "Live" : "Finished"}
        </div>
      </div>

      {/* =========================================
          TEAMS
      ========================================= */}

      <div className="teams">
        {/* HOME TEAM */}

        <div className="team-row">
          <span className="team-name">{homeTeam}</span>

          <span
            className={`score ${homeScore > awayScore ? "winning-score" : ""}`}
          >
            {homeScore}
          </span>
        </div>

        {/* AWAY TEAM */}

        <div className="team-row">
          <span className="team-name">{awayTeam}</span>

          <span
            className={`score ${awayScore > homeScore ? "winning-score" : ""}`}
          >
            {awayScore}
          </span>
        </div>
      </div>

      <div className="card-divider"></div>

      {/* =========================================
          BOTTOM
      ========================================= */}

      <div className="card-bottom">
        <span className="match-time">{formattedTime}</span>

        {isSelected ? (
          <button className="close-button" onClick={onClose}>
            Close
          </button>
        ) : (
          <button className="watch-button" onClick={() => onSelect(match)}>
            {isLive ? "Watch Live" : "View Commentary"}
          </button>
        )}
      </div>
    </article>
  );
}

export default MatchCard;
