import React, { useState, useEffect, useRef } from 'react';
import useElectronAPI from '../hooks/useElectronAPI';
import './TasksTab.css';

const TasksTab = () => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [focusDuration, setFocusDuration] = useState(25 * 60); // 25 minutes in seconds (Pomodoro)
  const intervalRef = useRef(null);
  const { sendTimerTick, sendTimerDone, sendTimerCanceled } = useElectronAPI();

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsPaused(false);
            // Notify Electron about timer completion
            sendTimerDone();
            return 0;
          }
          // Update Electron with timer progress
          sendTimerTick({
            state: 'running',
            remaining: (prev - 1) * 1000,
            total: focusDuration * 1000
          });
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, focusDuration]);

  const startFocus = () => {
    setTimeRemaining(focusDuration);
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseFocus = () => {
    setIsPaused(true);
    sendTimerTick({
      state: 'paused',
      remaining: timeRemaining * 1000,
      total: focusDuration * 1000
    });
  };

  const resumeFocus = () => {
    setIsPaused(false);
  };

  const cancelFocus = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeRemaining(0);
    sendTimerCanceled();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = focusDuration > 0 ? ((focusDuration - timeRemaining) / focusDuration) * 100 : 0;

  return (
    <div className="tasks-tab">
      <div className="timer-display">
        <div className="circular-progress">
          <svg className="progress-circle" viewBox="0 0 100 100">
            <circle
              className="progress-background"
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeWidth="4"
            />
            <circle
              className="progress-bar"
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            />
          </svg>
          <div className="timer-text">
            {isRunning ? formatTime(timeRemaining) : formatTime(focusDuration)}
          </div>
        </div>
      </div>
      
      <div className="timer-controls">
        {!isRunning ? (
          <button className="btn btn-primary" onClick={startFocus}>
            Start Focus Session
          </button>
        ) : (
          <div className="control-buttons">
            <button 
              className="btn btn-secondary" 
              onClick={isPaused ? resumeFocus : pauseFocus}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button className="btn btn-danger" onClick={cancelFocus}>
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="duration-selector">
        <label>Focus Duration:</label>
        <div className="duration-buttons">
          {[15, 25, 45, 60].map(minutes => (
            <button
              key={minutes}
              className={`duration-btn ${focusDuration === minutes * 60 ? 'active' : ''}`}
              onClick={() => setFocusDuration(minutes * 60)}
              disabled={isRunning}
            >
              {minutes}m
            </button>
          ))}
        </div>
      </div>

      <div className="session-info">
        <div className="info-text">
          Perfect for focused work sessions and productivity tracking
        </div>
      </div>
    </div>
  );
};

export default TasksTab;