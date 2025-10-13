import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Auth from "@/features/auth/page/Auth";
import Login from "@/features/auth/page/Login";
import Register from "@/features/auth/page/Register";

import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import User from "@/features/user/pages/User";
import Feed from "@/features/feed/pages/Feed";
import { logout } from "@/firebase";
import Error from "@/Pages/Error";
import Navbar from "@/Layouts/Navbar";
import AddPost from "@/features/feed/pages/AddPost";
import App from "@/components/lexical/LexicalInputTag";
import Footer from "@/Layouts/Footer";
import UserInfo from "@/features/user/pages/UserInfo";
import Inbox from "@/features/chat/pages/Inbox";
import ConversationDrawer from "@/features/chat/components/ConversationDrawer";

// Global pages
const AppRoutes = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const auth = getAuth();
  const navigate = useNavigate();
  useEffect(() => {
    return onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });
  }, []);
  if (isLoading) {
    return <div>loading ...... ....... </div>;
  }

  return (
    <>
      <FaSignOutAlt
        className="fixed top-40 text-2xl right-10"
        onClick={async () => {
          const status = await logout();
          if (status.success) {
            navigate("/auth/login");
          } else {
            alert(status.error);
          }
        }}
      />
      {user && (
        <>
          {" "}
          <Navbar />
          <hr className="h-18" />
          <ConversationDrawer />
        </>
      )}
      <Routes>
        {/* Global routes */}

        {/* Auth routes */}
        {user ? (
          <>
            <Route path="/" element={<Feed />} />
            <Route path="/add-post" element={<AddPost />} />
            <Route path="/user/:uid" element={<User />} />
            <Route path="/user-info/:uid" element={<UserInfo />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/test" element={<App />} />
            <Route path="*" element={<Error msg="page not found" to="/" />} />
          </>
        ) : (
          <>
            <Route path="/auth" element={<Auth />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>{" "}
            <Route
              path="*"
              element={<Error msg="you have to login first " to="/auth" />}
            />
          </>
        )}
      </Routes>
      <Footer />
    </>
  );
};

export default AppRoutes;
