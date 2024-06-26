import React, { useEffect, useState } from "react";
import "./userProfile.css";
import { toast } from "react-toastify";
import { useUserStore } from "../../../lib/userStore";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import upload from "../../../lib/upload";
import { auth, db } from "../../../lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

const UserProfile = () => {
  const { currentUser, changeProfileOpen } = useUserStore();
  const [loading, setLoading] = useState(false);
  let imgUrl = null;
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const { username, fullname } = Object.fromEntries(formData);

    // VALIDATE UNIQUE USERNAME
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return toast.warn("Select another username");
    }

    try {
      if (avatar.file) {
        toast.success("Uploading Image");
        imgUrl = await upload(avatar.file);
      }
      await updateDoc(doc(db, "users", currentUser.id), {
        ...(username && { username: username }),
        ...(fullname && { fullname: fullname }),
        ...(imgUrl && { avatar: imgUrl }),
      });
    } catch (error) {
      toast.error("Error is Updating Profile");
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
      setAvatar({
        file: null,
        url: "",
      });
    }
  };

  const handlePasswordReset = () => {
    try {
      sendPasswordResetEmail(auth, currentUser.email);
      toast.success("Password Reset Mail Sent");
    } catch (error) {
      console.log(error);
      toast.error("Error in Sending Mail");
    }
  };

  return (
    <div className="userProfile">
      <img
        src="plus.png"
        alt=""
        className="close"
        onClick={changeProfileOpen}
      />
      <h1>Profile</h1>
      <form onSubmit={handleUpdate}>
        <label htmlFor="file">
          <img
            src={avatar.url ? avatar.url : currentUser.avatar || "./avatar.png"}
            alt=""
          />
          Change Avatar
        </label>
        <input
          type="file"
          id="file"
          style={{ display: "none" }}
          onChange={handleAvatar}
        />
        <input type="text" placeholder="New Username" name="username" />
        <input type="text" placeholder="New Name" name="fullname" />
        <button disabled={loading}>Update</button>
        <p onClick={handlePasswordReset}>Password Reset</p>
      </form>
    </div>
  );
};

export default UserProfile;
