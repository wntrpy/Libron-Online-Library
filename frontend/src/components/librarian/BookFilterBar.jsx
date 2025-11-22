import React from "react";
import { FaChevronDown, FaSearch } from "react-icons/fa";

const GENRES = [
  "Science Fiction",
  "Romance",
  "Horror",
  "Fantasy"
];

export default function BookFilterBar({ genre, setGenre, search, setSearch }) {
  return (
    <div className="flex gap-3 items-center w-full">
      <div className="relative">
        <select
          value={genre}
          onChange={e => setGenre(e.target.value)}
          className="appearance-none border border-gray-300 rounded-lg pl-4 pr-10 py-2 text-base bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 min-w-[140px] shadow"
        >
          <option value="">All Genres</option>
          {GENRES.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
      <div className="relative flex-1 max-w-xs">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by Title or Author"
          className="border border-gray-300 rounded-lg pl-4 pr-10 py-2 text-base w-full bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow"
        />
        <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
}
