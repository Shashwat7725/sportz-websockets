function Header({ connected }) {
  return (
    <header className="header">
      <div className="logo-section">
        <h1 className="logo">Sportz</h1>
        <p className="logo-subtitle">Real-time match data demo</p>
      </div>

      <div className="connection-status">
        <span
          className={`connection-dot ${
            connected ? "connected" : "disconnected"
          }`}
        ></span>

        {connected ? "LIVE CONNECTED" : "DISCONNECTED"}
      </div>
    </header>
  );
}

export default Header;
