
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import type { Message } from '../types';
import { Headset, X, Mic, Bot, WifiOff } from 'lucide-react';
// FIX: Removed non-exported 'LiveSession' type from the import.
import type { LiveServerMessage, Blob } from '@google/genai';

// --- Audio Utility Functions ---

// Decodes base64 string to Uint8Array
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Decodes raw PCM audio data into an AudioBuffer
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// Encodes Uint8Array to base64 string
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Creates a Blob object for the GenAI API from audio data
function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}


const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hello! I'm BharPAi's AI assistant. How can I help you today? Please allow microphone access to start our conversation.",
    },
  ]);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // FIX: Replaced 'LiveSession' with 'any' as it is not an exported type.
  const sessionRef = useRef<Promise<any> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  
  const currentInputTranscription = useRef('');
  const currentOutputTranscription = useRef('');
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  const stopAudioProcessing = useCallback(() => {
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (mediaStreamSourceRef.current) {
      mediaStreamSourceRef.current.disconnect();
      mediaStreamSourceRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, []);

  const cleanupSession = useCallback(() => {
    stopAudioProcessing();
    if (sessionRef.current) {
        sessionRef.current.then(session => session.close());
        sessionRef.current = null;
    }
    setStatus('idle');
  }, [stopAudioProcessing]);


  const startConversation = useCallback(async () => {
    if (sessionRef.current || !isOpen) return;

    setStatus('connecting');

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        
        let nextStartTime = 0;
        // FIX: Added 'as any' to 'window' to allow 'webkitAudioContext' for broader browser support without TypeScript errors.
        const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const outputNode = outputAudioContext.createGain();
        outputNode.connect(outputAudioContext.destination);
        const sources = new Set<AudioBufferSourceNode>();

        sessionRef.current = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                systemInstruction: 'You are a friendly and helpful customer support agent for BharPAi. Keep your responses concise and friendly.',
                inputAudioTranscription: {},
                outputAudioTranscription: {},
            },
            callbacks: {
                onopen: () => {
                    setStatus('connected');
                    // FIX: Added 'as any' to 'window' to allow 'webkitAudioContext' for broader browser support without TypeScript errors.
                    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                    mediaStreamSourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
                    scriptProcessorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
                    
                    scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
                        const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                        const pcmBlob = createBlob(inputData);
                        if (sessionRef.current) {
                            sessionRef.current.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        }
                    };
                    
                    mediaStreamSourceRef.current.connect(scriptProcessorRef.current);
                    scriptProcessorRef.current.connect(audioContextRef.current.destination);
                },
                onmessage: async (message: LiveServerMessage) => {
                    // Handle transcription
                    if (message.serverContent?.inputTranscription) {
                        currentInputTranscription.current += message.serverContent.inputTranscription.text;
                    }
                    if (message.serverContent?.outputTranscription) {
                        currentOutputTranscription.current += message.serverContent.outputTranscription.text;
                    }
                    if (message.serverContent?.turnComplete) {
                        const finalInput = currentInputTranscription.current.trim();
                        const finalOutput = currentOutputTranscription.current.trim();

                        setMessages(prev => {
                            const newMessages: Message[] = [...prev];
                            if(finalInput) newMessages.push({ role: 'user', text: finalInput });
                            if(finalOutput) newMessages.push({ role: 'model', text: finalOutput });
                            return newMessages;
                        });

                        currentInputTranscription.current = '';
                        currentOutputTranscription.current = '';
                    }

                    // Handle audio playback
                    const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                    if (base64Audio) {
                        nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
                        const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
                        const source = outputAudioContext.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(outputNode);
                        source.addEventListener('ended', () => sources.delete(source));
                        source.start(nextStartTime);
                        nextStartTime += audioBuffer.duration;
                        sources.add(source);
                    }
                     if (message.serverContent?.interrupted) {
                        for (const source of sources.values()) {
                            source.stop();
                        }
                        sources.clear();
                        nextStartTime = 0;
                    }
                },
                onerror: (e: ErrorEvent) => {
                    console.error('Session error:', e);
                    setStatus('error');
                    setMessages(prev => [...prev, {role: 'model', text: "Sorry, a connection error occurred. Please try again."}]);
                    cleanupSession();
                },
                onclose: (e: CloseEvent) => {
                    cleanupSession();
                },
            },
        });
    } catch (error) {
        console.error('Failed to start conversation:', error);
        setStatus('error');
        setMessages(prev => [...prev, { role: 'model', text: "I couldn't access your microphone. Please check your browser permissions." }]);
    }
  }, [isOpen, cleanupSession]);

  useEffect(() => {
    if (isOpen) {
      startConversation();
    } else {
      cleanupSession();
    }
    
    return () => {
      cleanupSession();
    };
  }, [isOpen, startConversation, cleanupSession]);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-300 z-50"
        aria-label="Toggle Customer Care Chat"
      >
        {isOpen ? <X size={32} /> : <Headset size={32} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-sm h-[70vh] max-h-[600px] bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col z-50 transition-all duration-300 transform-gpu animate-fade-in-up">
           <div className="flex items-center justify-between p-4 border-b border-gray-700">
             <div className="flex items-center space-x-2">
                <Bot className="text-purple-400" />
                <h3 className="font-bold text-lg text-white">BharPAi Care</h3>
             </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 {msg.role === 'model' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Bot size={20} className="text-white" />
                    </div>
                 )}
                <div className={`max-w-xs md:max-w-sm rounded-2xl px-4 py-2 ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-700 flex flex-col items-center justify-center">
             <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors duration-300 ${status === 'connected' ? 'bg-green-500/30' : 'bg-gray-700'}`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${status === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}>
                    {status === 'error' ? <WifiOff size={32} className="text-red-400" /> : <Mic size={32} className="text-white" />}
                </div>
            </div>
            <p className="text-xs text-gray-400 mt-3 capitalize">
                {status === 'connected' ? 'Listening...' : status === 'connecting' ? 'Connecting...' : status === 'error' ? 'Connection Failed' : 'Ready to Connect'}
            </p>
          </div>
          <style>{`
            @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
            .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
          `}</style>
        </div>
      )}
    </>
  );
};

export default Chatbot;
