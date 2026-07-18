import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Search, ChevronDown, Loader2 } from 'lucide-react';

// The articles from the old Knowledge Hub
const ARTICLES = [
  {
    title: "Ayurvedic Management of Acne Vulgaris",
    category: "Acne",
    author: "Upadhyay, Abhishek; Khanal, Hari; Joshi, Ram Kishor",
    description: "This case study demonstrates the potential and usefulness of Ayurveda in the management of acne vulgaris.(facial acne)",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15",
    link: "https://journals.lww.com/joay/fulltext/2021/15040/ayurvedic_management_of_acne_vulgaris.14.aspx2",
  },
  {
    title: "Ayurveda for Acne - 8 Ayurvedic Remedies",
    category: "Acne",
    author: "Sen Wellness Sanctuary - Sri Lanka",
    description: "This article describes 8 ayurvedic remedies for acne as well as ayurvedic herbs and diet recommendation to prevent acne",
    image: "https://www.senwellnesssanctuary.com/wp-content/uploads/2023/10/EFV-20210822-SEN-Welness-Sanctuary-2350.jpg.webp",
    link: "https://www.senwellnesssanctuary.com/ayurveda-for-acne",
  },
  {
    title: "5 Ayurvedic Solutions for Acne & Related Skin Concerns",
    category: "Acne",
    author: "Apollo Pharmacy",
    description: "Explore seven evidence-backed Ayurvedic solutions for acne, pigmentation, and clearer skin.",
    image: "https://images.apollo247.in/momandbaby/Adobe_Stock_1514072775_7cb476fc9a/Adobe_Stock_1514072775_7cb476fc9a.jpeg?tr=q-80,f-webp,w-800,dpr-2,c-at_max",
    link: "https://www.apollopharmacy.in/blogs/article/ayurvedic-solutions-for-acne?srsltid=AfmBOooat6n3K8ldB9q9WMRqVzhofxrrog7u4vErszduQdxxpeqTTE5M",
  },
  {
    title: "Ayurvedic Home Remedies For Acne",
    category: "Acne",
    author: "Birla Ayurveda",
    description: "Here are some Ayurvedic home remedies for acne that may help you to treat acne better.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_ogpUVo5dN8eAYp8kXFTp-njSzwQfivU80g&s",
    link: "https://birlaayurveda.co.in/ayurvedic-home-remedies-for-acne/?srsltid=AfmBOor8istPsfxgTYNkY4JqRBQYs4ytXaWmoDhOs96euaazZxD2JFMt",
  },
  {
    title: "Top 10 Ayurvedic Remedies for Stress Relief",
    category: "Stress",
    author: "Sir Ganga Ram Hospitals",
    description: "Ashwagandha and Ayurvedic herbs help reduce stress and anxiety naturally.",
    image: "https://sgrh.com/assets/img/uploads/17430614042.jpeg",
    link: "https://sgrh.com/blog/top-10-ayurvedic-remedies-for-stress-relief-",
  },
  {
    title: "STRESS – MANAGEMENT : LEADS FROM AYURVEDA",
    category: "Stress",
    author: "D Arora",
    description: "The role of stress in several diseases is recognized in Ayurveda and modern medicine.",
    image: "https://cdn.ncbi.nlm.nih.gov/pmc/banners/logo-ancscilife.gif",
    link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3330949/",
  },
  {
    title: "5 Homemade Ayurvedic Tonics That Help Calm Your Stomach ASAP",
    category: "Digestion",
    author: "Healthline",
    description: "Ayurvedic kitchen remedies for indigestion, bloating and acidity.",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
    link: "https://www.healthline.com/health/food-nutrition/ayurvedic-tonics-stomach-disorder",
  },
  {
    title: "Home Remedies for Sleep: Ayurvedic Ways to Beat Sleeplessness Naturally",
    category: "Sleep",
    author: "Nisarga Herbs",
    description: "Discover Ayurvedic home remedies for sleep and sleeplessness.",
    image: "https://www.nisargaherbs.com/cdn/shop/articles/Sleeplessness_0f27c68b-d8cd-4857-8f84-c980b4d4d438.jpg?v=1771916818&width=1600",
    link: "https://www.nisargaherbs.com/blogs/all/home-remedies-for-sleep-ayurvedic-ways-to-beat-sleeplessness-naturally?srsltid=AfmBOop4WR98I30NhyD1o9OsRDElgPDo_1xCHFVgPnE9rHkrn0s7VAJK",
  },
  {
    title: "Ayurvedic Treatment for Hair Fall",
    category: "Hair Fall",
    author: "Niramaya Ayurvedic Hospital",
    description: "Warm herbal oils like Bhringraj and Brahmi help reduce hair fall.",
    image: "https://niramayayurveda.com/wp-content/uploads/2025/11/best-Ayurvedic-Doctor-in-Surat.jpg",
    link: "https://niramayayurveda.com/ayurvedic-treatment-for-hair-fall-causes-tips-home-remedies-for-hairfall-prevention/",
  }
];

const CATEGORIES = ["All Topics", "Acne", "Stress", "Digestion", "Sleep", "Hair Fall", "Web Search"];

