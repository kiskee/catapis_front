import React from "react";
import type { Breed } from "../services/catsApi";
import CatsApi from "../services/catsApi";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";
import BreedCard from "../components/BreedCard";
import BreedModal from "../components/BreedModal";

export default function BreedsSearchPage() {
  const [q, setQ] = React.useState("");
  const [attachImage, setAttachImage] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [results, setResults] = React.useState<Breed[]>([]);

  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Breed | null>(null);

  const onSearch = async (term?: string) => {
    const query = (term ?? q).trim();
    if (!query) return;
    setLoading(true);
    setError(null);
    try {
      const data = await CatsApi.breeds.search({
        q: query,
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

  // submit por Enter
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  // debounce opcional al escribir (400ms)
  React.useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    const t = setTimeout(() => onSearch(q), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, attachImage]);

  return (
    <>
      <div className="space-y-4">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 items-start sm:items-center"
        >
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar raza por nombre o ID (ej. 'sib', 'abys', 'Aegean')"
            className="text-gray-800 placeholder:text-gray-500 flex-1"
          />
          <label className="flex items-center gap-2 text-gray-800">
            <Checkbox
              checked={attachImage}
              onCheckedChange={(v) => setAttachImage(Boolean(v))}
            />
            <span className="text-sm text-gray-600">Incluir imagen</span>
          </label>
          <Button
            type="submit"
            className="bg-amber-100 hover:bg-amber-200 text-gray-900"
          >
            Buscar
          </Button>
        </form>

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
                onClick={() => {
                  setSelected(b);
                  setOpen(true);
                }}
                className="cursor-pointer transition hover:scale-[1.01]"
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
    </>
  );
}
