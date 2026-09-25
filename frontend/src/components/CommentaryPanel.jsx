function CommentaryPanel({ match, commentary, loading, onClose }) {
  const formatTime = (timestamp) => {
    if (!timestamp) {
      return "--:--:--";
    }

    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatEventType = (eventType) => {
    if (!eventType) {
      return "EVENT";
    }

    return eventType.replaceAll("_", " ").toUpperCase();
  };

  const getEventClass = (eventType) => {
    if (!eventType) {
      return "event-default";
    }

    return `event-${eventType.toLowerCase().replaceAll("_", "-")}`;
  };

  return (
    <aside className="commentary-panel">
      {/* Header */}

      <div className="commentary-header">
        <h2>Live Commentary</h2>

        <div className="realtime-badge">
          <span className="realtime-dot"></span>
          Real-time
        </div>
      </div>

      {/* No match */}

      {!match ? (
        <div className="commentary-empty">
          <div className="empty-icon">▶</div>

          <h3>Select a match</h3>

          <p>Click "Watch Live" on a match to view its commentary.</p>
        </div>
      ) : (
        <>
          {/* Selected match */}

          <div className="selected-match-info">
            <div className="selected-team">
              <strong>{match.homeTeam}</strong>

              <span className="selected-score">{match.homeScore}</span>
            </div>

            <span className="vs">VS</span>

            <div className="selected-team">
              <strong>{match.awayTeam}</strong>

              <span className="selected-score">{match.awayScore}</span>
            </div>
          </div>

          {/* Commentary list */}

          <div className="commentary-scroll">
            {loading ? (
              <div className="loading-commentary">Loading commentary...</div>
            ) : commentary.length === 0 ? (
              <div className="commentary-empty-small">
                No commentary available for this match.
              </div>
            ) : (
              commentary.map((item, index) => (
                <div className="commentary-item" key={item.id}>
                  {/* Timeline */}

                  <div className="timeline">
                    <span className="timeline-dot"></span>

                    {index !== commentary.length - 1 && (
                      <span className="timeline-line"></span>
                    )}
                  </div>

                  {/* Content */}

                  <div className="commentary-content">
                    {/* Meta */}

                    <div className="commentary-meta">
                      <span className="commentary-time">
                        {formatTime(item.createdAt)}
                      </span>

                      <span className="meta-badge">{item.minute}'</span>

                      <span className="meta-badge">Seq {item.sequence}</span>

                      <span className="meta-badge">{item.period}</span>

                      <span
                        className={`event-badge ${getEventClass(
                          item.eventType,
                        )}`}
                      >
                        {formatEventType(item.eventType)}
                      </span>
                    </div>

                    {/* Actor */}

                    <div className="commentary-actor">
                      <strong>{item.actor}</strong>

                      <span>
                        {" · "}
                        {item.team}
                      </span>
                    </div>

                    {/* Message */}

                    <div className="commentary-message">{item.message}</div>

                    {/* Metadata */}

                    {item.metadata && Object.keys(item.metadata).length > 0 && (
                      <div className="metadata-box">
                        {Object.entries(item.metadata).map(([key, value]) => (
                          <div className="metadata-item" key={key}>
                            <span>{key}</span>

                            <strong>{String(value)}</strong>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tags */}

                    {item.tags?.length > 0 && (
                      <div className="commentary-tags">
                        {item.tags.map((tag) => (
                          <span className="tag" key={tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}

          <div className="commentary-footer">
            <button className="panel-close-button" onClick={onClose}>
              Close Commentary
            </button>
          </div>
        </>
      )}
    </aside>
  );
}

export default CommentaryPanel;
