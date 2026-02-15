// src/components/Filters/FallasFilters.tsx
import { useAppStore } from '@/stores/useAppStore';
import './FallasFilters.css';

export const FallasFilters = () => {
  const fallaTypeFilter = useAppStore(state => state.fallaTypeFilter);
  const setFallaTypeFilter = useAppStore(state => state.setFallaTypeFilter);
  const categoryFilter = useAppStore(state => state.categoryFilter);
  const setCategoryFilter = useAppStore(state => state.setCategoryFilter);
  const isFiltersOpen = useAppStore(state => state.isFiltersOpen);
  const setIsFiltersOpen = useAppStore(state => state.setIsFiltersOpen);

  const handleTypeChange = (type: 'all' | 'grande' | 'infantil') => {
    setFallaTypeFilter(type);
  };

  const handleCategoryChange = (category: string) => {
    setCategoryFilter(category === 'all' ? null : category as any);
  };

  return (
    <div className={`filters-panel ${isFiltersOpen ? '' : 'collapsed'}`}>
      <div className="filters-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="filters-title">FILTROS</h3>
          <button 
            className="filters-toggle-btn" 
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            {isFiltersOpen ? '➖' : '🔍'}
          </button>
        </div>
      </div>

      {isFiltersOpen && (
        <div className="filters-content">
          {/* Filtros de Tipo Principal */}
          <div className="filter-group">
            <label className="filter-label">Tipo de Falla</label>
            <div className="filter-options">
              <button 
                className={`filter-btn ${fallaTypeFilter === 'all' ? 'active' : ''}`}
                onClick={() => handleTypeChange('all')}
              >
                Todas ({702})
              </button>
              <button 
                className={`filter-btn ${fallaTypeFilter === 'grande' ? 'active' : ''}`}
                onClick={() => handleTypeChange('grande')}
              >
                🎨 Fallas Grandes (351)
              </button>
              <button 
                className={`filter-btn ${fallaTypeFilter === 'infantil' ? 'active' : ''}`}
                onClick={() => handleTypeChange('infantil')}
              >
                👶 Fallas Infantiles (351)
              </button>
            </div>
          </div>

          {/* Categorías de Iluminación */}
          <div className="filter-group">
            <label className="filter-label">Concurso de Iluminación</label>
            <div className="filter-options filter-options-grid">
              <button 
                className={`filter-btn ${categoryFilter === 'CategoriaA' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('CategoriaA')}
              >
                💡 Categoría A - Iluminación
              </button>
              
              <button 
                className={`filter-btn ${categoryFilter === 'CategoriaB' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('CategoriaB')}
              >
                🔆 Categoría B - Iluminación
              </button>
            </div>
          </div>

          {/* Secciones Oficiales */}
          <div className="filter-group">
            <label className="filter-label">Secciones Oficiales</label>
            <div className="filter-options filter-options-grid">
              <button 
                className={`filter-btn ${categoryFilter === 'Especial' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('Especial')}
              >
                ⭐ Sección Especial
              </button>
              
              <button 
                className={`filter-btn ${categoryFilter === 'Primera' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('Primera')}
              >
                🥇 Sección 1ºA
              </button>
              
              <button 
                className={`filter-btn ${categoryFilter === 'EspecialInfantil' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('EspecialInfantil')}
              >
                👑 Sección Especial Infantil
              </button>
            </div>
          </div>

          {/* Categorías Especiales */}
          <div className="filter-group">
            <label className="filter-label">Categorías Especiales</label>
            <div className="filter-options filter-options-grid">
              <button 
                className={`filter-btn ${categoryFilter === 'Municipal' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('Municipal')}
              >
                🏛️ Fallas Municipales
              </button>
              
              <button 
                className={`filter-btn ${categoryFilter === 'Experimental' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('Experimental')}
              >
                🔬 I+E y Corona
              </button>
            </div>
          </div>

          <button 
            className="btn-reset"
            onClick={() => {
              setFallaTypeFilter('all');
              setCategoryFilter(null);
            }}
          >
            🔄 Resetear Filtros
          </button>
        </div>
      )}
    </div>
  );
};
