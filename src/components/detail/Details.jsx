import React from "react";
import "./details.css";
import { auth, db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import {
  arrayRemove,
  arrayUnion,
  updateDoc,
  doc,
  onSnapshot,
  deleteDoc,
  collection,
  where,
  query,
  getDocs,
  getDoc,
} from "firebase/firestore";

const Details = () => {
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } =
    useChatStore();

  const { currentUser } = useUserStore();

  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });

      changeBlock();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    // const chatRef = doc(db, "chats", chatId);
    // await deleteDoc(chatRef);

    const userchatRef = doc(db, "userchats", currentUser.id);
    const userDocSnap = await getDoc(userchatRef);
    const chats = userDocSnap.data();

    const newchat = chats.chats.filter((chat) => {
      return chat.chatId === chatId;
    });

    const receiverID = newchat[0].receiverId;
    console.log(receiverID);
  };

  return (
    <div className="detail">
      <div className="user">
        <img src={user?.avatar || "./avatar.png"} alt="" />
        <h2>{user?.fullname}</h2>
        <p>{user?.username}</p>
      </div>
      <div className="bottom-container">
        <div className="info">
          <div className="option">
            <div className="title">
              <span>Chat Settings</span>
              <img src="./arrowUp.png" alt="" />
            </div>
          </div>
          <div className="option">
            <div className="title">
              <span>Privacy & help</span>
              <img src="./arrowUp.png" alt="" />
            </div>
          </div>
          <div className="option">
            <div className="title">
              <span>Shared photos</span>
              <img src="./arrowDown.png" alt="" />
            </div>
            <div className="photos">
              <div className="photoItem">
                <div className="photoDetail">
                  <img
                    src="https://images3.alphacoders.com/614/thumbbig-614743.webp"
                    alt=""
                  />
                  <span>photo_abc.png</span>
                </div>
                <img src="./download.png" alt="" className="icon" />
              </div>
              <div className="photoItem">
                <div className="photoDetail">
                  <img
                    src="https://images3.alphacoders.com/614/thumbbig-614743.webp"
                    alt=""
                  />
                  <span>photo_abc.png</span>
                </div>
                <img src="./download.png" alt="" className="icon" />
              </div>
            </div>
          </div>
        </div>
        <div className="buttons">
          <button onClick={handleBlock}>
            {isCurrentUserBlocked
              ? "You are Blocked"
              : isReceiverBlocked
              ? "Unblock"
              : "Block"}
          </button>
          <button className="logout" onClick={handleDelete}>
            Delete Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default Details;
