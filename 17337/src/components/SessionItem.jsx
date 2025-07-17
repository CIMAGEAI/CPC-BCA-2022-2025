import React from 'react';
import { FaDesktop, FaMobileAlt, FaTabletAlt } from 'react-icons/fa';

const SessionItem = ({ session, onLogout, isCurrent }) => {
  
  const getDeviceIcon = (deviceType) => {
    switch (deviceType) {
      case 'mobile':
        return <FaMobileAlt />;
      case 'tablet':
        return <FaTabletAlt />;
      default:
        return <FaDesktop />;
    }
  };

  return (
    <div className={`session-item ${isCurrent ? 'current-session' : ''}`}>
      <div className="session-icon">
        {getDeviceIcon(session.deviceType)}
      </div>
      <div className="session-info">
        <p><strong>{session.browser || 'Unknown'}</strong> on <strong>{session.os || 'Unknown'}</strong></p>
        <p className="last-seen">
          IP: {session.ipAddress}
          {session.lastSeen && ` - Last seen: ${new Date(session.lastSeen.seconds * 1000).toLocaleString()}`}
        </p>
      </div>
      {isCurrent ? (
        <span className="current-device-tag">This Device</span>
      ) : (
        <button className="btn-logout-device" onClick={() => onLogout(session.id)}>
          Log out
        </button>
      )}
    </div>
  );
};

export default SessionItem;