export function KnowledgeHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Topics");
  // Dynamic search state
  const [dynamicArticles, setDynamicArticles] = useState<typeof ARTICLES>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced Web Search Effect
  useEffect(() => {
    const fetchLiveArticles = async () => {
      if (searchQuery.trim().length < 2) {
        setDynamicArticles([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(`http://localhost:8000/api/articles/search?q=${encodeURIComponent(searchQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setDynamicArticles(data);
        } else {
          setDynamicArticles([]);
        }
      } catch (error) {
        console.error("Live search failed:", error);
        setDynamicArticles([]);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(fetchLiveArticles, 600);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const combinedArticles = [...ARTICLES, ...dynamicArticles];

  const filteredArticles = combinedArticles.filter(article => {
    // Only apply text filtering to static articles since dynamic ones are already filtered by the API
    const isDynamic = dynamicArticles.some(d => d.title === article.title);
    
    const matchesSearch = isDynamic ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Topics" || article.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 w-full">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                  <span className="text-primary font-bold tracking-wider uppercase text-sm block">Official Resources</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text tracking-tight mb-6 leading-tight">
                  AyurWell <br className="hidden sm:block" />Knowledge Hub
                </h1>
                <p className="text-base sm:text-lg text-secondary-text mb-8 max-w-xl">
                  Explore trusted Ayurvedic articles, remedies, and wellness resources curated to support your holistic wellness journey. Now with live Web Search for authentic sources!
                </p>

                {/* Search & Filter Controls inline in Hero */}
                <div className="glass p-2 rounded-2xl flex flex-col sm:flex-row gap-2 max-w-2xl shadow-lg relative z-10 bg-white/60 dark:bg-card/60 backdrop-blur-xl">
                  <div className="relative flex-1">
                    {isSearching ? (
                      <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary animate-spin" />
                    ) : (
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-text" />
                    )}
                    <input
                      type="text"
                      placeholder="Search symptoms, remedies, web articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent border-none pl-12 pr-4 py-3 text-text focus:ring-0 placeholder:text-secondary-text/70 outline-none"
                    />
                  </div>
                  <div className="h-px sm:h-auto sm:w-px bg-border my-2 sm:my-0"></div>
                  <div className="relative min-w-[140px]">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full bg-transparent border-none px-4 py-3 text-text focus:ring-0 font-medium cursor-pointer outline-none appearance-none"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c} value={c} className="text-text bg-white dark:bg-card">{c}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text pointer-events-none" />
                  </div>
                </div>

              </motion.div>
            </div>

            <div className="flex-1 relative hidden lg:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10"
              >
                <img
                  src="https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&w=800&q=80"
                  alt="Ayurvedic Herbs"
                  className="rounded-3xl shadow-2xl"
                />
              </motion.div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/20 blur-[100px] rounded-full -z-0" />
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 lg:py-20 flex-1 relative bg-secondary-bg/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-bold text-text mb-2">Wellness Articles</h2>
              <p className="text-secondary-text flex items-center gap-2">
                {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'} found
                {selectedCategory !== "All Topics" && ` in ${selectedCategory}`}
                {isSearching && <span className="text-primary text-sm">(Searching web...)</span>}
              </p>
            </div>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-20 bg-white/50 dark:bg-card/50 rounded-3xl border border-border">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-text mb-2">No articles found</h3>
              <p className="text-secondary-text max-w-md mx-auto">We couldn't find any articles matching your search or category. Try adjusting your filters.</p>
              <Button
                variant="outline"
                className="mt-6 rounded-full"
                onClick={() => { setSearchQuery(""); setSelectedCategory("All Topics"); }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article, i) => {
                // Unique key taking into account some dynamic sources might share titles
                const uniqueKey = `${article.title}-${i}`; 
                return (
                  <motion.article
                    key={uniqueKey}
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (i % 6) * 0.1 }}
                    className="glass rounded-3xl overflow-hidden group flex flex-col h-full relative border border-border/50 hover:border-primary/30 transition-colors shadow-sm hover:shadow-xl"
                  >
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-col h-full focus:outline-none focus:ring-2 focus:ring-primary rounded-3xl overflow-hidden"
                    >
                      <div className="h-56 overflow-hidden relative">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80";
                          }}
                        />
                        <div className="absolute top-4 left-4 bg-white/90 dark:bg-card/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold text-primary shadow-sm">
                          {article.category}
                        </div>
                      </div>

                      <div className="p-6 flex flex-col flex-1 bg-white/40 dark:bg-card/40">
                        <h3 className="text-xl font-bold text-text mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-secondary-text mb-5 line-clamp-3 leading-relaxed">
                          {article.description}
                        </p>

                        <div className="mt-auto">
                          <div className="text-xs text-secondary-text/80 mb-4 flex items-center gap-2">
                            <span className="text-lg">🌍</span>
                            <span className="line-clamp-1">{article.author}</span>
                          </div>
                          <div className="flex items-center justify-between border-t border-border pt-4">
                            <span className="text-sm font-semibold text-primary group-hover:underline">Read More</span>
                            <ArrowRight className="w-5 h-5 text-text group-hover:text-primary transition-colors group-hover:translate-x-1" />
                          </div>
                        </div>
                      </div>
                    </a>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
