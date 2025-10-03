import React, { useState } from "react";
import "./UserCard.css";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";



const UserCard: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.currentUser);

  const [editableName, setEditableName] = useState(user?.username);
  const [isEditing, setIsEditing] = useState(false);

  const handleNameClick = () => setIsEditing(true);
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setEditableName(e.target.value);
  const handleNameBlur = () => setIsEditing(false);

  return (
    <div className="userCard">
      <img src="https://i.pravatar.cc/60" alt="User Avatar" className="avatarImg" />

      <div className="userInfo">
        {isEditing ? (
          <input type="text" value={editableName} onChange={handleNameChange} onBlur={handleNameBlur} autoFocus className="nameInput" />
        ) : (
          <h3 className="userName" onClick={handleNameClick}>
            {editableName}
          </h3>
        )}
        <p className="userEmail">{user?.email}</p>
      </div>

      <button className="logoutBtn" >
        Logout
      </button>
    </div>
  );
};

export default UserCard;
