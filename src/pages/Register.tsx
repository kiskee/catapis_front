import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserDetailContext } from "../context/UserDetailContext";
import type { AxiosError } from "axios";
import CatsApi from "../services/catsApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Cat, Loader2 } from "lucide-react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function Register() {
  const navigate = useNavigate();
  const ctx = useContext(UserDetailContext);
  if (!ctx)
    throw new Error(
      "UserDetailContext no está disponible. Envuelve la app con <UserDetailProvider>."
    );
  const { setUserDetail } = ctx;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const minLen = 8;
  const canSubmit =
    email.trim() !== "" &&
    password.length >= minLen &&
    confirm === password &&
    !loading;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);

    try {
      const { accessToken, user } = await CatsApi.auth.register({
        email,
        password,
      });

      setUserDetail({ token: accessToken, ...user });
      navigate("/home", { replace: true });
    } catch (err) {
      const ax = err as AxiosError<any>;
      const msg =
        ax.response?.data?.message || ax.message || "No se pudo registrar";
      setError(typeof msg === "string" ? msg : "No se pudo registrar");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="min-h-screen w-full bg-stone-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm border-0 shadow-xl rounded-2xl">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center rounded-full bg-yellow-600/10 p-2">
                <Cat className="h-5 w-5 text-yellow-600" />
              </span>
              <CardTitle className="text-xl text-gray-800">
                Crear cuenta
              </CardTitle>
            </div>
            <CardDescription className="text-gray-600">
              Regístrate para comenzar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-800">
                  Correo
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tucorreo@dominio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-gray-800 placeholder:text-gray-400"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-800">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-gray-800 placeholder:text-gray-400"
                  autoComplete="new-password"
                  required
                  minLength={minLen}
                />
                <p className="text-xs text-gray-500">
                  Mínimo {minLen} caracteres.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm" className="text-gray-800">
                  Confirmar contraseña
                </Label>
                <Input
                  id="confirm"
                  type="password"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="text-gray-800 placeholder:text-gray-400"
                  autoComplete="new-password"
                  required
                />
                {confirm && confirm !== password && (
                  <p className="text-xs text-red-600">
                    Las contraseñas no coinciden.
                  </p>
                )}
              </div>

              {error && (
                <div className="text-sm text-red-600" role="alert">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={!canSubmit}
                className="w-full bg-amber-100 hover:bg-amber-200 text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creando cuenta...
                  </span>
                ) : (
                  "Registrarme"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-1">
            <p className="text-xs text-gray-600">
              ¿Ya tienes cuenta?
              <a
                href="/"
                className="ml-1 underline text-gray-800 hover:text-gray-900"
              >
                Inicia sesión
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
