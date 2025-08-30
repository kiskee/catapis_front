import React from "react";
import type { Breed } from "../services/catsApi";
import CatsApi from "../services/catsApi";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";
import BreedItem from "../components/BreedItem";

const BATCH = 16;

export default function BreedsPage() {
  const [all, setAll] = React.useState<Breed[]>([]);
  const [visibleCount, setVisibleCount] = React.useState(BATCH);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [q, setQ] = React.useState("");
  const loadMoreRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await CatsApi.breeds.list();
        setAll(data);
      } catch (e: any) {
        setError(
          e?.response?.data?.message || e?.message || "Error cargando razas"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = React.useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return all;
    return all.filter(
      (b) =>
        (b.name ?? "").toLowerCase().includes(term) ||
        (b.origin ?? "").toLowerCase().includes(term) ||
        (b.temperament ?? "").toLowerCase().includes(term)
    );
  }, [q, all]);

  React.useEffect(() => {
    setVisibleCount(BATCH);
  }, [filtered.length]);

  const hasMore = visibleCount < filtered.length;

  const loadMore = React.useCallback(() => {
    if (hasMore) setVisibleCount((c) => c + BATCH);
  }, [hasMore]);

  React.useEffect(() => {
    if (!hasMore) return;
    const el = loadMoreRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "300px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, loadMore, filtered.length]);

  const slice = filtered.slice(0, visibleCount);

  return (
    <>
      <div className="space-y-4">
        {/* Controles */}
        <div className="flex gap-2">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre, origen o temperamento"
            className="text-gray-800 placeholder:text-gray-500"
          />
          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-amber-100 hover:bg-amber-200 text-gray-900"
          >
            Arriba
          </Button>
        </div>

        {loading && <p className="text-gray-600">Cargando...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {slice.map((b) => (
                <BreedItem key={b.id} breed={b} />
              ))}
            </div>

            <div
              ref={loadMoreRef}
              className="h-10 w-full flex items-center justify-center"
            >
              {hasMore && (
                <span
                  className="inline-flex items-center gap-2 text-gray-600 text-sm"
                  aria-busy="true"
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cargando más...
                </span>
              )}
            </div>

            {!hasMore && filtered.length > 0 && (
              <p className="text-center text-gray-600 text-sm">
                No hay más resultados.
              </p>
            )}

            {!loading && filtered.length === 0 && (
              <p className="text-gray-600">No se encontraron razas.</p>
            )}
          </>
        )}
      </div>
    </>
  );
}
