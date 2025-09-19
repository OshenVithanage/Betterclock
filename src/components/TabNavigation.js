import React, { useEffect, useRef, useState } from 'react';
import TabIndicator from './TabIndicator';
import './TabNavigation.css';

const TabNavigation = ({ 
  activeTab, 
  onTabChange, 
  isHovered, 
  isExpanded, 
  onMouseEnter, 
  onMouseLeave 
}) => {
  const tabsRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  const tabs = [
    {
      id: 'breaks',
      label: 'Breaks',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5C14.8 6.6 14.3 5.8 13.5 5.3L16.8 2L15.4 0.6L12 4L8.6 0.6L7.2 2L10.5 5.3C9.7 5.8 9.2 6.6 9 7.5L3 7V9L9 8.5V10.5C9 11.3 9.7 12 10.5 12H13.5C14.3 12 15 11.3 15 10.5V8.5L21 9ZM6 13C4.9 13 4 13.9 4 15S4.9 17 6 17 8 16.1 8 15 7.1 13 6 13ZM6 19C4.9 19 4 19.9 4 21S4.9 23 6 23 8 22.1 8 21 7.1 19 6 19ZM18 13C16.9 13 16 13.9 16 15S16.9 17 18 17 20 16.1 20 15 19.1 13 18 13ZM18 19C16.9 19 16 19.9 16 21S16.9 23 18 23 20 22.1 20 21 19.1 19 18 19Z"/>
        </svg>
      )
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M7,7H17V9H7V7M7,11H17V13H7V11M7,15H13V17H7V15Z"/>
        </svg>
      )
    }
  ];

  const updateIndicator = () => {
    const activeTabElement = tabsRef.current?.querySelector(`[data-tab="${activeTab}"]`);
    const tabsContainer = tabsRef.current;
    
    if (activeTabElement && tabsContainer) {
      const tabsRect = tabsContainer.getBoundingClientRect();
      const activeTabRect = activeTabElement.getBoundingClientRect();
      
      const containerWidth = tabsRect.width;
      const tabWidth = activeTabRect.width;
      const tabLeft = activeTabRect.left - tabsRect.left;
      
      const maxLeft = containerWidth - tabWidth - 8;
      const constrainedLeft = Math.max(4, Math.min(tabLeft, maxLeft));
      const constrainedWidth = Math.min(tabWidth, containerWidth - 8);
      
      setIndicatorStyle({
        width: `${constrainedWidth}px`,
        transform: `translateX(${constrainedLeft}px)`
      });
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(updateIndicator, 100);
    return () => clearTimeout(timeoutId);
  }, [activeTab, isHovered, isExpanded]);

  useEffect(() => {
    const handleResize = () => updateIndicator();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      ref={tabsRef}
      className={`tabs ${isExpanded ? 'expanded' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <TabIndicator style={indicatorStyle} />
      {tabs.map((tab) => (
        <button
          key={tab.id}
          data-tab={tab.id}
          className={`tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.icon}
          <span className="tab-text">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;