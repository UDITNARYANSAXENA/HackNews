export default function Pagination({ current, total, onChange }) {
  if (total <= 1) return null;

  const getPageNumbers = () => {
    const delta = 3;
    const range = [];
    const rangeWithDots = [];
    let l;

    range.push(1);

    for (let i = current - delta; i <= current + delta; i++) {
      if (i < total && i > 1) range.push(i);
    }

    if (current + delta < total - 1) range.push(total - 1);
    if (current + delta < total) range.push(total);

    range.forEach((page) => {
      if (l) {
        if (page - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (page - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(page);
      l = page;
    });

    return rangeWithDots;
  };

  const pages = getPageNumbers();

  return (
    <nav className="flex justify-center items-center gap-3 mt-12 mb-10 select-none">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className={`
          px-6 py-3 rounded-full font-medium text-sm transition-all duration-300
          ${current === 1
            ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
            : 'bg-gray-900 border border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-cyan-700/50 hover:shadow-md active:scale-95'}
        `}
      >
        ← Prev
      </button>

      {pages.map((page, idx) => (
        <button
          key={idx}
          onClick={() => typeof page === 'number' && onChange(page)}
          disabled={page === '...'}
          className={`
            min-w-[44px] py-3 rounded-full text-sm font-medium transition-all duration-300
            ${page === current
              ? 'bg-cyan-600 text-white shadow-md scale-110 border-cyan-500'
              : page === '...'
              ? 'text-gray-600 cursor-default'
              : 'bg-gray-900 border border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-cyan-700/50 hover:shadow active:scale-95'}
          `}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className={`
          px-6 py-3 rounded-full font-medium text-sm transition-all duration-300
          ${current === total
            ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
            : 'bg-gray-900 border border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-cyan-700/50 hover:shadow-md active:scale-95'}
        `}
      >
        Next →
      </button>
    </nav>
  );
}