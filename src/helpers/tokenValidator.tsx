interface TokenPayload {
  exp?: number;
  [key: string]: unknown;
}

export const isTokenValid = (token: string | null): boolean => {
  if (!token) {
    return false;
  }

  try {
    const [, payload] = token.split(".");
    if (!payload) {
      return false;
    }

    const decodedPayload: TokenPayload = JSON.parse(atob(payload));

    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedPayload.exp && decodedPayload.exp < currentTime) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error al validar el token:", error);
    return false;
  }
};
