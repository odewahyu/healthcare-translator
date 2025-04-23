'use client';

import { useState, useEffect, useRef } from 'react';

export default function SpeechToText({ language, onTranscription }) {
  const [isListening, setIsListening] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const buttonRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Speech Recognition not supported');
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = language;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.continuous = false;

    recognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      onTranscription(transcript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error', event.error);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, onTranscription]);

  // Handle button press
  const handleMouseDown = () => {
    setIsPressed(true);
    setIsListening(true);
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  // Handle button release
  const handleMouseUp = () => {
    setIsPressed(false);
    setIsListening(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // Handle touch events for mobile
  const handleTouchStart = (e) => {
    e.preventDefault();
    handleMouseDown();
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    handleMouseUp();
  };

  // Prevent context menu on long press
  useEffect(() => {
    const button = buttonRef.current;
    if (button) {
      const handleContextMenu = (e) => e.preventDefault();
      button.addEventListener('contextmenu', handleContextMenu);
      return () => button.removeEventListener('contextmenu', handleContextMenu);
    }
  }, []);

  return (
    <button
      ref={buttonRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Stop if mouse leaves button
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`relative px-6 py-3 rounded-full text-white font-medium transition-all
        ${isPressed ? 'bg-red-500 scale-95' : 'bg-blue-500 hover:bg-blue-600'}`}>
      <div className="flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 mr-2 ${isListening ? 'animate-pulse' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
        {isListening ? 'Listening...' : 'Hold to Speak'}
      </div>
      
      {/* Visual feedback for pressing */}
      {isPressed && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-ping absolute h-8 w-8 rounded-full bg-red-400 opacity-75"></div>
        </div>
      )}
    </button>
  );
}