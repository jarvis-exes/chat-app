import React, { useEffect, useState } from "react";
import "./userInfo.css";
import { useUserStore } from "../../../lib/userStore";
import UserProfile from "../userProfile/UserProfile";
import { auth } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";

const UserInfo = () => {
  const { currentUser, updatingProfile, changeProfileOpen } = useUserStore();
  const { resetChat } = useChatStore();
  const [moreDropdown, setMoreDropdown] = useState(false);

  const handleOpenProfile = () => {
    changeProfileOpen();
    setMoreDropdown(false);
  };

  const handleLogout = () => {
    setMoreDropdown(false);
    auth.signOut();
    resetChat();
  };

  return (
    <>
      <div className="userInfo">
        <div className="user" onClick={handleOpenProfile}>
          <img src={currentUser.avatar || "./avatar.png"} alt="" />
          <h2>{currentUser.username}</h2>
        </div>
        <div className="icons">
          <img
            src="./more.png"
            alt=""
            onClick={() => setMoreDropdown((prev) => !prev)}
          />
          {moreDropdown && (
            <div className="dropdown">
              <span className="option" onClick={handleOpenProfile}>
                Edit Profile
              </span>
              <span className="option" onClick={handleLogout}>
                Logout
              </span>
            </div>
          )}
        </div>
      </div>
      {updatingProfile && <UserProfile />}
    </>
  );
};

export default UserInfo;
