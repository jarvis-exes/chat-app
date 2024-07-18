import React from "react";
import "./list.css";
import UserInfo from "./userInfo/UserInfo";
import ChatList from "./chatList/ChatList";
import ImageViewer from "../imageViewer/ImageViewer";
import { useChatStore } from "../../lib/chatStore";

const List = () => {
  const { imgSrc, changeImgViewerState } = useChatStore();
  return (
    <div className="list">
      <UserInfo />
      <ChatList />
    </div>
  );
};

export default List;
