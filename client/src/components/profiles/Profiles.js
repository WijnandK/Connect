import React, { useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { getProfiles } from "../../actions/profile";
import Spinner from "../layout/Spinner";
import ProfileItem from "./ProfileItem";

const Profiles = ({ profile: { profiles, loading }, getProfiles }) => {
  useEffect(() => {
    getProfiles();
  }, [getProfiles]);
  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">Developers</h1>
          <p className="lead">
            <i className="fab fa-connectdevelop"></i>Browse and connect with
            Developers
          </p>
          <div className="profiles">
            {profiles.length > 0 ? (
              profiles.map(profile => (
                <ProfileItem key={profile._id} profile={profile} />
              ))
            ) : (
              <h4>No profile</h4>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getProfiles }
)(Profiles);
