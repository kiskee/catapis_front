import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { UserDetailContext } from "../context/UserDetailContext";
import { Cat, LogOut, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

export default function Header() {
  const navigate = useNavigate();
  const ctx = React.useContext(UserDetailContext);
  if (!ctx)
    throw new Error(
      "UserDetailContext no está disponible. Envuelve la app con <UserDetailProvider>."
    );

  const { userDetail, setUserDetail } = ctx;
  const loggedIn = Boolean(userDetail?.token);

  const handleLogout = () => {
    setUserDetail(null);
    navigate("/", { replace: true });
  };
  return (
    <>
      <header className="bg-stone-50 border-b border-amber-100/70">
        <div className="mx-auto max-w-7xl h-14 px-4 flex items-center justify-between">
          {/* Brand */}
          <Link
            to={loggedIn ? "/breeds" : "/"}
            className="flex items-center gap-2"
          >
            <span className="inline-flex items-center justify-center rounded-full bg-yellow-600/10 p-2">
              <Cat className="h-5 w-5 text-yellow-600" />
            </span>
            <span className="font-semibold tracking-tight text-gray-800">
              Cats API
            </span>
          </Link>
          {/* Links */}
          {/* Nav (desktop) */}
          <nav className="hidden md:flex items-center gap-2">
            {/* Breeds */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-amber-100 hover:bg-amber-200 text-gray-900">
                  Breeds
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-48">
                <DropdownMenuLabel className="text-gray-800">
                  Endpoints
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <NavLink to="/breeds" className="text-gray-800">
                    Lista (GET /breeds)
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink to="/breeds/search" className="text-gray-800">
                    Buscar (GET /breeds/search)
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink to="/breeds/by-id" className="text-gray-800">
                    Por ID (GET /breeds/:breed_id)
                  </NavLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Images */}
            <Button
              asChild
              className="bg-amber-100 hover:bg-amber-200 text-gray-900"
            >
              <NavLink to="/images/by-breed">
                Images (GET /imagesbybreedid)
              </NavLink>
            </Button>

            {/* Auth */}
            {!loggedIn && (
              <>
                <Button asChild variant="ghost" className="text-gray-800">
                  <NavLink to="/login">Login</NavLink>
                </Button>
                <Button asChild variant="ghost" className="text-gray-800">
                  <NavLink to="/register">Register</NavLink>
                </Button>
              </>
            )}
          </nav>
          {/* Right (user + actions) */}
          <div className="flex items-center gap-2">
            {loggedIn && (
              <span className="hidden sm:inline text-sm text-gray-600">
                {userDetail?.email ?? "Usuario"}
              </span>
            )}

            {/* Mobile menu */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-gray-800">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Abrir menú</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-56">
                  <DropdownMenuLabel className="text-gray-800">
                    Navegación
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <NavLink to="/breeds" className="text-gray-800">
                      Breeds - Lista
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <NavLink to="/breeds/search" className="text-gray-800">
                      Breeds - Buscar
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <NavLink to="/breeds/by-id" className="text-gray-800">
                      Breeds - Por ID
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <NavLink to="/images/by-breed" className="text-gray-800">
                      Images por raza
                    </NavLink>
                  </DropdownMenuItem>
                  {!loggedIn && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <NavLink to="/login" className="text-gray-800">
                          Login
                        </NavLink>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <NavLink to="/register" className="text-gray-800">
                          Register
                        </NavLink>
                      </DropdownMenuItem>
                    </>
                  )}
                  {loggedIn && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="!p-0"
                      >
                        <Button
                          onClick={handleLogout}
                          className="w-full bg-amber-100 hover:bg-amber-200 text-gray-900"
                        >
                          <LogOut className="h-4 w-4 mr-2" /> Salir
                        </Button>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Desktop logout */}
            {loggedIn && (
              <Button
                onClick={handleLogout}
                className="hidden md:inline-flex bg-amber-100 hover:bg-amber-200 text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-2" /> Salir
              </Button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
