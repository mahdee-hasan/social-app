import { create } from "zustand";

import { persist, createJSONStorage } from "zustand/middleware";
const useAuthstore = create((set) => ({
  inLoginPage: true,
  swapPages: (payload) => set({ inLoginPage: payload }),
}));

const useUserStore = create(
  persist(
    (set) => ({
      userUid: "",
      setUserUid: (payload) => set({ userUid: payload }),
      userObjectId: "",
      setUserObjectId: (payload) => set({ userObjectId: payload }),
      idToken: "",
      setIdToken: (payload) => set({ idToken: payload }),
    }),
    {
      name: "user-store", // key name in storage
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export { useAuthstore, useUserStore };
