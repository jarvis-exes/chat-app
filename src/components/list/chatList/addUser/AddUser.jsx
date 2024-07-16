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

  const loadUsers = async () => {
    const userDocRef = doc(db, "users", currentUser.id);
    const userDocSnapshot = await getDoc(userDocRef);
    const userDocData = await userDocSnapshot.data();

    const userRef = collection(db, "users");
    const usersRef = await getDocs(userRef);

    // Handle Already Added User
    const userChatRef = doc(db, "userchats", currentUser.id);
    const userChatsSnapshot = await getDoc(userChatRef);
    const userChatsData = await userChatsSnapshot.data();

    // console.log(usersRef);

    const allDocs = [];
    usersRef.forEach((doc) => {
      const data = doc.data();
      userDocData.chats.map((chat) => {
        if (chat === data.id) {
          data.added = true;
        }
      });

      allDocs.push({ ...data });
    });

    setUsers(allDocs);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAdd = async (user) => {
    const chatRef = collection(db, "chats");
    const userChatRef = collection(db, "userchats");

    const userDocRef = doc(db, "users", currentUser.id);
    const userDocRefReceiver = doc(db, "users", user.id);

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

      await updateDoc(userDocRef, {
        chats: arrayUnion(user.id),
      });

      await updateDoc(userDocRefReceiver, {
        chats: arrayUnion(currentUser.id),
      });
    } catch (error) {
      console.log(error);
    } finally {
      loadUsers();
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
