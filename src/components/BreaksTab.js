import React, { useState, useEffect, useRef } from 'react';
import useElectronAPI from '../hooks/useElectronAPI';
import './BreaksTab.css';

const BreaksTab = () => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [breakDuration, setBreakDuration] = useState(5 * 60); // 5 minutes in seconds
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
            total: breakDuration * 1000
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
  }, [isRunning, isPaused, breakDuration]);

  const startBreak = () => {
    setTimeRemaining(breakDuration);
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseBreak = () => {
    setIsPaused(true);
    sendTimerTick({
      state: 'paused',
      remaining: timeRemaining * 1000,
      total: breakDuration * 1000
    });
  };

  const resumeBreak = () => {
    setIsPaused(false);
  };

  const cancelBreak = () => {
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

  const progress = breakDuration > 0 ? ((breakDuration - timeRemaining) / breakDuration) * 100 : 0;

  return (
    <div className="breaks-tab">
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
            {isRunning ? formatTime(timeRemaining) : formatTime(breakDuration)}
          </div>
        </div>
      </div>
      
      <div className="timer-controls">
        {!isRunning ? (
          <button className="btn btn-primary" onClick={startBreak}>
            Start Break
          </button>
        ) : (
          <div className="control-buttons">
            <button 
              className="btn btn-secondary" 
              onClick={isPaused ? resumeBreak : pauseBreak}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button className="btn btn-danger" onClick={cancelBreak}>
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="duration-selector">
        <label>Break Duration:</label>
        <div className="duration-buttons">
          {[5, 10, 15, 20].map(minutes => (
            <button
              key={minutes}
              className={`duration-btn ${breakDuration === minutes * 60 ? 'active' : ''}`}
              onClick={() => setBreakDuration(minutes * 60)}
              disabled={isRunning}
            >
              {minutes}m
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BreaksTab;