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

export default (state, action) => {
  switch (action.type) {
    case Get_Contacts:
      return {
        ...state,
        contacts: action.payload,
        loading: false,
      };
    case Add_Contact:
      return {
        ...state,
        contacts: [action.payload, ...state.contacts],
        loading: false,
      };
    case Delete_Contact:
      return {
        ...state,
        contacts: state.contacts.filter(
          (contact) => contact._id !== action.payload
        ),
      };
    case Clear_Contacts:
      return {
        ...state,
        contacts: null,
        filtered: null,
        error: null,
        current: null,
      };
    case Set_Current:
      return {
        ...state,
        current: action.payload,
      };
    case Clear_Current:
      return {
        ...state,
        current: null,
      };
    case Update_Contact:
      return {
        ...state,
        contacts: state.contacts.map((contact) =>
          contact._id === action.payload._id ? action.payload : contact
        ),
      };
    case Filter_Contacts:
      return {
        ...state,
        filtered: state.contacts.filter((contact) => {
          const regex = new RegExp(`${action.payload}`, "gi");
          //gi means global case insesnsitive
          return contact.name.match(regex) || contact.email.match(regex);
        }),
      };
    case Clear_Filter:
      return {
        ...state,
        filtered: null,
      };
    case Contact_Error:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};
