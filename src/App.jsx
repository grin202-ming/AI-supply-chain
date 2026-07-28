import React, { useState } from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import HistoryView from './components/HistoryView';
import SettingsView from './components/SettingsView';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderContent = () => {
    switch(currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'history':
        return <HistoryView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  const getTitle = () => {
    switch(currentView) {
      case 'dashboard': return 'Dashboard Overview';
      case 'history': return 'Email Send History';
      case 'settings': return 'System Settings';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="app-container">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      
      <div className="main-content">
        <div className="header">
          <div className="header-title">{getTitle()}</div>
          <div className="header-profile">
            <span>Admin User</span>
            <div className="profile-circle">A</div>
          </div>
        </div>
        
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
