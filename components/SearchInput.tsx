'use client';

import { useState } from 'react';

interface SearchInputProps {
  onSearchChange: (query: string) => void;
}

export default function SearchInput({ onSearchChange }: SearchInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearchChange(value);
  };

  const handleBlur = () => {
    // Delay closing to allow clicking on results
    setTimeout(() => {
      setIsOpen(false);
      setSearchQuery('');
      onSearchChange('');
    }, 200);
  };

  return (
    <div className="relative hidden md:block">
      {isOpen ? (
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder="Tìm kiếm sản phẩm..."
          className="w-64 px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
          autoFocus
        />
      ) : (
        <button 
          className="text-gray-700 hover:text-gray-900"
          onClick={() => setIsOpen(true)}
          aria-label="Search"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      )}
    </div>
  );
}
