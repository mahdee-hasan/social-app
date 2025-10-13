const fetchData = async (userId, token) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/user/get-me/${userId}`,
    {
      credentials: "include",
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await res.json();
  if (res.ok) {
    return { isLoggedIn: true, userData: data, error: null };
  } else {
    return { isLoggedIn: false, userData: null, error: data };
  }
};

export default fetchData;
