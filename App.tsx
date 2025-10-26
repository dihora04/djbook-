
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import DjCard from './components/DjCard';
import { LocationMarkerIcon } from './components/Icons';
import { findDjsWithGoogleMaps } from './services/geminiService';
import type { GeminiResponse, GroundingChunk } from './types';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<GeolocationCoordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [response, setResponse] = useState<GeminiResponse | null>(null);
  
  const getLocation = useCallback(() => {
    setLocationError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(position.coords);
        },
        (err) => {
          setLocationError(`Location access denied: ${err.message}. Please enable location services in your browser.`);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!prompt.trim()) {
      setError("Please enter what you're looking for.");
      return;
    }
    if (!userLocation) {
      setError("We need your location to find nearby DJs. Please allow location access.");
      getLocation();
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse(null);

    const result = await findDjsWithGoogleMaps(prompt, userLocation);

    if (result.error) {
      setError(result.error);
    } else if(result.text && result.groundingChunks) {
      setResponse({
        text: result.text,
        groundingChunks: result.groundingChunks
      });
    }

    setIsLoading(false);
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (error) {
        return <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>;
    }
    if (response) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
                <h2 className="text-2xl font-bold font-orbitron text-cyan-300 neon-glow">AI Chat Assistant</h2>
                <div className="bg-gray-900/50 p-4 rounded-lg border border-cyan-500/30 whitespace-pre-wrap text-gray-300">
                    {response.text}
                </div>
            </div>
            <div className="space-y-4">
                <h2 className="text-2xl font-bold font-orbitron text-pink-400 neon-glow-pink">DJs Near You</h2>
                {response.groundingChunks.length > 0 ? (
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {response.groundingChunks.map((chunk, index) => (
                            <DjCard key={index} place={chunk.maps} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400">The AI assistant provided advice, but no specific map locations were found for this query.</p>
                )}
            </div>
        </div>
      );
    }
    return (
        <div className="text-center text-gray-400">
            <h2 className="text-3xl font-orbitron text-cyan-400 mb-2">Find the Perfect DJ</h2>
            <p>Tell us the vibe, event type, or music genre. Our AI will find the best match near you!</p>
            <p className="mt-4 text-sm">(e.g., "techno DJ for a warehouse party" or "a wedding DJ who plays 90s hip-hop")</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-black bg-grid-cyan-500/[0.2]">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="bg-black/60 backdrop-blur-lg p-6 rounded-xl border border-gray-800 shadow-2xl shadow-cyan-500/10">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your event vibe..."
              className="flex-grow bg-gray-900 border-2 border-gray-700 focus:border-pink-500 focus:ring-pink-500 rounded-lg px-4 py-3 text-white placeholder-gray-500 transition-colors duration-300"
            />
            <button
              type="submit"
              disabled={isLoading || !userLocation}
              className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-600 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 font-orbitron tracking-wider disabled:cursor-not-allowed shadow-lg shadow-cyan-500/30 enabled:hover:shadow-cyan-400/50"
            >
              {isLoading ? 'Searching...' : 'Find DJs'}
            </button>
          </form>

          {locationError ? (
             <div className="text-center text-yellow-400 bg-yellow-900/50 p-3 rounded-lg mb-6 flex items-center justify-center gap-2">
                <LocationMarkerIcon className="w-5 h-5"/>
                <span>{locationError}</span>
             </div>
          ) : !userLocation && (
             <div className="text-center text-gray-400 bg-gray-800/50 p-3 rounded-lg mb-6">
                Requesting location access to find DJs near you...
             </div>
          )}

          <div className="mt-8">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
