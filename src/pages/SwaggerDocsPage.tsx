import { ExternalLink, RefreshCcw } from "lucide-react";
import React from "react";
import { Button } from "../components/ui/button";

export default function SwaggerDocsPage() {
  const SWAGGER_URL = (import.meta.env.VITE_SWAGGER_URL as string) ?? "";
  const [src, setSrc] = React.useState<string>(SWAGGER_URL);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!SWAGGER_URL) setErr("No has configurado VITE_SWAGGER_URL");
  }, [SWAGGER_URL]);

  const reload = () => {
    if (!SWAGGER_URL) return;

    setSrc(
      `${SWAGGER_URL}${SWAGGER_URL.includes("?") ? "&" : "?"}t=${Date.now()}`
    );
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-semibold text-gray-800">API Docs</h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={reload}
              className="bg-amber-100 hover:bg-amber-200 text-gray-900"
            >
              <RefreshCcw className="h-4 w-4 mr-2" /> Recargar
            </Button>
            {SWAGGER_URL && (
              <Button
                asChild
                className="bg-amber-100 hover:bg-amber-200 text-gray-900"
              >
                <a href={SWAGGER_URL} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" /> Abrir en pestaña
                </a>
              </Button>
            )}
          </div>
        </div>

        {err && <p className="text-red-600 text-sm">{err}</p>}

        {SWAGGER_URL ? (
          <iframe
            key={src}
            src={src}
            title="Swagger UI"
            className="w-full h-[calc(100dvh-12rem)] rounded-2xl border"
            onLoad={() => setErr(null)}
          />
        ) : (
          <div className="text-gray-600">
            Define{" "}
            <code className="px-1 py-0.5 bg-stone-100 rounded">
              VITE_SWAGGER_URL
            </code>{" "}
            en tu entorno.
          </div>
        )}
      </div>
    </>
  );
}
