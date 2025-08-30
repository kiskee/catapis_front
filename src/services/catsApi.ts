// src/services/catsApi.ts
import axios, { type AxiosResponse } from "axios";

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
  temperament?: string;
  life_span?: string;
  alt_names?: string;

  wikipedia_url?: string;
  cfa_url?: string;
  vetstreet_url?: string;
  vcahospitals_url?: string;

  reference_image_id?: string;
  image?: { id?: string; url?: string; width?: number; height?: number };
  weight?: { imperial?: string; metric?: string };

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

  country_codes?: string;
  country_code?: string;

  [k: string]: unknown;
}

export interface CatImage {
  id: string;
  url: string;
  breeds?: Breed[];
  width?: number;
  height?: number;
  [k: string]: unknown;
}

const TOKEN_KEY = "authToken";

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

const apiClient = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const url = config.url ?? "";
  const isAuthRoute =
    url.startsWith("/auth/") ||
    url.includes("/auth/login") ||
    url.includes("/auth/register");

  if (!isAuthRoute) {
    const raw = localStorage.getItem("authToken");
    if (raw) {
      try {
        const { token } = JSON.parse(raw) as { token?: string };
        if (token) config.headers.set("Authorization", `Bearer ${token}`);
      } catch {}
    }
  }

  if (!config.headers.get("Content-Type")) {
    config.headers.set("Content-Type", "application/json");
  }

  return config;
});

const CatsApi = {
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

  breeds: {
    list: async () => {
      const res: AxiosResponse<Breed[]> = await apiClient.get("/breeds");
      return res.data;
    },

    search: async (params: { q: string; attach_image?: 0 | 1 }) => {
      const res: AxiosResponse<Breed[]> = await apiClient.get(
        "/breeds/search",
        { params }
      );
      return res.data;
    },

    byId: async (breed_id: string) => {
      const res: AxiosResponse<Breed> = await apiClient.get(
        `/breeds/${breed_id}`
      );
      return res.data;
    },
  },

  images: {
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
