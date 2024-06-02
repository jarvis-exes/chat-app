import Chat from "./components/chat/Chat";
import Details from "./components/detail/Details";
import List from "./components/list/List";
import AddUser from "./components/list/chatList/addUser/AddUser";
import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";

const App = () => {
  const user = true;

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
