import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, Video, Stethoscope, Clock, Phone } from 'lucide-react';
import { Button } from './Button';

interface DoctorCardProps {
  id: string;
  name: string;
  qualification: string;
  experience: number;
  rating: number;
  reviews: number;
  location: string;
  languages: string[];
  type: ('online' | 'in-person')[];
  image: string;
  phone?: string;
  mapLink?: string;
}

export function DoctorCard({ doctor }: { doctor: DoctorCardProps }) {
  const [showPhonePopup, setShowPhonePopup] = useState(false);

  const handleCallClick = () => {
    // If mobile device (width < 768px) or touch device, open phone app
    if (typeof window !== 'undefined' && (window.innerWidth < 768 || 'ontouchstart' in window)) {
      window.open(`tel:${doctor.phone}`, '_self');
    } else {
      // If laptop/desktop, show the popup
      setShowPhonePopup(true);
    }
  };

  const handleMapClick = () => {
    if (doctor.mapLink) {
      window.open(doctor.mapLink, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doctor.name + ' ' + doctor.location)}`, '_blank');
    }
  };

  return (
    <>
    <motion.div
      whileHover={{ y: -4 }}
      className="glass rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-border group"
    >
      <div className="p-5 flex gap-5">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-secondary-bg flex items-center justify-center">
            {doctor.image ? (
              <img 
                src={doctor.image} 
                alt={doctor.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
            ) : (
              <Stethoscope className="w-10 h-10 text-primary/40 group-hover:scale-110 transition-transform duration-500" />
            )}
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white dark:bg-card px-2 py-1 rounded-lg text-xs font-bold text-text shadow-sm border border-border flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            {doctor.rating}
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold text-text mb-1">{doctor.name}</h3>
          <p className="text-sm text-primary font-medium mb-2">{doctor.qualification}</p>
          
          <div className="flex flex-col gap-1.5 mb-4">
            <div className="flex items-center gap-2 text-sm text-secondary-text">
              <Stethoscope className="w-4 h-4" />
              <span>{doctor.experience} years experience</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-secondary-text">
              <MapPin className="w-4 h-4" />
              <span>{doctor.location}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {doctor.type.includes('online') && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium">
                <Video className="w-3 h-3" /> Online
              </span>
            )}
            {doctor.type.includes('in-person') && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                <Clock className="w-3 h-3" /> In-person
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-border p-4 bg-secondary-bg/30 flex items-center justify-end gap-3">
        {doctor.phone && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleCallClick}
          >
            Call
          </Button>
        )}
        <Button 
          variant="primary" 
          size="sm"
          onClick={handleMapClick}
        >
          See on Map
        </Button>
      </div>
    </motion.div>

    <AnimatePresence>
      {showPhonePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-card p-6 md:p-8 rounded-3xl shadow-2xl max-w-sm w-full border border-border relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-emerald-400"></div>
            
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Phone className="w-8 h-8" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-text mb-2 text-center">Contact Clinic</h3>
            <p className="text-sm text-secondary-text text-center mb-6">
              Call <span className="font-semibold text-text">{doctor.name}</span> to book an appointment:
            </p>
            
            <div className="bg-secondary-bg p-4 rounded-2xl text-center mb-6 border border-border shadow-inner">
              <p className="text-2xl font-bold tracking-wider bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                {doctor.phone}
              </p>
            </div>
            
            <Button variant="primary" className="w-full" onClick={() => setShowPhonePopup(false)}>
              Done
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
}
