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
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%' }}>
      <div style={{ position: 'relative' }}>
        <select
          value={genre}
          onChange={e => setGenre(e.target.value)}
          style={{
            appearance: 'none',
            border: '2px solid #dcdcdc',
            borderRadius: '14px',
            padding: '10px 40px 10px 14px',
            fontSize: '14px',
            background: '#ffffff',
            outline: 'none',
            cursor: 'pointer',
            minWidth: '160px',
            fontWeight: '500',
            color: '#374151'
          }}
        >
          <option value="">All Genres</option>
          {GENRES.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <FaChevronDown style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none', fontSize: '12px' }} />
      </div>
      <div style={{ position: 'relative', flex: 1 }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by Title or Author"
          style={{
            border: '2px solid #dcdcdc',
            borderRadius: '14px',
            padding: '10px 40px 10px 14px',
            fontSize: '14px',
            width: '100%',
            background: '#ffffff',
            outline: 'none'
          }}
        />
        <FaSearch style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '14px' }} />
      </div>
    </div>
  );
}
