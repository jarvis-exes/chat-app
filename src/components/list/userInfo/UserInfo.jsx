import React, { useEffect } from "react";
import "./userInfo.css";
import { useUserStore } from "../../../lib/userStore";
import UserProfile from "../userProfile/UserProfile";

const UserInfo = () => {
  const { currentUser, updatingProfile, changeProfileOpen } = useUserStore();

  const handleOpenProfile = () => {
    changeProfileOpen();
  };

  return (
    <>
      <div className="userInfo">
        <div className="user" onClick={handleOpenProfile}>
          <img src={currentUser.avatar || "./avatar.png"} alt="" />
          <h2>{currentUser.username}</h2>
        </div>
        <div className="icons">
          <img src="./more.png" alt="" />
        </div>
      </div>
      {updatingProfile && <UserProfile />}
    </>
  );
};

export default UserInfo;
