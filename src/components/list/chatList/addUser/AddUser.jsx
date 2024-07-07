import React, { useEffect, useState } from "react";
import "./addUser.css";
import { db } from "../../../../lib/firebase";
import { useUserStore } from "../../../../lib/userStore";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

const AddUser = () => {
  const [users, setUsers] = useState([]);
  const [input, setInput] = useState("");
  const { currentUser } = useUserStore();

  useEffect(() => {
    const loadUsers = async () => {
      const userRef = collection(db, "users");
      const usersRef = await getDocs(userRef);

      // Handle Already Added User
      const userChatRef = doc(db, "userchats", currentUser.id);
      const userChatsSnapshot = await getDoc(userChatRef);
      const userChatsData = await userChatsSnapshot.data();

      const allDocs = [];
      usersRef.forEach((doc) => {
        const data = doc.data();
        if (data.id === currentUser.id) {
          data.added = true;
        } else {
          userChatsData.chats.map((chat) => {
            if (chat.receiverId === data.id) {
              data.added = true;
            }
          });
        }
        allDocs.push({ ...data });
      });
      setUsers(allDocs);
    };

    loadUsers();
  }, [users]);

  const handleAdd = async (user) => {
    const chatRef = collection(db, "chats");
    const userChatRef = collection(db, "userchats");

    try {
      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(doc(userChatRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const filteredUsers = users.filter((c) =>
    c.fullname.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="addUser">
      <input
        type="text"
        placeholder="Username"
        name="username"
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="users">
        {filteredUsers.map((user) => (
          <div className="user" key={user.id}>
            <div className="details">
              <img src={user.avatar || "./avatar.png"} alt="" />
              <div className="nameAndUsername">
                <span>{user.fullname}</span>
                <p>{user.username}</p>
              </div>
            </div>
            <button
              onClick={() => {
                handleAdd(user);
              }}
              disabled={user.added}
            >
              {user.added ? "Added" : "Add User"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddUser;
