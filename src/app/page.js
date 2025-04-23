'use client';

import { useState, useEffect } from 'react';
import SpeechToText from './components/SpeechToText';

// Language options with flags (using emoji for simplicity)
const languages = {
  input: [
    { code: 'en-US', name: 'English', flag: '🇺🇸' },
    { code: 'id-ID', name: 'Indonesian', flag: '🇮🇩' },
    { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
    { code: 'de-DE', name: 'German', flag: '🇩🇪' }
  ],
  output: [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' }
  ]
};

export default function Home() {
  const [originalText, setOriginalText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [inputLang, setInputLang] = useState('en-US');
  const [targetLang, setTargetLang] = useState('id');
  const [isTranslating, setIsTranslating] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [error, setError] = useState(null);

  // Reset states when language changes
  useEffect(() => {
    setOriginalText('');
    setTranslatedText('');
  }, [inputLang, targetLang]);

  // Handle translation
  useEffect(() => {
    const translateText = async () => {
      if (!originalText.trim()) return;
      
      setIsTranslating(true);
      setError(null);
      
      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            text: originalText,
            inputLang,
            targetLang 
          })
        });
        
        if (!response.ok) throw new Error('Translation failed');
        
        const result = await response.text();
        setTranslatedText(result);
        
        // Add to conversation history
        setConversationHistory(prev => [
          ...prev,
          {
            input: originalText,
            output: result,
            inputLang,
            targetLang,
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setIsTranslating(false);
      }
    };

    const timer = setTimeout(translateText, 500);
    return () => clearTimeout(timer);
  }, [originalText, inputLang, targetLang]);

  const speakTranslation = () => {
    if (!translatedText) return;
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(translatedText);
      utterance.lang = targetLang;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      setError('Text-to-speech not supported in your browser');
    }
  };

  const clearConversation = () => {
    setOriginalText('');
    setTranslatedText('');
    setError(null);
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">
            Healthcare Translation Assistant
          </h1>
          <p className="text-gray-600">
            Speak in any language and get instant medical translations
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
            <div className="flex items-center mb-2">
              <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">1</div>
              <h3 className="font-medium text-black font-semibold">Select Languages</h3>
            </div>
            <p className="text-sm text-gray-600">Choose input and target languages</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
            <div className="flex items-center mb-2">
              <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">2</div>
              <h3 className="font-medium text-black font-semibold">Speak</h3>
            </div>
            <p className="text-sm text-gray-600">Hold mic and speak clearly</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
            <div className="flex items-center mb-2">
              <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">3</div>
              <h3 className="font-medium text-black font-semibold">Get Translation</h3>
            </div>
            <p className="text-sm text-gray-600">View translated text</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
            <div className="flex items-center mb-2">
              <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">4</div>
              <h3 className="font-medium text-black font-semibold">Hear Translation</h3>
            </div>
            <p className="text-sm text-gray-600">Click speaker to listen</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-black font-semibold">Patient Speech</h2>
              <button 
                onClick={clearConversation}
                className="text-sm text-red-500 hover:text-red-700">
                Clear All
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 text-black font-medium">Input Language:</label>
              <select
                value={inputLang}
                onChange={(e) => setInputLang(e.target.value)}
                className="w-full p-2 border rounded text-black"
              >
                {languages.input.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-center mb-4">
              <SpeechToText 
                language={inputLang} 
                onTranscription={setOriginalText} 
              />
            </div>
            
            <div className="mt-4 p-4 border rounded-lg min-h-40 bg-gray-50 text-black">
              {originalText || (
                <div className="text-gray-400 italic">
                  {inputLang.startsWith('en') 
                    ? "Speak and your words will appear here..." 
                    : "Bicara dan kata-kata Anda akan muncul di sini..."}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl text-black font-semibold mb-4">Translation</h2>
            
            <div className="mb-4">
              <label className="block mb-2 text-black font-medium">Target Language:</label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full p-2 border rounded text-black"
              >
                {languages.output.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-2 mb-4 justify-center">
              <button
                onClick={speakTranslation}
                disabled={!translatedText || isTranslating}
                className={`px-6 py-3 rounded-full text-white font-medium flex ${
                  !translatedText || isTranslating 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-green-500 hover:bg-green-600'
                } text-white`}>
                <span className="mr-2">🔊</span>
                Speak Translation
              </button>
            </div>
            
            <div className="mt-4 p-4 border rounded-lg min-h-40 bg-gray-50 text-black">
              {isTranslating ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-2">Translating...</span>
                </div>
              ) : translatedText ? (
                translatedText
              ) : (
                <div className="text-gray-400 italic">
                  {targetLang === 'id' 
                    ? "Terjemahan akan muncul di sini..." 
                    : "Translation will appear here..."}
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>Error: {error}</p>
          </div>
        )}

        {conversationHistory.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Conversation History</h2>
            <div className="space-y-4">
              {conversationHistory.map((item, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>{item.timestamp}</span>
                    <span>{item.inputLang} → {item.targetLang}</span>
                  </div>
                  <p className="font-medium mb-1">{item.input}</p>
                  <p className="text-blue-600">{item.output}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>Note: Conversations are not stored permanently and will disappear when the page is refreshed. For medical emergencies, contact local services.</p>
        </footer>
      </div>
    </main>
  );
}