import React from "react";
import type { Breed } from "../services/catsApi";
import CatsApi from "../services/catsApi";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import BreedCard from "../components/BreedCard";


export default function BreedsPage() {
  const [breeds, setBreeds] = React.useState<Breed[]>([]);
  const [q, setQ] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await CatsApi.breeds.list();
      setBreeds(data);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Error cargando razas");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    load();
  }, []);

  const filtered = React.useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return breeds;
    return breeds.filter((b) =>
      (b.name ?? "").toLowerCase().includes(term) ||
      (b.origin ?? "").toLowerCase().includes(term)
    );
  }, [q, breeds]);

  return (
    <div className="space-y-4">
      {/* Controles */}
      <div className="flex gap-2">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre u origen"
          className="text-gray-800 placeholder:text-gray-500"
        />
        <Button onClick={load} className="bg-amber-100 hover:bg-amber-200 text-gray-900">
          Recargar
        </Button>
      </div>

      {/* Estados */}
      {loading && <p className="text-gray-600">Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((b) => (
            <BreedCard key={b.id} breed={b} />
          ))}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="text-gray-600">No hay resultados.</p>
      )}
    </div>
  );
}
