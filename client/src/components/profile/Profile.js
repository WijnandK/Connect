import React, { useEffect, Fragment } from "react";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { getProfileById } from "../../actions/profile";
import { Link } from "react-router-dom";
import ProfileTop from "./ProfileTop";
import About from "./About";
import Experience from "./Experience";
import Education from "./Education";
import ProfileGithub from "./ProfileGithub";
const Profile = ({
  match,
  getProfileById,
  profile: { profile, loading },
  auth
}) => {
  useEffect(() => {
    getProfileById(match.params.id);
  }, [getProfileById, match.params.id]);
  return (
    <Fragment>
      {loading || !profile ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to="/profiles" className="btn btn-light">
            Back to Profiles
          </Link>
          {!auth.isAuthenticated ? null : (
            <Fragment>
              {auth.user._id === profile.user._id && (
                <Link to="/edit-profile" className="btn btn-dark">
                  Edit profile
                </Link>
              )}
            </Fragment>
          )}
          <div className="profile-grid my-1">
            <ProfileTop profile={profile} />
            <About profile={profile} />
            <div className="profile-exp bg-white p-2">
              <h2 className="text-primary">Experience</h2>

              {profile.experience.map(exp => (
                <Experience key={exp._id} experience={exp} />
              ))}
            </div>
            <div className="profile-edu bg-white p-2">
              <h2 className="text-primary">Education</h2>
              {profile.education.map(edu => (
                <Education key={edu._id} education={edu} />
              ))}
            </div>

            {profile.githubusername && (
              <ProfileGithub userName={profile.githubusername} />
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};
const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getProfileById }
)(Profile);
