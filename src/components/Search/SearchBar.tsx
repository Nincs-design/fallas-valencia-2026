// src/components/Search/SearchBar.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { fallasData } from '@/data/fallas';
import { Falla } from '@/types';
import './SearchBar.css';

export const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const setSelectedFalla = useAppStore(state => state.setSelectedFalla);
  const setIsPanelOpen = useAppStore(state => state.setIsPanelOpen);
  const userLocation = useAppStore(state => state.userLocation);

  // Calculate distance from user
  const calculateDistance = (falla: Falla): number => {
    const R = 6371; // Earth radius in km
    const dLat = (falla.lat - userLocation.lat) * Math.PI / 180;
    const dLon = (falla.lng - userLocation.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(falla.lat * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Search and filter fallas
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase().trim();
    const words = query.split(' ').filter(w => w.length > 0);

    const results = fallasData
      .map(falla => {
        let score = 0;
        const searchableText = `${falla.name} ${falla.address || ''}`.toLowerCase();

        // Exact match in name (highest priority)
        if (falla.name.toLowerCase().includes(query)) {
          score += 100;
        }

        // Match all words
        const allWordsMatch = words.every(word => searchableText.includes(word));
        if (allWordsMatch) {
          score += 50;
        }

        // Match any word
        words.forEach(word => {
          if (searchableText.includes(word)) {
            score += 10;
          }
        });

        // Bonus for starts with
        if (falla.name.toLowerCase().startsWith(query)) {
          score += 30;
        }

        // Bonus for exact word match
        const nameWords = falla.name.toLowerCase().split(' ');
        if (nameWords.some(w => w === query)) {
          score += 25;
        }

        return { falla, score, distance: calculateDistance(falla) };
      })
      .filter(result => result.score > 0)
      .sort((a, b) => {
        // Sort by score first, then by distance
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return a.distance - b.distance;
      })
      .slice(0, 10); // Top 10 results

    return results;
  }, [searchQuery, userLocation]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || searchResults.length === 0) {
      if (e.key === 'Enter' && searchQuery.trim()) {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && searchResults[selectedIndex]) {
          handleSelectFalla(searchResults[selectedIndex].falla);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelectFalla = (falla: Falla) => {
    setSelectedFalla(falla);
    setIsPanelOpen(true);
    setIsOpen(false);
    setSearchQuery('');
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  const handleClear = () => {
    setSearchQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const formatDistance = (km: number): string => {
    if (km < 1) {
      return `${Math.round(km * 1000)}m`;
    }
    return `${km.toFixed(1)}km`;
  };

  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      'Especial': '👑',
      'Primera': '🥇',
      'Segunda': '🥈',
      'Tercera': '🥉',
      'Cuarta': '🏅',
      'Quinta': '🎖️',
      'Sexta': '🎗️',
      'Séptima': '🏵️',
      'Octava': '🌟',
      'Novena': '⭐',
      'Infantil Especial': '👶👑',
      'I+E y Corona': '🌸'
    };
    return icons[category] || '🎨';
  };

  return (
    <div className="search-bar-container" ref={searchRef}>
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Buscar falla por nombre o calle..."
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => searchQuery.trim() && setIsOpen(true)}
        />
        {searchQuery && (
          <button className="search-clear" onClick={handleClear}>
            ✕
          </button>
        )}
        {searchQuery && (
          <span className="search-count">
            {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {isOpen && searchQuery.trim() && (
        <div className="search-results">
          {searchResults.length === 0 ? (
            <div className="search-no-results">
              <span className="search-no-results-icon">😔</span>
              <p>No se encontraron fallas</p>
              <small>Intenta con otro término de búsqueda</small>
            </div>
          ) : (
            <>
              <div className="search-results-header">
                {searchResults.length} falla{searchResults.length !== 1 ? 's' : ''} encontrada{searchResults.length !== 1 ? 's' : ''}
              </div>
              <div className="search-results-list">
                {searchResults.map((result, index) => (
                  <button
                    key={result.falla.id}
                    className={`search-result-item ${index === selectedIndex ? 'selected' : ''}`}
                    onClick={() => handleSelectFalla(result.falla)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="search-result-icon">
                      {getCategoryIcon(result.falla.category)}
                    </div>
                    <div className="search-result-content">
                      <div className="search-result-name">
                        {result.falla.name}
                      </div>
                      <div className="search-result-meta">
                        <span className="search-result-category">
                          {result.falla.category}
                        </span>
                        {result.falla.address && (
                          <>
                            <span className="search-result-separator">•</span>
                            <span className="search-result-address">
                              {result.falla.address}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="search-result-distance">
                      📍 {formatDistance(result.distance)}
                    </div>
                  </button>
                ))}
              </div>
              <div className="search-results-footer">
                <small>
                  💡 Usa ↑↓ para navegar, Enter para seleccionar, Esc para cerrar
                </small>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
