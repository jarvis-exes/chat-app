import { useEffect, useState } from "react";
import Chat from "./components/chat/Chat";
import Details from "./components/detail/Details";
import List from "./components/list/List";
import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";
import { doc } from "firebase/firestore";
import ImageViewer from "../src/components/imageViewer/ImageViewer";

const App = () => {
  const { currentUser, isLoading, fetchUserInfo, details, changeDetailsOpen } =
    useUserStore();
  const { chatId, imgSrc, changeImgViewerState } = useChatStore();
  const [mobileView, setMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth <= 768) {
        setMobileView(true);
      } else {
        setMobileView(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  if (isLoading) return <div className="loading"></div>;

  if (mobileView) {
    return (
      <>
        {currentUser ? (
          <div className="container">
            {chatId && details ? <Details /> : chatId ? <Chat /> : <List />}
            {imgSrc && <ImageViewer />}
          </div>
        ) : (
          <Login />
        )}

        <Notification />
      </>
    );
  } else {
    return (
      <>
        {currentUser ? (
          <div className="container">
            <List />
            {chatId && <Chat />}
            {chatId && <Details />}
            {imgSrc && <ImageViewer />}
          </div>
        ) : (
          <Login />
        )}
        <Notification />
      </>
    );
  }
};

export default App;
