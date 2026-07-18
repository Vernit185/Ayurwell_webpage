import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { DoctorCard } from '../components/DoctorCard';

export function Doctors() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState('Waiting for location...');

  const fetchGoogleDoctors = async (lat: number, lon: number, query = '') => {
    setLoading(true);
    setError(null);
    try {
      // Call our secure Vercel Serverless Function
      const res = await fetch(`/api/scrape-google?lat=${lat}&lon=${lon}&q=${encodeURIComponent(query)}`);
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to fetch from backend API');
      }

      const data = await res.json();
      
      if (!data.doctors || data.doctors.length === 0) {
        throw new Error('No doctors found.');
      }
      
      setDoctors(data.doctors);
      setLocationStatus(`Found ${data.doctors.length} Ayurvedic practitioners near your location!`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch live doctors.');
      setLocationStatus('Search failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleFindNearMe = () => {
    setLocationStatus('Requesting location access...');
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocationStatus('Scraping Google for nearby doctors...');
          fetchGoogleDoctors(latitude, longitude, 'Ayurvedic doctors near me');
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationStatus('Location denied. Scraping general doctors...');
          // Fallback coords (e.g. Mumbai)
          fetchGoogleDoctors(19.0760, 72.8777, 'Ayurvedic doctors near me');
        }
      );
    } else {
      fetchGoogleDoctors(19.0760, 72.8777, 'Ayurvedic doctors near me');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 -z-10" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3 -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-text tracking-tight mb-6"
          >
            Live Ayurvedic <span className="text-primary">Practitioners</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-secondary-text max-w-2xl mx-auto mb-10"
          >
            We dynamically scrape Google Search to find real Ayurvedic clinics and practitioners near your exact location instantly.
          </motion.p>
          
          {/* Action Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center max-w-4xl mx-auto"
          >
            <Button 
              size="lg" 
              className="rounded-full px-8 flex items-center gap-2 shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all" 
              onClick={handleFindNearMe}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
              Find Live Doctors Near Me
            </Button>
            {loading && <p className="mt-4 text-sm text-primary font-medium animate-pulse">{locationStatus}</p>}
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-text">Scraped Search Results</h2>
        </div>

        {error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl p-8 flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
            <AlertCircle className="w-12 h-12 mb-4 opacity-80" />
            <h3 className="font-bold text-xl mb-2">Network Error Detected</h3>
            <p className="mb-6">{error}</p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass rounded-2xl p-6 h-64 animate-pulse flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-secondary-bg/80" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-secondary-bg/80 rounded w-3/4" />
                    <div className="h-4 bg-secondary-bg/80 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-3 mt-4">
                  <div className="h-4 bg-secondary-bg/80 rounded w-full" />
                  <div className="h-4 bg-secondary-bg/80 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : doctors.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {doctors.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <DoctorCard doctor={doctor} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <MapPin className="w-12 h-12 text-secondary-text/30 mx-auto mb-4" />
            <p className="text-xl text-secondary-text">Click the button above to scrape OSM for local clinics.</p>
          </div>
        )}
      </div>
    </div>
  );
}
