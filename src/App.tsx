import { useState, useEffect, useMemo } from 'react';
import { ExternalLink, ZoomIn, X, ChevronUp, Search, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { products, categories, Category, Product } from './data';

function getYouTubeVideoInfo(url: string | undefined): { id: string; start?: string } | null {
  if (!url) return null;
  
  // Extract video ID
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  const id = (match && match[2].length === 11) ? match[2] : null;
  
  if (!id) return null;

  // Extract start time
  let start: string | undefined;
  try {
    const urlObj = new URL(url);
    const tParam = urlObj.searchParams.get('t') || urlObj.searchParams.get('start');
    if (tParam) {
      // Handle '578s' or '578'
      start = tParam.replace('s', '');
    }
  } catch (e) {
    // Invalid URL, ignore
  }

  return { id, start };
}

export default function App() {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<{ id: string; start?: string } | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.summary.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Filter out empty categories
  const activeCategories = useMemo(() => {
    return categories.filter((cat) =>
      filteredProducts.some((p) => p.category === cat)
    );
  }, [filteredProducts]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-emerald-200">
      {/* Header */}
      <header className="bg-stone-900 text-stone-50 py-16 px-6 md:px-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 uppercase" style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}>
            Zardoz équipement
          </h1>
          <p className="text-lg md:text-xl text-stone-300 max-w-3xl mx-auto leading-relaxed font-medium mb-10">
            Équipements civils pour l’autonomie et la résilience des foyers face aux crises du quotidien (pannes, intempéries, ruptures logistiques). 
            <span className="block mt-2 text-emerald-400 font-semibold">100 % légaux – non militaires.</span>
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-stone-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un équipement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-800 border border-stone-700 text-stone-100 rounded-full py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-stone-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-400 hover:text-stone-200"
                aria-label="Effacer la recherche"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        {activeCategories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-stone-500">Aucun équipement ne correspond à votre recherche.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-4 text-emerald-600 font-semibold hover:underline"
            >
              Effacer la recherche
            </button>
          </div>
        ) : (
          activeCategories.map((category) => {
            const categoryProducts = filteredProducts.filter((p) => p.category === category);
            
            return (
              <section key={category} id={`category-${category.toLowerCase()}`} className="mb-20 scroll-mt-8">
                <div className="flex items-center gap-4 mb-10">
                  <h2 className="text-3xl font-bold uppercase tracking-wide text-stone-800">{category}</h2>
                  <div className="h-px bg-stone-300 flex-1"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categoryProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onZoom={() => setZoomedImage(product.imageUrl)} 
                      onPlayVideo={(videoInfo) => setActiveVideo(videoInfo)}
                    />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 px-6 border-t border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8">
            {activeCategories.map((category) => (
              <a 
                key={category} 
                href={`#category-${category.toLowerCase()}`}
                className="hover:text-stone-50 transition-colors uppercase text-sm font-semibold tracking-wider"
              >
                {category}
              </a>
            ))}
          </div>

          {/* Amazon Partner Info */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right gap-3">
            <p className="text-sm max-w-xs">
              Tous nos produits sont disponibles sur Amazon.fr avec livraison rapide et garantie.
            </p>
            <div className="flex items-center gap-2 bg-stone-800 px-4 py-2 rounded-full border border-stone-700">
              <span className="text-xs font-bold text-stone-300 uppercase tracking-wider">Partenaire</span>
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" 
                alt="Amazon.fr" 
                className="h-5 brightness-0 invert opacity-90"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-emerald-600 text-white p-3 rounded-full shadow-lg hover:bg-emerald-500 transition-colors z-40"
            aria-label="Retour en haut"
          >
            <ChevronUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/90 backdrop-blur-sm p-4"
            onClick={() => setZoomedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-stone-400 hover:text-white transition-colors"
              onClick={() => setZoomedImage(null)}
              aria-label="Fermer"
            >
              <X size={32} />
            </button>
            <motion.img 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={zoomedImage} 
              alt="Zoomed product" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/90 backdrop-blur-sm p-4"
            onClick={() => setActiveVideo(null)}
          >
            <button 
              className="absolute top-6 right-6 text-stone-400 hover:text-white transition-colors"
              onClick={() => setActiveVideo(null)}
              aria-label="Fermer la vidéo"
            >
              <X size={32} />
            </button>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=0&modestbranding=1&rel=0${activeVideo.start ? `&start=${activeVideo.start}` : ''}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductCard({ product, onZoom, onPlayVideo }: { key?: string, product: Product, onZoom: () => void, onPlayVideo: (videoInfo: { id: string; start?: string }) => void }) {
  const videoInfo = getYouTubeVideoInfo(product.videoUrl);

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200 flex flex-col group hover:shadow-md transition-shadow"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 cursor-zoom-in" onClick={onZoom}>
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 bg-white/90 text-stone-900 p-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
            <ZoomIn size={24} />
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-stone-900 mb-3 leading-tight">
          {product.title}
        </h3>
        <p className="text-stone-600 mb-6 flex-1 text-sm leading-relaxed">
          {product.summary}
        </p>
        
        <div className="flex flex-col gap-3 mt-auto">
          {/* Video Button */}
          {videoInfo && (
            <button
              onClick={() => onPlayVideo(videoInfo)}
              className="inline-flex items-center justify-center gap-2 w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold py-2.5 px-4 rounded-xl transition-colors border border-stone-200"
              aria-label="Voir la vidéo explicative"
            >
              <Play size={18} className="text-red-600" />
              <span>Voir la vidéo</span>
            </button>
          )}

          {/* Amazon Action Button */}
          <a 
            href={product.amazonLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full bg-amber-400 hover:bg-amber-500 text-stone-900 font-bold py-3 px-4 rounded-xl transition-colors shadow-sm"
          >
            <span>Voir sur Amazon</span>
            <ExternalLink size={18} />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
