import React from "react";
import "./details.css";
import { toast } from "react-toastify";
import { auth, db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import ImageViewer from "../imageViewer/ImageViewer";
import {
  arrayRemove,
  arrayUnion,
  updateDoc,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

const Details = () => {
  const {
    chatId,
    user,
    isCurrentUserBlocked,
    isReceiverBlocked,
    changeBlock,
    resetChat,
    imgSrc,
    changeImgViewerState,
  } = useChatStore();

  const { currentUser, changeDetailsOpen } = useUserStore();

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
    try {
      //Remove chat from chats collection

      const chatRef = doc(db, "chats", chatId);
      await deleteDoc(chatRef);

      //Remove chat from Current User chat list

      const userchatRef = doc(db, "userchats", currentUser.id);
      const userChatSnap = await getDoc(userchatRef);
      const chats = userChatSnap.data();

      const newChat = chats.chats.filter((chat) => {
        return chat.chatId === chatId;
      });

      const receiverID = newChat[0].receiverId;

      const newChats = chats.chats.filter((chat) => {
        return chat.chatId !== chatId;
      });

      await updateDoc(userchatRef, {
        chats: newChats,
      });

      //Remove chat from Receiver chat list

      const userchatRefRec = doc(db, "userchats", receiverID);
      const userChatSnapRec = await getDoc(userchatRefRec);
      const chatsRec = userChatSnapRec.data();

      const newChatsRec = chatsRec.chats.filter((chat) => {
        return chat.chatId !== chatId;
      });

      await updateDoc(userchatRefRec, {
        chats: newChatsRec,
      });

      //Remove chat from current user's chats array
      const userDocRef = doc(db, "users", currentUser.id);

      await updateDoc(userDocRef, {
        chats: arrayRemove(receiverID),
      });

      //Remove chat from receiver user's chats array
      const userDocRefReceiver = doc(db, "users", receiverID);

      await updateDoc(userDocRefReceiver, {
        chats: arrayRemove(currentUser.id),
      });
    } catch (error) {
      console.log(error);
      toast.error("Can't delete the chat!");
    } finally {
      resetChat();
    }
  };

  return (
    <>
      <div className="detail">
        <div className="backButton">
          <img src="./back.png" alt="" onClick={changeDetailsOpen} />
        </div>
        <div className="user">
          <img
            src={user?.avatar || "./avatar.png"}
            alt=""
            onClick={() => changeImgViewerState(user?.avatar || "./avatar.png")}
          />
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
            <button className="deleteButton" onClick={handleDelete}>
              Delete Chat
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Details;
