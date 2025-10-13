import { NavLink, useNavigate } from "react-router-dom";
import { Home, Users, Inbox, Menu, Bell, User } from "lucide-react";
import logo from "/logo.png";
import { useUserStore } from "@/app/store";

const Navbar = () => {
  const navigate = useNavigate();
  const userUid = useUserStore((state) => state.userUid);
  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Friends", path: "/friends", icon: Users },
    { name: "Notifications", path: "/notifications", icon: Bell },
    { name: "Inbox", path: "/inbox", icon: Inbox },
    { name: "Menu", path: "/menu", icon: Menu },
    { name: "Profile", path: `/user/${userUid}`, icon: User },
  ];

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-6xl mx-auto md:px-2 px-4 lg:px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex gap-2 w-2/8 md:w-2/10 items-center">
            {" "}
            <img
              src={logo}
              alt="logo"
              className="h-12 rounded-full cursor-pointer md:h-10 md:w-10"
              onClick={() => navigate("/")}
            />
            <div className="lg:text-2xl md:text-xl md:block hidden font-bold text-indigo-600">
              Socialbox
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex w-6/8 md:w-8/10 md:space-x-1 justify-between sm:space-x-8 lg:space-x-6">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2  px-3  py-2 md:p-2 lg:px-3 rounded-lg transition-colors duration-200 
                  ${
                    isActive
                      ? "bg-indigo-100 text-indigo-600 font-semibold"
                      : "text-gray-600 hover:bg-gray-100 hover:text-indigo-500"
                  }`
                }
              >
                <item.icon className="h-6.5 w-6.5 md:h-5 md:w-5 text-gray-500 " />
                <span className="hidden md:block">{item.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
