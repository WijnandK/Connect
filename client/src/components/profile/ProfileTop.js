import React from "react";

const ProfileTop = ({
  profile: {
    status,
    company,
    location,
    website,
    social,
    user: { name, avatar }
  }
}) => {
  return (
    <div className="profile-top bg-primary p-2">
      <img className="round-img my-1" src={avatar} alt="Profile" />
      <h1 className="large">{name}</h1>
      <p className="lead">
        {status} {company && <span>{company}</span>}
      </p>
      <p>{location}</p>
      <div className="icons my-1">
        <i className="fas fa-globe fa-2x"></i>
        <i className="fab fa-twitter fa-2x"></i>

        <i className="fab fa-facebook fa-2x"></i>
        <i className="fab fa-linkedin fa-2x"></i>
        <i className="fab fa-youtube fa-2x"></i>
        <i className="fab fa-instagram fa-2x"></i>
      </div>
    </div>
  );
};

export default ProfileTop;
