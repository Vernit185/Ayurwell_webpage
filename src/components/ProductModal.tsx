import { X, ExternalLink, Star, ShieldCheck, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: string;
  rating: string;
  reviews: string;
  image: string;
  url: string;
  source: string;
  description?: string;
  explainability?: {
    confidence_level: string;
    score: number;
    reasons: string[];
  };
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-white dark:bg-secondary-bg rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/5 hover:bg-black/10 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5 text-text" />
            </button>

            {/* Image Section */}
            <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-8 relative">
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-yellow-500 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm border border-black/5">
                <Star className="w-4 h-4 fill-current" />
                {product.rating} <span className="text-secondary-text font-normal">({product.reviews} reviews)</span>
              </div>
              <img
                src={product.image}
                alt={product.name}
                className="max-w-full max-h-[400px] object-contain mix-blend-multiply"
              />
            </div>

            {/* Details Section */}
            <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider w-fit mb-4">
                {product.brand}
              </div>
              
              <h2 className="text-2xl font-bold text-text mb-4 leading-snug">{product.name}</h2>
              
              <div className="flex items-end gap-2 mb-6">
                <div className="text-4xl font-black text-text">
                  <span className="text-2xl font-medium text-secondary-text mr-1">₹</span>
                  {product.price}
                </div>
              </div>

              {product.explainability && (
                <div className="mb-6 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`px-2 py-0.5 rounded text-xs font-bold ${
                      product.explainability.confidence_level === 'High' ? 'bg-green-100 text-green-700' :
                      product.explainability.confidence_level === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {product.explainability.confidence_level} Confidence
                    </div>
                    <span className="text-xs text-secondary-text font-medium text-primary">
                      Why this was recommended:
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {product.explainability.reasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-text/80">
                        <span className="text-primary mt-1">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-4 mb-8 flex-1">
                <div className="flex items-center gap-3 text-secondary-text">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-text">Authentic Product</p>
                    <p className="text-sm">Verified Ayurvedic ingredients</p>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                onClick={() => window.open(product.url, '_blank')}
                className="w-full rounded-xl py-6 text-lg font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all"
              >
                Buy on {product.source} <ExternalLink className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
