import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Breed } from "../services/catsApi";
import CatsApi from "../services/catsApi";
import { Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import BreedCard from "../components/BreedCard";
import BreedModal from "../components/BreedModal";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";

export default function BreedDetailPage() {
  const { breed_id } = useParams<{ breed_id?: string }>();
  const navigate = useNavigate();

  if (!breed_id || breed_id === "by-id") {
    return <BreedFinder onPick={(b) => navigate(`/breeds/${b.id}`)} />;
  }

  return <BreedDetail id={breed_id} onBack={() => navigate(-1)} />;
}

function BreedFinder({ onPick }: { onPick: (b: Breed) => void }) {
  const [q, setQ] = React.useState("");
  const [attachImage, setAttachImage] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [results, setResults] = React.useState<Breed[]>([]);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Breed | null>(null);

  const search = async (term: string) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await CatsApi.breeds.search({
        q: term.trim(),
        attach_image: attachImage ? 1 : 0,
      });
      setResults(data);
    } catch (e: any) {
      setError(
        e?.response?.data?.message || e?.message || "Error buscando razas"
      );
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const t = setTimeout(() => search(q), 400);
    return () => clearTimeout(t);
  }, [q, attachImage]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-gray-800">
        Buscar raza por ID o nombre
      </h1>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ej: abys, sib, Aegean..."
          className="text-gray-800 placeholder:text-gray-500 flex-1"
        />
        <label className="flex items-center gap-2 text-gray-800">
          <Checkbox
            checked={attachImage}
            onCheckedChange={(v) => setAttachImage(Boolean(v))}
          />
          <span className="text-sm text-gray-600">Incluir imagen</span>
        </label>
      </div>

      {loading && (
        <p className="inline-flex items-center gap-2 text-gray-600">
          <Loader2 className="h-4 w-4 animate-spin" /> Buscando...
        </p>
      )}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {results.map((b) => (
            <div
              key={b.id}
              className="cursor-pointer transition hover:scale-[1.01]"
              onClick={() => onPick(b)}
              onMouseEnter={() => setSelected(b)}
              onFocus={() => setSelected(b)}
            >
              <BreedCard breed={b} />
            </div>
          ))}
        </div>
      )}

      {!loading && !error && q.trim() && results.length === 0 && (
        <p className="text-gray-600">Sin resultados para "{q}".</p>
      )}

      <BreedModal breed={selected} open={open} onOpenChange={setOpen} />
    </div>
  );
}

function BreedDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const [breed, setBreed] = React.useState<Breed | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await CatsApi.breeds.byId(id);
        setBreed(data);
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          `Raza con id "${id}" no encontrada`;
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-600">
        <Loader2 className="h-4 w-4 animate-spin" /> Cargando...
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <p className="text-red-600">{error}</p>
        <Button
          onClick={onBack}
          className="bg-amber-100 hover:bg-amber-200 text-gray-900"
        >
          Volver
        </Button>
      </div>
    );
  }

  if (!breed) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button onClick={onBack} variant="ghost" className="text-gray-800">
          ← Volver
        </Button>
        <h1 className="text-xl font-semibold text-gray-800">{breed.name}</h1>
      </div>

      <div onClick={() => setOpen(true)} className="cursor-pointer max-w-3xl">
        <BreedCard breed={breed} />
      </div>

      <Button
        onClick={() => setOpen(true)}
        className="bg-amber-100 hover:bg-amber-200 text-gray-900"
      >
        Ver detalles
      </Button>

      <BreedModal breed={breed} open={open} onOpenChange={setOpen} />
    </div>
  );
}
