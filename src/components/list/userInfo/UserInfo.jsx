import React from "react";
import "./userInfo.css";
import { useUserStore } from "../../../lib/userStore";
import UserProfile from "./userProfile/UserProfile";

const UserInfo = () => {
  const { currentUser } = useUserStore();

  return (
    <>
      <div className="userInfo">
        <div className="user">
          <img src={currentUser.avatar || "./avatar.png"} alt="" />
          <h2>{currentUser.username}</h2>
        </div>
        <div className="icons">
          <img src="./more.png" alt="" />
        </div>
      </div>
      <UserProfile />
    </>
  );
};

export default UserInfo;
