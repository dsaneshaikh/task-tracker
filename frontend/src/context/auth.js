// Update checkAuthStatus function
const checkAuthStatus = async () => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const { data } = await api.get("/auth/me");
      setUser(data);
    }
  } finally {
    setLoading(false);
  }
};
