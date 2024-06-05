import React from "react";
import "./addUser.css";

const AddUser = () => {
  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const username = formData.get("username");

    try {
    } catch (error) {}
  };

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" />
        <button>Search</button>
      </form>
      <div className="user">
        <div className="details">
          <img src="./avatar.png" alt="" />
          <span>Jarvis</span>
        </div>
        <button>Add User</button>
      </div>
    </div>
  );
};

export default AddUser;
