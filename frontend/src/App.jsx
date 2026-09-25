import { useEffect, useState } from "react";
import Header from "./components/Header";
import MatchCard from "./components/MatchCard";
import CommentaryPanel from "./components/CommentaryPanel";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [matches, setMatches] = useState([]);

  const [selectedMatchId, setSelectedMatchId] = useState(null);

  const selectedMatch =
    matches.find((match) => match.id === selectedMatchId) ?? null;

  const [commentary, setCommentary] = useState([]);

  // Initially true, so we don't need
  // setLoadingMatches(true) inside useEffect.
  const [loadingMatches, setLoadingMatches] = useState(true);

  const [loadingCommentary, setLoadingCommentary] = useState(false);

  const [apiConnected, setApiConnected] = useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // GET /matches
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    const loadMatches = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/matches`);

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const result = await response.json();

        if (cancelled) return;

        // Your API:
        //
        // {
        //   data: [...]
        // }

        setMatches(result.data || []);
        setApiConnected(true);
        setError("");
        setLoadingMatches(false);
      } catch (error) {
        if (cancelled) return;

        console.error("Error fetching matches:", error);

        setApiConnected(false);
        setError("Unable to connect to backend.");
        setLoadingMatches(false);
      }
    };

    loadMatches();

    return () => {
      cancelled = true;
    };
  }, []);

  // =====================================================
  // Refresh matches every 5 seconds
  // =====================================================

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/matches`);

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const result = await response.json();

        setMatches(result.data || []);
        setApiConnected(true);
        setError("");
      } catch (error) {
        console.error("Error refreshing matches:", error);

        setApiConnected(false);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // =====================================================
  // GET /matches/:matchId/commentary
  // =====================================================

  const fetchCommentary = async (matchId) => {
    try {
      setLoadingCommentary(true);

      const response = await fetch(
        `${API_BASE_URL}/matches/${matchId}/commentary`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const result = await response.json();

      /*
       * Your API currently returns:
       *
       * {
       *   data: {
       *      id: 6,
       *      matchId: 1,
       *      ...
       *   }
       * }
       *
       * We convert it into an array so the UI
       * can support multiple commentary events.
       */

      const data = result.data;

      if (Array.isArray(data)) {
        setCommentary(data);
      } else if (data) {
        setCommentary([data]);
      } else {
        setCommentary([]);
      }
    } catch (error) {
      console.error("Error fetching commentary:", error);

      setCommentary([]);
    } finally {
      setLoadingCommentary(false);
    }
  };

  // =====================================================
  // Select match
  // =====================================================

  const handleSelectMatch = (match) => {
    setSelectedMatchId(match.id);
    fetchCommentary(match.id);
  };

  // =====================================================
  // Close commentary
  // =====================================================

  const handleClose = () => {
    setSelectedMatchId(null);
    setCommentary([]);
  };

  // =====================================================
  // Refresh commentary for selected LIVE match
  // =====================================================

  useEffect(() => {
    if (!selectedMatchId) {
      return;
    }

    if (selectedMatch?.status?.toLowerCase() !== "live") {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/matches/${selectedMatchId}/commentary`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const result = await response.json();

        const data = result.data;

        if (Array.isArray(data)) {
          setCommentary(data);
        } else if (data) {
          setCommentary([data]);
        } else {
          setCommentary([]);
        }
      } catch (error) {
        console.error("Error refreshing commentary:", error);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [selectedMatchId, selectedMatch?.status]);

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="app">
      <Header connected={apiConnected} />

      <main className="main-container">
        {/* =========================================
            PAGE HEADER
        ========================================= */}

        <div className="content-header">
          <div className="section-title">
            <span className="title-line"></span>

            <h2>Current Matches</h2>
          </div>

          <div className="api-count">API: {matches.length}</div>
        </div>

        {/* =========================================
            ERROR
        ========================================= */}

        {error && <div className="error-message">{error}</div>}

        {/* =========================================
            DASHBOARD
        ========================================= */}

        <div className="dashboard">
          {/* =======================================
              MATCHES
          ======================================= */}

          <section className="matches-section">
            {loadingMatches ? (
              <div className="loading">Loading matches...</div>
            ) : matches.length === 0 ? (
              <div className="empty-state">No matches available.</div>
            ) : (
              <div className="matches-grid">
                {matches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    isSelected={selectedMatch?.id === match.id}
                    onSelect={handleSelectMatch}
                    onClose={handleClose}
                  />
                ))}
              </div>
            )}
          </section>

          {/* =======================================
              COMMENTARY
          ======================================= */}

          <CommentaryPanel
            match={selectedMatch}
            commentary={commentary}
            loading={loadingCommentary}
            onClose={handleClose}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
