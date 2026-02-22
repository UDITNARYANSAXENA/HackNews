import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
  hover: { y: -6, scale: 1.015, transition: { duration: 0.25 } },
  tap: { scale: 0.985 },
};

function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() / 1000) - timestamp);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return "just now";
}

export default function StoryItem({ story, index }) {
  const domain = story.url ? new URL(story.url).hostname.replace('www.', '') : 'news.ycombinator.com';

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      transition={{ duration: 0.45, delay: Math.min(index * 0.07, 0.9), ease: [0.16, 1, 0.3, 1] }}
      layout
      className="
        group bg-gray-900/70 rounded-2xl border border-gray-800/70
        hover:border-cyan-700/60 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]
        transition-all duration-300 overflow-hidden backdrop-blur-sm
      "
    >
      <div className="p-5 md:p-6">
        <div className="flex justify-between items-start gap-5">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-gray-100 group-hover:text-cyan-400 transition-colors line-clamp-2 leading-tight">
              {story.title}
            </h3>

            <a
              href={story.url || `https://news.ycombinator.com/item?id=${story.id}`}
              target="_blank"
              rel="noreferrer"
              className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-cyan-400 transition-colors"
            >
              {domain}
              <svg className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

        </div>
      </div>

      <div className="px-6 py-3.5 bg-gray-950/40 border-t border-gray-800 flex items-center justify-between text-xs font-medium text-gray-400">
        <span>by <span className="text-gray-200 font-semibold">{story.by}</span></span>
        <span>{timeAgo(story.time)}</span>
      </div>
    </motion.div>
  );
}