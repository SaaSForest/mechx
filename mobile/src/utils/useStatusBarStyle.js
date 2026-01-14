import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { getStatusBarStyle } from './helpers';

  /**
   * 
 * @param {string} backgroundColor 
 * @param {boolean} animated 
 */
export const useStatusBarStyle = (backgroundColor, animated = true) => {
  useEffect(() => {
    const style = getStatusBarStyle(backgroundColor);
  }, [backgroundColor]);

  return getStatusBarStyle(backgroundColor);
};

/**
 * Component that automatically sets StatusBar style based on background color
 * 
 * @param {Object} props
 * @param {string} props.backgroundColor 
 * @param {boolean} props.animated 
 */
export const AdaptiveStatusBar = ({ backgroundColor, animated = true }) => {
  const style = getStatusBarStyle(backgroundColor);
  return <StatusBar style={style} animated={animated} />;
};
