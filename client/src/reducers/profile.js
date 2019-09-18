import {
  GET_PROFILE,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  UPDATE_PROFILE,
  GET_PROFILES,
  GET_PROFILE_BYID,
  GET_R
} from "../actions/types";

const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {}
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false
      };
    case GET_PROFILE_BYID:
      return {
        ...state,
        profile: payload,
        loading: false
      };

    case GET_PROFILES:
      return {
        ...state,
        profiles: payload
      };

    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        profileById: null,
        repos: [],
        loading: false
      };
    case GET_R:
      return {
        ...state,
        repos: payload,
        loading: false
      };
    default:
      return state;
  }
};
