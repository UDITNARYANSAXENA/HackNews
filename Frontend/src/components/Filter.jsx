// src/components/Filter.jsx
import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function Filter({ value = 'newest', onChange, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = [
    { value: 'newest', label: 'Newest first' },
    { value: 'oldest', label: 'Oldest first' },
  ];

  const selectedLabel = options.find(opt => opt.value === value)?.label || 'Newest first';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left w-52 sm:w-56" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        className={`
          group relative w-full flex items-center justify-between 
          px-5 py-3.5 text-sm font-medium rounded-2xl transition-all duration-300
          border border-gray-700/70 bg-gray-900/80 hover:bg-gray-800/90
          ${disabled 
            ? 'cursor-not-allowed opacity-60' 
            : 'hover:border-cyan-600/50 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 active:scale-[0.98]'}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDownIcon 
          className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} group-hover:text-cyan-400`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-30 mt-2 w-56 rounded-2xl bg-gray-900 border border-gray-700 shadow-2xl overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`
                w-full px-5 py-3.5 text-left text-sm font-medium transition-colors
                ${value === option.value 
                  ? 'bg-cyan-950/60 text-cyan-300' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-cyan-200'}
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}