import React, { useReducer } from "react";
import ContactContext from "./contactContext";
import contactReducer from "./contactReducer";
import axios from "axios";
import {
  Add_Contact,
  Delete_Contact,
  Update_Contact,
  Filter_Contacts,
  Clear_Filter,
  Set_Current,
  Clear_Current,
  Contact_Error,
  Get_Contacts,
  Clear_Contacts,
} from "../types";

const ContactState = (props) => {
  //intitial state of contacts
  const initialState = {
    contacts: null,
    //when we click edit we will save the data in "current" state object which is set to null initially
    current: null,
    //state for filtered contacts
    filtered: null,
    error: null,
    loading: true,
  };

  //state will allow to access anything in state and dispatch will allow to dispatch objects to the reducer
  const [state, dispatch] = useReducer(contactReducer, initialState);

  //Actions that we have will be coded here

  //Get Contacts
  const getContacts = async () => {
    try {
      const response = await axios.get("/api/contacts");
      dispatch({
        type: Get_Contacts,
        payload: response.data,
      });
    } catch (err) {
      dispatch({ type: Contact_Error, payload: err.response.msg });
    }
  };

  //add a new contact
  const addContact = async (contact) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await axios.post("/api/contacts", contact, config);
      dispatch({ type: Add_Contact, payload: response.data });
    } catch (err) {
      dispatch({ type: Contact_Error, payload: err.response.msg });
    }
  };

  //delete contact
  const deleteContact = async (id) => {
    try {
      const response = await axios.delete(`/api/contacts/${id}`);
      dispatch({ type: Delete_Contact, payload: response });
    } catch (err) {
      dispatch({ type: Contact_Error, payload: err.response.msg });
    }
  };

  //clear contacts
  const clearContacts = () => {
    dispatch({ type: Clear_Contacts });
  };

  //set current contact
  const setCurrentContact = (contact) => {
    dispatch({ type: Set_Current, payload: contact });
  };

  //remove current
  const clearCurrentContact = () => {
    dispatch({ type: Clear_Current });
  };

  //update contact
  const updateContact = async (contact) => {
    const config = {
      headers: {
        "Context-Type": "application/json",
      },
    };
    try {
      const response = await axios.put(
        `/api/contacts/${contact._id}`,
        contact,
        config
      );
      dispatch({ type: Update_Contact, payload: response.data });
    } catch (err) {
      dispatch({ type: Contact_Error, payload: err.response.msg });
    }
  };

  //Filter Contacts (search)
  const filteredContacts = (text) => {
    dispatch({ type: Filter_Contacts, payload: text });
  };

  //clear filter
  const clearFilteredContacts = () => {
    dispatch({ type: Clear_Filter });
  };

  //return provider. we can wrap the entire application through the context ContactState
  return (
    <ContactContext.Provider
      value={{
        contacts: state.contacts,
        current: state.current,
        filtered: state.filtered,
        error: state.error,
        loading: state.loading,
        //anything that we want to acces from other components or the current component, it should be passed through value in here
        getContacts,
        addContact,
        deleteContact,
        setCurrentContact,
        clearCurrentContact,
        updateContact,
        filteredContacts,
        clearFilteredContacts,
        clearContacts,
      }}
    >
      {props.children}
    </ContactContext.Provider>
  );
};

export default ContactState;
