import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, ExternalLink, Star, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../components/Button';

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

import { ProductModal } from '../components/ProductModal';

export function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCompany, setActiveCompany] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<string>('All');
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [dbBrands, setDbBrands] = useState<string[]>([]);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = async (query: string, company: string = activeCompany, price: string = priceFilter, rating: number = ratingFilter) => {
    setLoading(true);
    setError(null);
    try {
      let min_price = null;
      let max_price = null;
      if (price === 'Under ₹500') max_price = 500;
      else if (price === '₹500 - ₹1000') { min_price = 500; max_price = 1000; }
      else if (price === 'Over ₹1000') min_price = 1000;

      const res = await fetch('http://localhost:8000/products/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: query || 'all',
          brand: company === 'All Brands' ? null : company,
          min_price,
          max_price,
          min_rating: rating > 0 ? rating : null
        })
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch from AI backend');
      }

      const data = await res.json();
      
      if (data.status !== "Success") {
        setProducts([]);
        setLoading(false);
        return;
      }
      
      if (!data.results || data.results.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }
      
      // Map the backend response to our frontend Product interface
      const aiProducts = data.results.map((r: any) => ({
        id: r.product.id,
        name: r.product.name,
        brand: r.product.brand,
        price: r.product.price,
        rating: r.product.rating,
        reviews: '1k+', // Placeholder as DB doesn't have review count yet
        image: r.product.image || 'https://images.unsplash.com/photo-1596462502278?auto=format&fit=crop&w=400&q=80',
        url: r.product.amazon_url || r.product.flipkart_url || '#',
        source: r.product.amazon_url ? 'Amazon' : 'Flipkart',
        description: r.product.description,
        explainability: r.explainability
      }));
      
      setProducts(aiProducts);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch AI recommendations.');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchProducts('all');
    
    // Fetch dynamic brands saved in DB
    fetch('http://localhost:8000/products/brands')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'Success' && data.brands) {
          setDbBrands(data.brands);
        }
      })
      .catch(err => console.error("Failed to load brands:", err));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(searchTerm, activeCompany, priceFilter, ratingFilter);
  };

  const handleCompanyFilter = (company: string) => {
    setActiveCompany(company);
    fetchProducts(searchTerm, company, priceFilter, ratingFilter);
  };

  const handlePriceFilter = (price: string) => {
    setPriceFilter(price);
    fetchProducts(searchTerm, activeCompany, price, ratingFilter);
  };

  const handleRatingFilter = (rating: number) => {
    setRatingFilter(rating);
    fetchProducts(searchTerm, activeCompany, priceFilter, rating);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="font-medium">Live Amazon & Flipkart Storefront</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-text tracking-tight mb-6"
          >
            Authentic Products, <span className="text-primary">Delivered Fast</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-secondary-text max-w-2xl mx-auto mb-10"
          >
            We dynamically fetch the best Ayurvedic products directly from Amazon and Flipkart. Search below or filter by top companies.
          </motion.p>
          
          {/* Smart Search Bar */}
          <motion.form 
            onSubmit={handleSearchSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto glass rounded-full p-2 flex items-center shadow-lg border border-border"
          >
            <div className="flex-1 flex items-center px-4">
              <Search className="w-5 h-5 text-secondary-text mr-3" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search live products from Amazon & Flipkart..." 
                className="w-full bg-transparent border-none outline-none text-text placeholder:text-secondary-text/70"
              />
            </div>
            <Button type="submit" size="lg" className="rounded-full px-8 flex items-center gap-2" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
            </Button>
          </motion.form>
        </div>
      </section>

      {/* Categories & Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 space-y-8 flex-shrink-0">
          <div>
            <h3 className="font-bold text-lg mb-4 text-text">Top Brands</h3>
            <div className="space-y-2 flex flex-col max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              <button 
                onClick={() => handleCompanyFilter('All Brands')}
                disabled={loading}
                className={`text-left px-4 py-2 rounded-lg transition-colors ${
                  activeCompany === 'All Brands' || activeCompany === null
                    ? 'bg-primary text-white font-medium' 
                    : 'text-secondary-text hover:bg-secondary-bg hover:text-text disabled:opacity-50'
                }`}
              >
                All Brands
              </button>
              
              {dbBrands.map(company => (
                <button 
                  key={company}
                  onClick={() => handleCompanyFilter(company)}
                  disabled={loading}
                  className={`text-left px-4 py-2 rounded-lg transition-colors ${
                    activeCompany === company 
                      ? 'bg-primary text-white font-medium' 
                      : 'text-secondary-text hover:bg-secondary-bg hover:text-text disabled:opacity-50'
                  }`}
                >
                  {company}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-text">Price</h3>
            <div className="space-y-2 flex flex-col">
              {['All', 'Under ₹500', '₹500 - ₹1000', 'Over ₹1000'].map(price => (
                <button 
                  key={price}
                  onClick={() => handlePriceFilter(price)}
                  disabled={loading}
                  className={`text-left px-4 py-2 rounded-lg transition-colors ${
                    priceFilter === price 
                      ? 'bg-primary/10 text-primary font-medium' 
                      : 'text-secondary-text hover:bg-secondary-bg hover:text-text disabled:opacity-50'
                  }`}
                >
                  {price}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-text">Customer Rating</h3>
            <div className="space-y-2 flex flex-col">
              {[0, 4, 3].map(rating => (
                <button 
                  key={rating}
                  onClick={() => handleRatingFilter(rating)}
                  disabled={loading}
                  className={`text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    ratingFilter === rating 
                      ? 'bg-primary/10 text-primary font-medium' 
                      : 'text-secondary-text hover:bg-secondary-bg hover:text-text disabled:opacity-50'
                  }`}
                >
                  {rating === 0 ? 'Any Rating' : `${rating} Stars & Up`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {error ? (
            <div className="bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl p-6 flex flex-col items-center justify-center text-center">
              <AlertCircle className="w-10 h-10 mb-2 opacity-80" />
              <h3 className="font-bold text-lg">Search Failed</h3>
              <p className="mt-2 mb-4 text-sm max-w-md">{error}</p>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="glass rounded-2xl overflow-hidden border border-border h-80 animate-pulse flex flex-col">
                  <div className="h-48 bg-secondary-bg/80 w-full" />
                  <div className="p-4 flex-1 flex flex-col gap-3">
                    <div className="h-4 bg-secondary-bg/80 rounded w-1/3" />
                    <div className="h-6 bg-secondary-bg/80 rounded w-full" />
                    <div className="h-6 bg-secondary-bg/80 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-secondary-text">
              <p className="text-lg">No products found. Try a different search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedProduct(product)}
                  className="glass rounded-2xl overflow-hidden border border-border group flex flex-col h-full hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 bg-white dark:bg-secondary-bg/10 cursor-pointer"
                >
                  <div className="h-56 overflow-hidden relative bg-white flex items-center justify-center p-4">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                      {product.explainability && product.explainability.score > 0.7 && (
                        <div className="bg-primary text-white px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                          High Match ({Math.round(product.explainability.score * 100)}%)
                        </div>
                      )}
                    </div>
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-yellow-500 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm border border-black/5">
                      <Star className="w-3 h-3 fill-current" />
                      {product.rating} ({product.reviews})
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="text-sm text-primary font-medium mb-1">{product.brand}</div>
                    <h3 className="font-bold text-[15px] leading-tight text-text mb-3 line-clamp-3">{product.name}</h3>
                    
                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50">
                      <div className="text-xl font-bold text-text">
                        <span className="text-sm font-normal text-secondary-text mr-1">₹</span>
                        {product.price}
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase font-bold text-secondary-text/70 mb-1">{product.source}</span>
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(product.url, '_blank');
                          }}
                          className="rounded-full flex items-center gap-1 text-sm px-4 py-1.5 h-auto"
                        >
                          Buy <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Product Detail Modal */}
      <ProductModal 
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
