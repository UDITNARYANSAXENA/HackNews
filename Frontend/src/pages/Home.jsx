import { useStories } from '../hooks/useStories';
import StoryItem from '../components/StoryItem';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import Filter from '../components/Filter';
import { AnimatePresence, motion } from 'framer-motion';

const listVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } }
};

export default function Home() {
  const {
    stories,
    loading,
    error,
    page,
    totalPages,
    searchTerm,
    sort,
    setSearchTerm,
    setPage,
    setSort,
    refetch,
  } = useStories();

  const hasFilters = searchTerm.trim() || sort !== 'newest';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-950 to-indigo-950/30 text-gray-100 antialiased">
      <header className="border-b border-cyan-900/40 bg-gradient-to-r from-gray-950 via-indigo-950/80 to-gray-950 py-12 shadow-lg">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Hacker News • Newest
          </h1>
          <p className="mt-3 text-lg text-cyan-300/70">Real-time latest stories straight from HN</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-10 md:py-14">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 md:gap-8 mb-10 md:mb-12">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <div className="flex items-center gap-4">
            <Filter value={sort} onChange={setSort} disabled={loading} />
            {hasFilters && (
              <button
                onClick={() => { setSearchTerm(''); setSort('newest'); setPage(1); }}
                className="text-sm text-cyan-400 hover:text-cyan-300 underline underline-offset-4 transition"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <p className="text-red-300 text-lg mb-6">{error}</p>
              <button onClick={refetch} className="px-8 py-4 bg-red-700 hover:bg-red-600 rounded-xl">Retry</button>
            </motion.div>
          ) : (
            <motion.section key="content" variants={listVariants} initial="hidden" animate="visible" className="space-y-7 md:space-y-8">
              {stories.length === 0 ? (
                <div className="text-center py-32">
                  <div className="text-8xl mb-6 opacity-40">¯\_(ツ)_/¯</div>
                  <h3 className="text-3xl font-bold mb-4">
                    {searchTerm ? `No matches for "${searchTerm}"` : 'No stories right now'}
                  </h3>
                  <p className="text-gray-400">Try different keywords or clear filters</p>
                </div>
              ) : (
                <>
                  <div className="pl-1 text-sm text-gray-400 mb-4">
                    Showing {stories.length} stories • Page {page} of {totalPages}
                  </div>
                  {stories.map((story, i) => (
                    <StoryItem key={story.id} story={story} index={i} />
                  ))}
                  <Pagination current={page} total={totalPages} onChange={setPage} />
                </>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-16 py-10 border-t border-gray-800/70 text-center text-gray-500 text-sm">
        Made with ❤️ by <a href="https://portfolio-ljss.vercel.app/" target="_blank" className="text-cyan-400">Udit</a> • Vite + React + Tailwind • HN API
      </footer>
    </div>
  );
}