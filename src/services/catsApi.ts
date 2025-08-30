// src/services/catsApi.ts
import axios, {
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";

/** --------- Tipos (ajústalos a tu API real) --------- */
export interface User {
  id: string;
  email: string;
  isActive: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface Breed {
  id: string;
  name: string;
  origin?: string;
  description?: string;
  life_span?: string;
  wikipedia_url?: string;
  temperament?: string;
  image?: { id?: string; url?: string; width?: number; height?: number };
}

export interface CatImage {
  id: string;
  url: string;
  breeds?: Breed[];
  width?: number;
  height?: number;
  [k: string]: unknown;
}

/** --------- Storage helper para el token --------- */
const TOKEN_KEY = "authToken"; // guardaremos { token: string }

export const AuthStorage = {
  set(token: string) {
    localStorage.setItem(TOKEN_KEY, JSON.stringify({ token }));
  },
  get(): string | null {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as { token?: string };
      return parsed.token ?? null;
    } catch {
      return null;
    }
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
  },
};

/** --------- Axios instance con base URL e interceptor --------- */


const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// agrega Authorization: Bearer <token> si existe
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = AuthStorage.get();
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/** --------- Servicio --------- */
const CatsApi = {
  // ---------- AUTH (público) ----------
  auth: {
    register: async (data: { email: string; password: string }) => {
      const res: AxiosResponse<AuthResponse> = await apiClient.post(
        "/auth/register",
        data
      );
      return res.data;
    },
    login: async (data: { email: string; password: string }) => {
      const res: AxiosResponse<AuthResponse> = await apiClient.post(
        "/auth/login",
        data
      );
      return res.data;
    },
  },

  // ---------- BREEDS (protegido por JWT) ----------
  breeds: {
    list: async () => {
      const res: AxiosResponse<Breed[]> = await apiClient.get("/breeds");
      return res.data;
    },
    /** GET /breeds/search?q=sib&attach_image=1 */
    search: async (params: { q: string; attach_image?: 0 | 1 }) => {
      const res: AxiosResponse<Breed[]> = await apiClient.get(
        "/breeds/search",
        { params }
      );
      return res.data;
    },
    /** GET /breeds/:breed_id */
    byId: async (breed_id: string) => {
      const res: AxiosResponse<Breed> = await apiClient.get(
        `/breeds/${breed_id}`
      );
      return res.data;
    },
  },

  // ---------- IMAGES (protegido por JWT) ----------
  images: {
    /** GET /imagesbybreedid?breed_id=abys&limit=5&size=med&order=RANDOM&include_breeds=1 */
    byBreed: async (params: {
      breed_id: string;
      limit?: number;
      size?: "small" | "med" | "full";
      order?: "RANDOM" | "ASC" | "DESC";
      include_breeds?: 0 | 1;
    }) => {
      const res: AxiosResponse<CatImage[]> = await apiClient.get(
        "/imagesbybreedid",
        { params }
      );
      return res.data;
    },
  },
};

export default CatsApi;
export { apiClient };
