import * as React from "react";
import type { Breed } from "../services/catsApi";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";


/**
 * Modal para mostrar toda la información de una raza (Breed)
 * Paleta: textos gris, acento amarillo, botones amber.
 * Guardar como: src/components/BreedModal.tsx
 */
export default function BreedModal({
  breed,
  open,
  onOpenChange,
}: {
  breed: Breed | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!breed) return null;
  const temperament = (breed.temperament ?? "").split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
        {/* Imagen */}
        <div className="relative h-56 w-full bg-stone-100">
          {breed.image?.url ? (
            // eslint-disable-next-line jsx-a11y/alt-text
            <img src={breed.image.url} className="h-full w-full object-cover" loading="lazy" />
          ) : null}
        </div>

        <DialogHeader className="px-6 pt-4">
          <DialogTitle className="text-xl text-gray-800 flex items-center justify-between">
            <span>{breed.name}</span>
            {breed.origin && (
              <Badge variant="secondary" className="bg-amber-100 text-gray-900">{breed.origin}</Badge>
            )}
          </DialogTitle>
          {breed.description && (
            <DialogDescription className="text-gray-600">
              {breed.description}
            </DialogDescription>
          )}
        </DialogHeader>

        <Separator className="my-2" />

        <ScrollArea className="px-6 pb-4 max-h-[60vh]">
          {/* Temperamento */}
          {temperament.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-800 mb-2">Temperamento</h4>
              <div className="flex flex-wrap gap-1">
                {temperament.map((t) => (
                  <Badge key={t} variant="outline" className="text-gray-800 border-amber-100">{t}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Datos básicos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-800">
            {breed.life_span && (
              <InfoRow label="Esperanza de vida" value={`${breed.life_span} años`} />
            )}
            {breed.weight && (
              <InfoRow label="Peso" value={`${breed.weight.metric ?? "?"} kg • ${breed.weight.imperial ?? "?"} lb`} />
            )}
            {typeof breed.hypoallergenic === "number" && (
              <InfoRow label="Hipoalergénico" value={breed.hypoallergenic ? "Sí" : "No"} />
            )}
            {typeof breed.indoor === "number" && (
              <InfoRow label="Gato de interior" value={breed.indoor ? "Sí" : "No"} />
            )}
          </div>

          <Separator className="my-4" />

          {/* Atributos 1-5 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Trait label="Adaptabilidad" value={breed.adaptability} />
            <Trait label="Cariño" value={breed.affection_level} />
            <Trait label="Niños" value={breed.child_friendly} />
            <Trait label="Perros" value={breed.dog_friendly} />
            <Trait label="Energía" value={breed.energy_level} />
            <Trait label="Aseo" value={breed.grooming} />
            <Trait label="Salud" value={breed.health_issues} />
            <Trait label="Inteligencia" value={breed.intelligence} />
            <Trait label="Muda" value={breed.shedding_level} />
            <Trait label="Social" value={breed.social_needs} />
            <Trait label="Con extraños" value={breed.stranger_friendly} />
            <Trait label="Vocalización" value={breed.vocalisation} />
          </div>

          {/* Enlaces */}
          {(breed.wikipedia_url || breed.cfa_url || breed.vetstreet_url || breed.vcahospitals_url) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {breed.wikipedia_url && (
                <Button asChild size="sm" className="bg-amber-100 hover:bg-amber-200 text-gray-900">
                  <a href={breed.wikipedia_url} target="_blank" rel="noreferrer">Wikipedia</a>
                </Button>
              )}
              {breed.cfa_url && (
                <Button asChild size="sm" className="bg-amber-100 hover:bg-amber-200 text-gray-900">
                  <a href={breed.cfa_url} target="_blank" rel="noreferrer">CFA</a>
                </Button>
              )}
              {breed.vetstreet_url && (
                <Button asChild size="sm" className="bg-amber-100 hover:bg-amber-200 text-gray-900">
                  <a href={breed.vetstreet_url} target="_blank" rel="noreferrer">Vetstreet</a>
                </Button>
              )}
              {breed.vcahospitals_url && (
                <Button asChild size="sm" className="bg-amber-100 hover:bg-amber-200 text-gray-900">
                  <a href={breed.vcahospitals_url} target="_blank" rel="noreferrer">VCA Hospitals</a>
                </Button>
              )}
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="px-6 pb-4">
          <DialogClose asChild>
            <Button className="bg-amber-100 hover:bg-amber-200 text-gray-900">Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-gray-600">{label}</span>
      <span className="text-gray-800 font-medium">{value}</span>
    </div>
  );
}

function Trait({ label, value }: { label: string; value?: number }) {
  if (typeof value !== "number") return null;
  const pct = Math.max(0, Math.min(5, value)) * 20; // 0-100
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm text-gray-800">
        <span>{label}</span>
        <span className="text-gray-600">{value}/5</span>
      </div>
      <div className="h-2 w-full rounded-full bg-stone-200 overflow-hidden">
        <div className="h-full bg-yellow-600" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
