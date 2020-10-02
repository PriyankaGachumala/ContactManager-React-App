import React, { useReducer } from "react";
import AlertContext from "./alertContext";
import alertReducer from "./alertReducer";
import { v4 as uuidv4 } from "uuid";
import { Set_Alert, Remove_Alert } from "../types";

const AlertState = (props) => {
  const initialState = [];
  const [state, dispatch] = useReducer(alertReducer, initialState);

  //set Alert
  const setAlert = (msg, type, timeout = 5000) => {
    const id = uuidv4();
    dispatch({
      type: Set_Alert,
      payload: { msg, type, id },
    });
    setTimeout(() => {
      dispatch({ type: Remove_Alert, payload: id });
    }, timeout);
  };

  return (
    <AlertContext.Provider
      value={{
        alerts: state,
        setAlert,
        Remove_Alert,
      }}
    >
      {props.children}
    </AlertContext.Provider>
  );
};

export default AlertState;
