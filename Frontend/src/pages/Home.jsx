// src/pages/Home.jsx
import { useStories } from '../hooks/useStories';
import StoryItem from '../components/StoryItem';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import { AnimatePresence, motion } from 'framer-motion';

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

export default function Home() {
  const {
    stories,
    loading,
    error,
    page,
    totalPages,
    searchTerm,
    setSearchTerm,
    setPage,
    refetch,
  } = useStories();

  const handleSearch = (term) => setSearchTerm(term);
  const handlePageChange = (newPage) => setPage(newPage);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 antialiased">
      <header className="bg-gradient-to-r from-gray-950 via-indigo-950 to-gray-900 shadow-lg border-b border-cyan-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-cyan-400">
            Hacker News Newest
          </h1>
          <p className="mt-3 text-lg text-cyan-300/80">
            Latest stories • real-time from Hacker News
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SearchBar
          value={searchTerm}
          onChange={handleSearch}
        />

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingSpinner />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-950/40 border-l-4 border-red-500/70 p-6 rounded-xl shadow-sm text-center"
            >
              <p className="text-red-300 font-medium mb-4">{error}</p>
              <button
                onClick={refetch}
                className="px-6 py-3 bg-cyan-600 text-white rounded-2xl font-medium hover:bg-cyan-700 transition"
              >
                Try Again
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="space-y-7"
            >
              {stories.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-32"
                >
                  <div className="text-8xl mb-6 opacity-40">¯\_(ツ)_/¯</div>
                  <h3 className="text-2xl font-semibold text-gray-200 mb-3">
                    {searchTerm ? `No results for "${searchTerm}"` : 'No new stories yet'}
                  </h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    {searchTerm ? 'Try different keywords or clear search' : 'Fresh stories incoming...'}
                  </p>
                </motion.div>
              ) : (
                <>
                  {stories.map((story, i) => (
                    <StoryItem key={story.id} story={story} index={i} />
                  ))}

                  <Pagination
                    current={page}
                    total={totalPages}
                    onChange={handlePageChange}
                  />
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-16 py-10 bg-gray-900/80 border-t border-gray-800 text-center text-gray-500 text-sm">
        <div className="max-w-6xl mx-auto px-4">
          Made with ❤️ • Vite + React + Tailwind • Hacker News API
        </div>
      </footer>
    </div>
  );
}