'use client';

import { useState } from 'react';
import { useVoiceInput } from '@/lib/hooks/useVoiceInput';

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
}

export default function VoiceButton({ onTranscript }: VoiceButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const { startListening, stopListening, isSupported } = useVoiceInput();

  const handleClick = async () => {
    if (isListening) {
      const transcript = await stopListening();
      setIsListening(false);
      if (transcript) {
        onTranscript(transcript);
      }
    } else {
      const started = await startListening();
      if (started) {
        setIsListening(true);
      }
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-24 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-all z-20 ${
        isListening
          ? 'bg-red-600 hover:bg-red-700 animate-pulse'
          : 'bg-brown-700 hover:bg-brown-800'
      }`}
      aria-label={isListening ? 'Stop recording' : 'Start voice input'}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
      </svg>
    </button>
  );
}
