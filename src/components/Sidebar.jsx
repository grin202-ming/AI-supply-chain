import React from 'react';
import { LayoutDashboard, History, Settings, LogOut, ShieldAlert } from 'lucide-react';

const Sidebar = ({ currentView, setCurrentView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'history', label: 'Email History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert size={24} color="#60A5FA" />
          <span>Compliance Supporter</span>
        </div>
      </div>
      
      <div className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`nav-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => setCurrentView(item.id)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 'auto', padding: '0 16px' }}>
        <div className="nav-item">
          <LogOut size={20} />
          <span>Log out</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
