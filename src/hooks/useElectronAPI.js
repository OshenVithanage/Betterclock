import { useEffect, useCallback } from 'react';

export const useElectronAPI = () => {
  const isElectron = () => {
    return window.electronAPI !== undefined;
  };

  const sendTimerTick = useCallback((payload) => {
    if (isElectron()) {
      window.electronAPI.timerTick(payload);
    }
  }, []);

  const sendTimerDone = useCallback(() => {
    if (isElectron()) {
      window.electronAPI.timerDone();
    }
  }, []);

  const sendTimerCanceled = useCallback(() => {
    if (isElectron()) {
      window.electronAPI.timerCanceled();
    }
  }, []);

  const onTrayAction = useCallback((callback) => {
    if (isElectron()) {
      const handler = (event, action) => {
        callback(action);
      };
      
      window.electronAPI.onTrayAction(handler);
      
      // Return cleanup function
      return () => {
        // Note: Electron's ipcRenderer doesn't have removeListener for preload exposed APIs
        // This is handled internally by Electron
      };
    }
    
    return () => {}; // No-op cleanup
  }, []);

  return {
    isElectron: isElectron(),
    sendTimerTick,
    sendTimerDone,
    sendTimerCanceled,
    onTrayAction
  };
};

export default useElectronAPI;