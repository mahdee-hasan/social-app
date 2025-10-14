import { BrowserRouter } from "react-router-dom";

import AppRoutes from "./routes";
import { useUserStore } from "./store";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import getUser from "@/services/getUser";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});
  const setIdToken = useUserStore((state) => state.setIdToken);
  const setUid = useUserStore((state) => state.setUserUid);
  const setObjectId = useUserStore((state) => state.setUserObjectId);

  const loadUser = async () => {
    try {
      const data = await getUser();
      setUser(data.user);
      setObjectId(data.user._id);
    } catch (error) {
      console.log(error);
    }
  };
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
      loadUser();
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
