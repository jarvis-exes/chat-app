import React, { useEffect, useRef, useState } from "react";
import "./userProfile.css";
import { toast } from "react-toastify";
import { useUserStore } from "../../../lib/userStore";
import { useChatStore } from "../../../lib/chatStore";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import upload from "../../../lib/upload";
import { auth, db } from "../../../lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import useClickOutside from "../../customHooks/ClickOutside";

const UserProfile = () => {
  const { currentUser, updatingProfile, changeProfileOpen } = useUserStore();
  const { imgSrc, changeImgViewerState } = useChatStore();

  const [loading, setLoading] = useState(false);
  let imgUrl = null;
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const elementRef = useRef(null);

  const handleClose = () => {
    updatingProfile ? changeProfileOpen() : null;
  };

  useClickOutside(elementRef, handleClose);

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
      setLoading(false);
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
    <div ref={elementRef} className="userProfile">
      <img
        src="plus.png"
        alt=""
        className="close"
        onClick={changeProfileOpen}
      />
      <h1>Profile</h1>
      <form onSubmit={handleUpdate}>
        <div className="profileImageContainer">
          <img
            src={avatar.url ? avatar.url : currentUser.avatar || "./avatar.png"}
            alt=""
            onClick={() =>
              changeImgViewerState(currentUser.avatar || "./avatar.png")
            }
          />
          <label htmlFor="file">Change Avatar</label>
          <input
            type="file"
            id="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleAvatar}
          />
        </div>
        <input type="text" placeholder="New Username" name="username" />
        <input type="text" placeholder="New Name" name="fullname" />
        <button disabled={loading}>Update</button>
        <p onClick={handlePasswordReset}>Password Reset</p>
      </form>
    </div>
  );
};

export default UserProfile;
