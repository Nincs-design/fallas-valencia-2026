import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Navigation, Plus, Award, User, Palette } from "lucide-react";
import type { Falla } from "@/types";

interface FallaDetailSheetProps {
  falla: Falla | null;
  onClose: () => void;
  onAddToRoute?: (falla: Falla) => void;
}

const categoryIcons: Record<string, string> = {
  Municipal: "👑",
  Especial: "🌟",
  Primera: "🥇",
  Segunda: "🥈",
  Tercera: "🥉",
  Cuarta: "🏅",
  Quinta: "🎖️",
  Sexta: "🎗️",
  Séptima: "🏷️",
};

export const FallaDetailSheet = ({ falla, onClose, onAddToRoute }: FallaDetailSheetProps) => {
  if (!falla) return null;

  const categoryIcon = categoryIcons[falla.category] || "🎭";

  return (
    <Drawer open={!!falla} onOpenChange={open => !open && onClose()}>
      <DrawerContent className="max-h-[75vh]">
        <DrawerHeader className="pb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[16px]">{categoryIcon}</span>
            <DrawerTitle className="text-lg leading-tight">{falla.name}</DrawerTitle>
          </div>
        </DrawerHeader>

        <div className="px-4 pb-4 space-y-3 overflow-y-auto">
          {/* Metadata */}
          <div className="flex gap-2 flex-wrap pt-[4px]">
            <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20">
              {falla.category}
            </Badge>
            {falla.type === 'infantil' && (
              <Badge className="text-[10px] bg-accent/10 text-accent-foreground border-accent/20">
                👶 Infantil
              </Badge>
            )}
          </div>

          {/* Details */}
          <div className="text-xs text-foreground leading-relaxed pt-[4px] space-y-1.5">
            {falla.artist && (
              <div className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span><span className="text-muted-foreground">Artista:</span> {falla.artist}</span>
              </div>
            )}
            {falla.president && (
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span><span className="text-muted-foreground">Presidente:</span> {falla.president}</span>
              </div>
            )}
            {falla.fallera && (
              <div className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span><span className="text-muted-foreground">Fallera Mayor:</span> {falla.fallera}</span>
              </div>
            )}
          </div>

          <div className="border-t border-border" />

          {/* Theme */}
          <div>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-foreground">Tema: {falla.theme}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{falla.facts}</p>
          </div>

          {/* Boceto */}
          {falla.boceto && (
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Boceto:</p>
              <div className="rounded-xl bg-muted/40 border border-border/30 overflow-hidden">
                <img src={falla.boceto} alt="Boceto" className="w-full object-cover" />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-1">
            <Button 
              className="flex-1 h-10 rounded-xl text-xs gap-1.5" 
              variant="outline"
              onClick={() => {
                console.log("Navigate to falla:", falla.name);
                // Aquí puedes añadir lógica de navegación
              }}
            >
              <Navigation className="w-3.5 h-3.5" />
              ¿Cómo llegar?
            </Button>
            {onAddToRoute && (
              <Button
                className="flex-1 h-10 rounded-xl text-xs gap-1.5"
                onClick={() => { 
                  onAddToRoute(falla); 
                  onClose();
                  console.log("Added to route:", falla.name);
                }}
              >
                <Plus className="w-3.5 h-3.5" />
                Añadir a ruta
              </Button>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
