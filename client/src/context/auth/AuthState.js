import React, { useReducer } from "react";
import AuthContext from "./authContext";
import authReducer from "./authReducer";
import setAuthToken from "../../utils/setAuthToken";

import axios from "axios";
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

const AuthState = (props) => {
  const initialState = {
    //getting token from local storage
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  //load user
  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    //load token into global headers
    try {
      const res = await axios.get("/api/auth");
      dispatch({ type: User_Loaded, payload: res.data });
    } catch (err) {
      dispatch({ type: Auth_Error });
    }
  };

  //register User
  const register = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await axios.post("/api/users", formData, config);
      dispatch({
        type: Register_Success,
        payload: response.data,
        //response data is jwt token
      });
      loadUser();
    } catch (err) {
      dispatch({ type: Register_Fail, payload: err.response.data.msg });
    }
  };

  //login
  const login = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await axios.post("/api/auth", formData, config);
      dispatch({
        type: Login_Success,
        payload: response.data,
      });
    } catch (err) {
      dispatch({ type: Login_Fail, payload: err.response.data.msg });
    }
  };
  //logout
  const logout = () => {
    dispatch({ type: Logout });
  };
  //clear errors
  const clearErrors = () => dispatch({ type: Clear_Errors });

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        loading: state.loading,
        error: state.error,
        loadUser,
        register,
        clearErrors,
        login,
        logout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
