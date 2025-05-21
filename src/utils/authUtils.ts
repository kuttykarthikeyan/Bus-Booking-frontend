export const getValidToken = (): string | null => {
    const authData = localStorage.getItem("authToken");
    if (!authData) return null;
  
    try {
      const { token, expiry } = JSON.parse(authData);
      if (new Date().getTime() < expiry) {
        return token;
      }
    } catch (err) {
      console.error("Error parsing auth token", err);
    }
    return null;
  };
  