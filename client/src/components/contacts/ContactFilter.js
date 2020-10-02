import React, { useContext, useRef, useEffect } from "react";
import ContactContext from "../../context/contact/contactContext";
//useRef-way to refer a dom object which is alternative for forms

const ContactFilter = () => {
  const contactContext = useContext(ContactContext);
  const text = useRef("");
  const { filteredContacts, clearFilteredContacts, filtered } = contactContext;

  useEffect(() => {
    if (filtered === null) {
      text.current.value = "";
    }
  });

  const onChange = (e) => {
    if (text.current.value !== "") {
      filteredContacts(e.target.value);
    } else {
      clearFilteredContacts();
    }
  };
  return (
    <form>
      <input
        ref={text}
        type='text'
        placeholder='Search Contacts'
        onChange={onChange}
      ></input>
    </form>
  );
};

export default ContactFilter;
