import { useState, useEffect } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

interface CalendarSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Eventos básicos - puedes expandir esto
const events: Record<number, { name: string; time: string; description: string; icon: string }> = {
  22: { name: "Despertà", time: "08:00", description: "💥 Despertà que anuncia el inicio de las Fallas", icon: "💥" },
  28: { name: "Cabalgata del Ninot", time: "17:00", description: "🎭 Desfile de ninots por las calles", icon: "🎭" },
  1: { name: "Mascletà", time: "14:00", description: "💥 Mascletà diaria en Plaza del Ayuntamiento", icon: "💥" },
  15: { name: "Plantà Infantiles", time: "00:00", description: "🏗️ Plantà de las fallas infantiles", icon: "👶" },
  16: { name: "Plantà Grandes", time: "00:00", description: "🏗️ Plantà de las fallas grandes", icon: "🏗️" },
  17: { name: "Ofrenda de Flores", time: "15:30", description: "🌸 Ofrenda de flores a la Virgen", icon: "🌸" },
  18: { name: "Ofrenda de Flores", time: "15:30", description: "🌸 Ofrenda de flores a la Virgen (día 2)", icon: "🌸" },
  19: { name: "Cremà", time: "22:00", description: "🔥 Cremà de las fallas", icon: "🔥" },
};

export const CalendarSheet = ({ open, onOpenChange }: CalendarSheetProps) => {
  const [selectedDay, setSelectedDay] = useState(22);
  const [selectedHour, setSelectedHour] = useState(14);
  const [liveMode, setLiveMode] = useState(false);

  useEffect(() => {
    if (liveMode) {
      const now = new Date();
      const currentHour = now.getHours();
      setSelectedHour(currentHour);
      
      // Simular día actual (ajustar según la fecha real)
      const currentMonth = now.getMonth(); // 0 = Enero, 1 = Febrero, 2 = Marzo
      const currentDate = now.getDate();
      
      if (currentMonth === 1) { // Febrero
        setSelectedDay(currentDate);
      } else if (currentMonth === 2 && currentDate <= 19) { // Marzo 1-19
        setSelectedDay(28 + currentDate); // 28 Feb + días de marzo
      }
    }
  }, [liveMode]);

  const currentEvent = events[selectedDay];
  
  const getDayLabel = (day: number) => {
    if (day <= 28) return `${day} Feb`;
    return `${day - 28} Mar`;
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[65vh]">
        <DrawerHeader className="pb-2">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-primary" />
            <DrawerTitle className="text-lg">Calendario de Eventos</DrawerTitle>
          </div>
        </DrawerHeader>

        <div className="px-4 pb-4 space-y-4">
          {/* Live Mode Toggle */}
          <div className="flex items-center justify-between bg-muted/30 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Modo en vivo</span>
            </div>
            <Switch checked={liveMode} onCheckedChange={setLiveMode} />
          </div>

          {/* Day Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-muted-foreground">Día</span>
              <Badge variant="outline" className="text-xs">
                {getDayLabel(selectedDay)}
              </Badge>
            </div>
            <Slider
              value={[selectedDay]}
              onValueChange={([val]) => !liveMode && setSelectedDay(val)}
              min={22}
              max={47}
              step={1}
              disabled={liveMode}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>22 Feb</span>
              <span>19 Mar</span>
            </div>
          </div>

          {/* Hour Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-muted-foreground">Hora</span>
              <Badge variant="outline" className="text-xs">
                {selectedHour.toString().padStart(2, '0')}:00
              </Badge>
            </div>
            <Slider
              value={[selectedHour]}
              onValueChange={([val]) => !liveMode && setSelectedHour(val)}
              min={0}
              max={23}
              step={1}
              disabled={liveMode}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>0:00</span>
              <span>23:00</span>
            </div>
          </div>

          {/* Current Event */}
          {currentEvent ? (
            <div className="bg-muted/40 border border-border/30 rounded-xl p-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentEvent.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{currentEvent.name}</p>
                  <p className="text-xs text-muted-foreground">{currentEvent.time}</p>
                </div>
              </div>
              <p className="text-xs text-foreground leading-relaxed">{currentEvent.description}</p>
            </div>
          ) : (
            <div className="bg-muted/20 border border-border/20 rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground">No hay eventos programados para este día</p>
            </div>
          )}

          {/* Info */}
          <div className="text-[10px] text-muted-foreground text-center">
            <p>Del 22 de Febrero al 19 de Marzo de 2026</p>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
