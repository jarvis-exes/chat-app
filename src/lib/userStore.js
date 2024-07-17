import { doc, onSnapshot } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";

export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,
  updatingProfile: false,
  addUser: false,
  imgSrc: "",
  details: false,
  fetchUserInfo: async (uid) => {
    if (!uid) return set({ currentUser: null, isLoading: false });

    try {
      const docSnap = onSnapshot(doc(db, "users", uid), (doc) => {
        set({ currentUser: doc.data(), isLoading: false });
      });
    } catch (error) {
      console.log(error);
      return set({ currentUser: null, isLoading: false });
    }
  },

  changeProfileOpen: () => {
    set((state) => ({ ...state, updatingProfile: !state.updatingProfile }));
  },

  changeAddUserOpen: () => {
    set((state) => ({ ...state, addUser: !state.addUser }));
  },

  changeDetailsOpen: () => {
    set((state) => ({ ...state, details: !state.details }));
  },

  changeImgViewerState: (url) => {
    set((state) => ({ ...state, imgSrc: url }));
  },
}));
