import React, { useState, useEffect, useRef } from 'react';
import TabNavigation from './TabNavigation';
import TimerCard from './TimerCard';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const hideTimeoutRef = useRef(null);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsExpanded(true);
    
    // Reset hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    
    hideTimeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 2000);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsExpanded(true);
    
    hideTimeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="app">
      <TabNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isHovered={isHovered}
        isExpanded={isExpanded}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <TimerCard activeTab={activeTab} />
    </div>
  );
};

export default App;