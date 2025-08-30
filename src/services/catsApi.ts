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

  // textos
  origin?: string;
  description?: string;
  temperament?: string;
  life_span?: string;
  alt_names?: string;

  // links
  wikipedia_url?: string;
  cfa_url?: string;
  vetstreet_url?: string;
  vcahospitals_url?: string;

  // imagen / peso
  reference_image_id?: string;
  image?: { id?: string; url?: string; width?: number; height?: number };
  weight?: { imperial?: string; metric?: string };

  // flags / escala 0–1
  indoor?: number;
  lap?: number;
  experimental?: number;
  hairless?: number;
  natural?: number;
  rare?: number;
  rex?: number;
  suppressed_tail?: number;
  short_legs?: number;
  hypoallergenic?: number;

  // atributos 1–5
  adaptability?: number;
  affection_level?: number;
  child_friendly?: number;
  dog_friendly?: number;
  energy_level?: number;
  grooming?: number;
  health_issues?: number;
  intelligence?: number;
  shedding_level?: number;
  social_needs?: number;
  stranger_friendly?: number;
  vocalisation?: number;

  // misc
  country_codes?: string;
  country_code?: string;

  [k: string]: unknown; // por si aparece algún campo extra
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
