import { useEffect } from "react";
import Chat from "./components/chat/Chat";
import Details from "./components/detail/Details";
import List from "./components/list/List";
import AddUser from "./components/list/chatList/addUser/AddUser";
import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";

const App = () => {
  const user = false;

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      console.log(user);
    });

    return () => {
      unSub;
    };
  }, []);

  return (
    <>
      {user ? (
        <div className="container">
          <List />
          <Chat />
          <Details />
        </div>
      ) : (
        <Login />
      )}
      <Notification />
    </>
  );
};

export default App;
