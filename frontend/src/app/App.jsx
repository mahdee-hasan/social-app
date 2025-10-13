import { BrowserRouter } from "react-router-dom";

import AppRoutes from "./routes";
import { useUserStore } from "./store";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const setIdToken = useUserStore((state) => state.setIdToken);
  const setUid = useUserStore((state) => state.setUserUid);

  useEffect(() => {
    try {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const token = await user.getIdToken(true);
          setUid(user.uid);
          setIdToken(token);
        } else {
          console.log("No user signed in");
        }
      });
      return () => unsubscribe();
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);
  if (isLoading) {
    return <p>fetching user....</p>;
  }
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
