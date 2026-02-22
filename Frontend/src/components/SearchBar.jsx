import { useState } from 'react';

export default function SearchBar({ value, onChange }) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={`relative max-w-3xl mx-auto mb-12 transition-all duration-300 ${
        focused ? 'scale-[1.015] shadow-2xl shadow-cyan-900/30' : 'shadow-xl shadow-black/30'
      }`}
    >
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <svg
            className={`h-5 w-5 ${focused ? 'text-cyan-400' : 'text-gray-500'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search stories (React, AI, YC, startups...)"
          className={`
            w-full pl-12 pr-16 py-4.5 bg-gray-900 border border-gray-700 rounded-3xl
            focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 text-gray-100
            placeholder-gray-500 outline-none transition-all duration-300
          `}
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-300"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}