import React from 'react';
import {
  SentimentSatisfiedAlt as SentimentSatisfiedAltIcon,
  SentimentDissatisfied as SentimentDissatisfiedIcon,
  SentimentVeryDissatisfied as SentimentVeryDissatisfiedIcon,
  SentimentNeutral as SentimentNeutralIcon,
  HelpOutline as HelpOutlineIcon,
  SentimentSatisfied as SentimentSatisfiedIcon,
} from '@mui/icons-material';

/**
 * Get consistent sentiment styling across the application
 * @param {string} sentiment - The sentiment string from database
 * @returns {object} - Object with color, icon, and label
 */
export const getSentimentStyle = (sentiment) => {
  if (!sentiment) {
    return { 
      color: 'default', 
      icon: <HelpOutlineIcon fontSize="small" />,
      label: 'Unknown'
    };
  }

  const upperSentiment = sentiment.toUpperCase();
  
  switch (upperSentiment) {
    case 'HAPPY':
      return { 
        color: 'success', 
        icon: <SentimentSatisfiedAltIcon fontSize="small" />,
        label: 'Happy'
      };
    case 'PLEASANT':
      return { 
        color: 'primary', 
        icon: <SentimentSatisfiedAltIcon fontSize="small" />,
        label: 'Pleasant'
      };
    case 'CALM':
      return { 
        color: 'info', 
        icon: <SentimentSatisfiedIcon fontSize="small" />,
        label: 'Calm'
      };
    case 'NEUTRAL':
      return { 
        color: 'default', 
        icon: <SentimentNeutralIcon fontSize="small" />,
        label: 'Neutral'
      };
    case 'SAD':
      return { 
        color: 'warning', 
        icon: <SentimentDissatisfiedIcon fontSize="small" />,
        label: 'Sad'
      };
    case 'ANGRY':
      return { 
        color: 'error', 
        icon: <SentimentVeryDissatisfiedIcon fontSize="small" />,
        label: 'Angry'
      };
    default:
      return { 
        color: 'default', 
        icon: <HelpOutlineIcon fontSize="small" />,
        label: sentiment || 'Unknown'
      };
  }
};

/**
 * Get sentiment chip component
 * @param {string} sentiment - The sentiment string from database
 * @returns {JSX.Element} - Material-UI Chip component
 */
export const getSentimentChip = (sentiment) => {
  const style = getSentimentStyle(sentiment);
  
  return {
    color: style.color,
    icon: style.icon,
    label: style.label
  };
};

/**
 * Get sentiment color for charts and other UI elements
 * @param {string} sentiment - The sentiment string from database
 * @returns {string} - Color hex code
 */
export const getSentimentColor = (sentiment) => {
  const upperSentiment = sentiment?.toUpperCase();
  
  switch (upperSentiment) {
    case 'HAPPY':
      return '#4caf50';
    case 'PLEASANT':
      return '#2196f3';
    case 'CALM':
      return '#00bcd4';
    case 'NEUTRAL':
      return '#9e9e9e';
    case 'SAD':
      return '#ff9800';
    case 'ANGRY':
      return '#f44336';
    default:
      return '#9e9e9e';
  }
}; 