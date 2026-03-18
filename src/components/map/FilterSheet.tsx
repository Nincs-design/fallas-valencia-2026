import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { SlidersHorizontal, X } from "lucide-react";

interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: FilterState) => void;
}

export interface FilterState {
  categories: string[];
  showInfantil: boolean;
  showGrande: boolean;
  showOnlyVisited: boolean;
  showOnlyFavorites: boolean;
}

const CATEGORIES = [
  { id: "Municipal", label: "Municipal", icon: "👑" },
  { id: "Especial", label: "Especial", icon: "🌟" },
  { id: "Primera", label: "Primera", icon: "🥇" },
  { id: "Segunda", label: "Segunda", icon: "🥈" },
  { id: "Tercera", label: "Tercera", icon: "🥉" },
  { id: "Cuarta", label: "Cuarta", icon: "🏅" },
  { id: "Quinta", label: "Quinta", icon: "🎖️" },
];

export const FilterSheet = ({ open, onOpenChange, onApplyFilters }: FilterSheetProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showInfantil, setShowInfantil] = useState(true);
  const [showGrande, setShowGrande] = useState(true);
  const [showOnlyVisited, setShowOnlyVisited] = useState(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleApply = () => {
    onApplyFilters({
      categories: selectedCategories,
      showInfantil,
      showGrande,
      showOnlyVisited,
      showOnlyFavorites,
    });
    onOpenChange(false);
  };

  const handleClear = () => {
    setSelectedCategories([]);
    setShowInfantil(true);
    setShowGrande(true);
    setShowOnlyVisited(false);
    setShowOnlyFavorites(false);
    onApplyFilters({
      categories: [],
      showInfantil: true,
      showGrande: true,
      showOnlyVisited: false,
      showOnlyFavorites: false,
    });
  };

  const hasActiveFilters = 
    selectedCategories.length > 0 || 
    !showInfantil || 
    !showGrande || 
    showOnlyVisited || 
    showOnlyFavorites;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[75vh]">
        <DrawerHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              <DrawerTitle className="text-lg">Filtros</DrawerTitle>
              {hasActiveFilters && (
                <Badge variant="secondary" className="text-xs">
                  Activos
                </Badge>
              )}
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-8 text-xs"
              >
                <X className="w-3.5 h-3.5 mr-1" />
                Limpiar
              </Button>
            )}
          </div>
        </DrawerHeader>

        <div className="px-4 pb-4 space-y-4 overflow-y-auto">
          {/* Tipo de Falla */}
          <div>
            <p className="text-xs font-semibold text-foreground mb-2">Tipo de Falla</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-muted/30 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">🏛️</span>
                  <span className="text-sm font-medium">Fallas Grandes</span>
                </div>
                <Switch checked={showGrande} onCheckedChange={setShowGrande} />
              </div>
              <div className="flex items-center justify-between bg-muted/30 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">👶</span>
                  <span className="text-sm font-medium">Fallas Infantiles</span>
                </div>
                <Switch checked={showInfantil} onCheckedChange={setShowInfantil} />
              </div>
            </div>
          </div>

          {/* Categorías */}
          <div>
            <p className="text-xs font-semibold text-foreground mb-2">Categorías</p>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(category => {
                const isSelected = selectedCategories.includes(category.id);
                return (
                  <button
                    key={category.id}
                    onClick={() => toggleCategory(category.id)}
                    className={`
                      flex items-center gap-2 p-2.5 rounded-lg border transition-all
                      ${isSelected 
                        ? 'bg-primary/10 border-primary text-primary font-medium' 
                        : 'bg-muted/20 border-border/30 text-foreground hover:bg-muted/40'
                      }
                    `}
                  >
                    <span className="text-base">{category.icon}</span>
                    <span className="text-xs">{category.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Estado */}
          <div>
            <p className="text-xs font-semibold text-foreground mb-2">Estado</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-muted/30 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">✅</span>
                  <span className="text-sm font-medium">Solo Visitadas</span>
                </div>
                <Switch checked={showOnlyVisited} onCheckedChange={setShowOnlyVisited} />
              </div>
              <div className="flex items-center justify-between bg-muted/30 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">⭐</span>
                  <span className="text-sm font-medium">Solo Favoritas</span>
                </div>
                <Switch checked={showOnlyFavorites} onCheckedChange={setShowOnlyFavorites} />
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <Button 
            className="w-full h-11 rounded-xl text-sm"
            onClick={handleApply}
          >
            Aplicar Filtros
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
