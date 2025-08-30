import React from "react";
import { apiClient, type Breed, type CatImage } from "../services/catsApi";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";
import BreedModal from "../components/BreedModal";
import { Card } from "../components/ui/card";

export default function ImagesByBreedPage() {
  const [breedId, setBreedId] = React.useState("abys");
  const [limit, setLimit] = React.useState<number>(9);
  const [size, setSize] = React.useState<string>("med");
  const [mimeTypes, setMimeTypes] = React.useState<string>("jpg,png");
  const [order, setOrder] = React.useState<string>("RANDOM");

  const [includeBreeds, setIncludeBreeds] = React.useState<boolean>(true);
  const [hasBreeds, setHasBreeds] = React.useState<boolean>(false);

  const [page, setPage] = React.useState<number>(0);
  const [items, setItems] = React.useState<CatImage[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [loadingMore, setLoadingMore] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const [open, setOpen] = React.useState(false);
  const [selectedBreed, setSelectedBreed] = React.useState<Breed | null>(null);

  const buildParams = React.useCallback(
    (pageOverride?: number) => {
      const params: Record<string, any> = { breed_id: breedId };
      if (limit) params.limit = Math.max(1, Math.min(25, limit));
      if (size) params.size = size;
      if (mimeTypes.trim()) params.mime_types = mimeTypes.trim();
      if (order) params.order = order;
      if (typeof (pageOverride ?? page) === "number")
        params.page = pageOverride ?? page;
      if (includeBreeds) params.include_breeds = 1;
      else params.include_breeds = 0;
      if (hasBreeds) params.has_breeds = 1;
      return params;
    },
    [breedId, limit, size, mimeTypes, order, page, includeBreeds, hasBreeds]
  );

  const search = async () => {
    if (!breedId.trim()) return;
    setLoading(true);
    setError(null);
    setPage(0);
    try {
      const { data } = await apiClient.get<CatImage[]>("/imagesbybreedid", {
        params: buildParams(0),
      });
      setItems(data);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message || e?.message || "Error buscando imágenes";
      setError(msg);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    setLoadingMore(true);
    setError(null);
    try {
      const nextPage = page + 1;
      const { data } = await apiClient.get<CatImage[]>("/imagesbybreedid", {
        params: buildParams(nextPage),
      });
      setItems((prev) => [...prev, ...data]);
      setPage(nextPage);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message || e?.message || "No se pudo cargar más";
      setError(msg);
    } finally {
      setLoadingMore(false);
    }
  };

  React.useEffect(() => {
    search();
  }, []);

  const onClickImage = (img: CatImage) => {
    const b = img.breeds?.[0] as Breed | undefined;
    if (b) {
      setSelectedBreed(b);
      setOpen(true);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-sm text-gray-800">Breed ID</label>
            <Input
              value={breedId}
              onChange={(e) => setBreedId(e.target.value)}
              placeholder="abys, sib, beng..."
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-800">Limit (1-25)</label>
            <Input
              type="number"
              min={1}
              max={25}
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-800">Size</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="h-10 w-full rounded-md border bg-white px-3 text-gray-800"
            >
              <option value="">--</option>
              <option value="thumb">thumb</option>
              <option value="small">small</option>
              <option value="med">med</option>
              <option value="full">full</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-800">MIME types (coma)</label>
            <Input
              value={mimeTypes}
              onChange={(e) => setMimeTypes(e.target.value)}
              placeholder="jpg,png"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-800">Order</label>
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="h-10 w-full rounded-md border bg-white px-3 text-gray-800"
            >
              <option value="">--</option>
              <option value="RANDOM">RANDOM</option>
              <option value="ASC">ASC</option>
              <option value="DESC">DESC</option>
            </select>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <Checkbox
              checked={includeBreeds}
              onCheckedChange={(v) => setIncludeBreeds(Boolean(v))}
            />
            <span className="text-sm text-gray-800">Incluir breeds</span>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <Checkbox
              checked={hasBreeds}
              onCheckedChange={(v) => setHasBreeds(Boolean(v))}
            />
            <span className="text-sm text-gray-800">Solo con breed data</span>
          </div>
          <div className="pt-6">
            <Button
              onClick={search}
              className="bg-amber-100 hover:bg-amber-200 text-gray-900"
            >
              Buscar
            </Button>
          </div>
        </div>

        {loading && (
          <p className="inline-flex items-center gap-2 text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin" /> Cargando...
          </p>
        )}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && items.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {items.map((img) => (
              <ImageItem
                key={img.id}
                img={img}
                onClick={() => onClickImage(img)}
              />
            ))}
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="flex items-center justify-center pt-2">
            <Button
              onClick={loadMore}
              disabled={loadingMore}
              className="bg-amber-100 hover:bg-amber-200 text-gray-900"
            >
              {loadingMore ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Cargando...
                </span>
              ) : (
                "Cargar más"
              )}
            </Button>
          </div>
        )}

        <BreedModal breed={selectedBreed} open={open} onOpenChange={setOpen} />
      </div>
    </>
  );
}

function ImageItem({ img, onClick }: { img: CatImage; onClick: () => void }) {
  const firstBreed = img.breeds?.[0]?.name;
  return (
    <Card
      className="overflow-hidden border-0 shadow-sm rounded-2xl cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-36 w-full bg-stone-100">
        <img
          src={img.url}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {firstBreed && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs px-2 py-1">
            {firstBreed}
          </div>
        )}
      </div>
    </Card>
  );
}
