import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Route, Trash2, Navigation, Star, GripVertical, Zap } from "lucide-react";
import type { Falla } from "@/types";

interface MyRouteSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  route: Falla[];
  onRemoveFromRoute: (fallaId: number) => void;
  onClearRoute: () => void;
  onOptimizeRoute: () => void;
}

export const MyRouteSheet = ({ 
  open, 
  onOpenChange, 
  route, 
  onRemoveFromRoute,
  onClearRoute,
  onOptimizeRoute 
}: MyRouteSheetProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const totalDistance = route.length > 1 
    ? `${(route.length * 0.8).toFixed(1)} km` 
    : "0 km";
  
  const estimatedTime = route.length > 1
    ? `${Math.round(route.length * 12)} min`
    : "0 min";

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[75vh]">
        <DrawerHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Route className="w-4 h-4 text-primary" />
              <DrawerTitle className="text-lg">Mi Ruta</DrawerTitle>
              <Badge variant="secondary" className="text-xs">
                {route.length} {route.length === 1 ? 'falla' : 'fallas'}
              </Badge>
            </div>
            {route.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearRoute}
                className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Limpiar
              </Button>
            )}
          </div>
        </DrawerHeader>

        <div className="px-4 pb-4 space-y-3">
          {/* Stats */}
          {route.length > 1 && (
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-muted/40 rounded-lg p-2.5 border border-border/30">
                <p className="text-[10px] text-muted-foreground mb-0.5">Distancia</p>
                <p className="text-sm font-semibold text-foreground">{totalDistance}</p>
              </div>
              <div className="bg-muted/40 rounded-lg p-2.5 border border-border/30">
                <p className="text-[10px] text-muted-foreground mb-0.5">Tiempo estimado</p>
                <p className="text-sm font-semibold text-foreground">{estimatedTime}</p>
              </div>
            </div>
          )}

          {/* Optimize Button */}
          {route.length > 2 && (
            <Button 
              className="w-full h-9 rounded-xl text-xs gap-1.5"
              onClick={onOptimizeRoute}
            >
              <Zap className="w-3.5 h-3.5" />
              Optimizar Ruta
            </Button>
          )}

          {/* Route List */}
          <div className="space-y-2 max-h-[40vh] overflow-y-auto">
            {route.length === 0 ? (
              <div className="bg-muted/20 border border-border/20 rounded-xl p-6 text-center">
                <Route className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">No hay fallas en tu ruta</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Haz click en "Añadir a ruta" en cualquier falla
                </p>
              </div>
            ) : (
              route.map((falla, index) => (
                <div
                  key={falla.id}
                  className="bg-card/50 border border-border/30 rounded-xl p-3 hover:bg-card/80 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    {/* Drag Handle */}
                    <div className="cursor-move text-muted-foreground hover:text-foreground">
                      <GripVertical className="w-4 h-4" />
                    </div>

                    {/* Number */}
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
                      {index + 1}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Star className="w-3 h-3 text-accent fill-accent shrink-0" />
                        <p className="text-sm font-medium text-foreground truncate">
                          {falla.name}
                        </p>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {falla.address}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1">
                      <button
                        onClick={() => console.log("Navigate to:", falla.name)}
                        className="p-1.5 hover:bg-accent/20 rounded-lg transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => onRemoveFromRoute(falla.id)}
                        className="p-1.5 hover:bg-destructive/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </button>
                    </div>
                  </div>

                  {/* Distance to next */}
                  {index < route.length - 1 && (
                    <div className="flex items-center gap-1.5 mt-2 ml-8 text-[10px] text-muted-foreground">
                      <div className="h-px flex-1 bg-border" />
                      <span>~{(Math.random() * 0.5 + 0.3).toFixed(1)} km</span>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Start Navigation Button */}
          {route.length > 0 && (
            <Button 
              className="w-full h-11 rounded-xl text-sm gap-2"
              onClick={() => console.log("Start navigation with route:", route)}
            >
              <Navigation className="w-4 h-4" />
              Iniciar Navegación
            </Button>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
