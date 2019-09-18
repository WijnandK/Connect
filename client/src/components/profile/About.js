import React from "react";

const About = ({
  profile: {
    bio,
    skills,
    user: { name }
  }
}) => {
  return (
    <div className="profile-about bg-light p-2">
      <h2 className="text-primary">Bio from: {name}</h2>
      <p>{bio}</p>
      <div className="line"></div>
      <h2 className="text-primary">Skill Set</h2>
      <div className="skills">
        {skills.map(skill => (
          <div key={skill} className="p-1">
            <i className="fa fa-check"></i> {skill}
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
