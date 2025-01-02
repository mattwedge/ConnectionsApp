const apiUrl = import.meta.env.VITE_V2_API_URL;

type VerifyResponse = {
  detail?: string;
  code?: string;
};

type RefreshResponse = {
  access: string;
  refresh: string;
};

type BlacklistResponse = { success: boolean };

const verifyTokenAsync = async (token: string): Promise<VerifyResponse> => {
  const verifyResponse: VerifyResponse = await fetch(
    `${apiUrl}/auth/jwt/verify/`,
    {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token })
    }
  )
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw Error("Failed to verify token");
    })
    .catch(() => {
      return {
        detail: "Failed to verify token",
        code: "failed_to_verify_token"
      };
    });

  return verifyResponse;
};

const refreshTokenAsync = async (refreshToken: string) => {
  const refreshResponse: RefreshResponse = await fetch(
    `${apiUrl}/auth/jwt/refresh/`,
    {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ refresh: refreshToken })
    }
  )
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw Error("Failed to refresh token");
    })
    .catch(() => {
      return {
        detail: "Failed to refresh token",
        code: "failed_to_refresh_token"
      };
    });

  return refreshResponse;
};

const blacklistTokenAsync = async (refreshToken: string) => {
  const refreshResponse: BlacklistResponse = await fetch(
    `http://${apiUrl}/auth/jwt/blacklist/`,
    {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ refresh: refreshToken })
    }
  )
    .then(response => response.json())
    .catch(err => {
      console.log(err);
    });

  return refreshResponse;
};

export {
  blacklistTokenAsync,
  refreshTokenAsync,
  verifyTokenAsync
};
