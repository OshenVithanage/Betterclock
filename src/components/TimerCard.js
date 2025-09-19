import React from 'react';
import BreaksTab from './BreaksTab';
import TasksTab from './TasksTab';
import './TimerCard.css';

const TimerCard = ({ activeTab }) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'breaks':
        return <BreaksTab />;
      case 'tasks':
        return <TasksTab />;
      default:
        return <TasksTab />;
    }
  };

  return (
    <div className="timer-card">
      {renderTabContent()}
    </div>
  );
};

export default TimerCard;