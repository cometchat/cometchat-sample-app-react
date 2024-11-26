import React, { useEffect, useState } from 'react';
/**
 * Interface for the props of CometChatToast component
 */
interface CometChatToastProps {
  /** The text to display in the toast message */
  text: string;
  /** Duration (in milliseconds) for which the toast is visible (default is 3000ms) */
  duration?: number;
  /** Optional callback function that executes when the toast closes */
  onClose?:()=>void
}
/**
 * CometChatToast Component
 * 
 * This component displays a temporary toast message with a specified text and duration.
 * The toast will automatically disappear after the specified duration and optionally trigger
 * an `onClose` callback if provided.
 * 
 * @param {string} text - The message text to display in the toast
 * @param {number} duration - Duration for which the toast is visible
 * @param {function} onClose - Callback function executed when the toast closes
 * 
 * @returns {JSX.Element | null} - The JSX element for the toast message or null if no text is provided
 */
const CometChatToast: React.FC<CometChatToastProps> = ({ text, duration = 3000,onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if(onClose){
        onClose()
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!text) return null;

  return (
   <div className='cometchat' style={{height:"fit-content",width:"fit-content",overflow:"hidden"}}>
     <div className='cometchat-toast'>
      {text}
    </div>
   </div>
  );
};

export default CometChatToast;
