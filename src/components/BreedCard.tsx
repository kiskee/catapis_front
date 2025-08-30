import type { Breed } from "../services/catsApi";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function BreedCard({ breed }: { breed: Breed }) {
  const img = breed.image?.url;

  return (
    <Card className="overflow-hidden border-0 shadow-sm rounded-2xl">
      <div className="h-40 w-full bg-stone-100">
        {img ? (
          <img
            src={img}
            alt={breed.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : null}
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-gray-800">{breed.name}</CardTitle>
      </CardHeader>

      <CardContent className="text-gray-600 space-y-1">
        {breed.origin && <p>Origen: {breed.origin}</p>}
        {breed.life_span && <p>Vida: {breed.life_span} años</p>}
        {breed.description && (
          <p className="line-clamp-3">{breed.description}</p>
        )}
        {breed.wikipedia_url && (
          <Button
            asChild
            className="bg-amber-100 hover:bg-amber-200 text-gray-900 mt-2"
          >
            <a href={breed.wikipedia_url} target="_blank" rel="noreferrer">
              Wiki
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
