import { BrowserRouter } from "react-router-dom";

import AppRoutes from "./routes";
import { useUserStore } from "./store";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import getUser from "@/services/getUser";
import SocketConnector from "@/components/socketConnector";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [tokenLoading, setTokenLoading] = useState(true);

  const setIdToken = useUserStore((state) => state.setIdToken);
  const setUid = useUserStore((state) => state.setUserUid);
  const uid = useUserStore((state) => state.userUid);
  const setObjectId = useUserStore((state) => state.setUserObjectId);
  const auth = getAuth();
  const loadUser = async () => {
    if (uid) {
      try {
        const data = await getUser();
        setObjectId(data.user._id);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    try {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken(true);
        setIdToken(token);
        setUid(firebaseUser.uid);
      } else {
        console.log("No user signed in");
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setTokenLoading(false);
    }
  });

  useEffect(() => {
    try {
      unsubscribe();
    } catch (error) {
      console.error(error.message);
    }
  }, [uid]);

  useEffect(() => {
    loadUser();
  }, [uid]);

  if (isLoading) {
    return <p>fetching user....</p>;
  }
  if (tokenLoading) {
    return <p>checking login....</p>;
  }
  return (
    <BrowserRouter>
      <SocketConnector />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
