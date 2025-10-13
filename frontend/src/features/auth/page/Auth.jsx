import { useAuthstore } from "@/app/store";
import Switch from "@/components/ui/switch";
import React, { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router";
import logo from "/logo.png";
const Auth = () => {
  const inLoginPage = useAuthstore((state) => state.inLoginPage);
  const swapPages = useAuthstore((state) => state.swapPages);
  const pathname = location.pathname;
  useEffect(() => {
    if (pathname === "/auth/login") {
      swapPages(true);
    } else if (pathname === "/auth/register") {
      swapPages(false);
    } else {
      location.replace("/auth/login");
    }
  }, []);

  return (
    <div className="relative">
      <div className="absolute top-1 left-1/2 -translate-x-1/2 flex justify-center gap-3 items-center ">
        <img
          src={logo}
          className=" h-14 w-14 ring-2 ring-offset-0 ring-emerald-500 rounded-2xl "
          alt="logo"
        />
        <p className="font-serif font-bold text-2xl">SocialBox</p>
      </div>

      <div
        className={`absolute w-140 h-140 rounded-2xl right-[50%] -top-70 translate-x-1/2 -z-10 transition duration-1000 ${
          inLoginPage ? "bg-blue-400 -rotate-45" : "bg-emerald-400 rotate-135"
        }`}
      >
        {/* Child 1: BR -> TL */}
        <div
          className={`absolute  flex justify-between  items-center  px-30 top-1/2 left-1/2 w-[100%] h-[40%] -translate-x-1/2 -translate-y-1/2 -rotate-45`}
        >
          <p className="rotate-90 text-3xl font-bold">
            <span className="text-sm">Welcome back</span>
            <br /> login
          </p>{" "}
          <p className="rotate-270 text-3xl font-bold">
            <span className="text-sm"> Welcome to our app </span>
            <br /> register
          </p>
        </div>
      </div>
      <div className="w-full h-full">
        <Outlet />
      </div>
    </div>
  );
};

export default Auth;
