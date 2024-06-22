import React from "react";
import "./userProfile.css";

const UserProfile = () => {
  return (
    <div className="userProfile">
      <h2>Update Profile</h2>
      <form>
        <label htmlFor="file">
          <img src="./avatar.png" alt="" />
          Change Avatar
        </label>
        <input type="file" id="file" style={{ display: "none" }} />
        <input type="text" placeholder="Username" name="username" />
        <input type="text" placeholder="Email" name="email" />
        <input type="password" placeholder="Password" name="password" />
        <button>Update</button>
      </form>
    </div>
  );
};

export default UserProfile;
