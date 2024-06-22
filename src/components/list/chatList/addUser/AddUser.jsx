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
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

const AddUser = () => {
  const [user, setUser] = useState(null);
  const [added, setAdded] = useState(false);
  const { currentUser } = useUserStore();

  useEffect(() => {
    async function checkUserAdded() {
      // Handle Already Added User
      if (user) {
        if (user.id === currentUser.id) {
          setAdded(true);
          return;
        }

        const userChatRef = doc(db, "userchats", currentUser.id);
        const userChatsSnapshot = await getDoc(userChatRef);
        const userChatsData = await userChatsSnapshot.data();

        userChatsData.chats.map((chat) => {
          if (chat.receiverId === user.id) {
            setAdded(true);
          }
        });
      }
    }

    checkUserAdded();
  }, [user]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));

      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data());
        setAdded(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Can't Search for Users");
    }
  };

  const handleAdd = async () => {
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

      setAdded(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" />
        <button>Search</button>
      </form>
      {user && (
        <div className="user">
          <div className="details">
            <img src={user.avatar || "./avatar.png"} alt="" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd} disabled={added}>
            {added ? "Added" : "Add User"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
