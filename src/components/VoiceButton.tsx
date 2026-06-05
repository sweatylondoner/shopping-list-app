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
    return null; // Don't show button if voice input not supported
  }

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-24 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white text-2xl transition-all z-20 ${
        isListening
          ? 'bg-red-600 hover:bg-red-700 animate-pulse'
          : 'bg-brown-700 hover:bg-brown-800'
      }`}
      aria-label={isListening ? 'Stop recording' : 'Start voice input'}
    >
      {isListening ? '⏹' : '🎤'}
    </button>
  );
}
