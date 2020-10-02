import {
  Register_Success,
  Register_Fail,
  Login_Success,
  Login_Fail,
  User_Loaded,
  Auth_Error,
  Clear_Errors,
  Logout,
} from "../types";

export default (state, action) => {
  switch (action.type) {
    case Register_Success:
    case Login_Success:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case Register_Fail:
    case Auth_Error:
    case Login_Fail:
    case Logout:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload,
      };
    case User_Loaded:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
      };
    case Clear_Errors:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
