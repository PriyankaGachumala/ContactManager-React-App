const express = require("express");
const { validationResult, check } = require("express-validator");
const auth = require("../middleware/auth");
const Contact = require("../models/Contact");
const router = express.Router();

//@route        GET "/api/contacts"
//@desc         Get all contacts of the specific user
//@access       private
router.get("/", auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1,
    });
    return res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ msg: "Server Error" });
  }
});

//@route        POST  "/api/contacts"
//@desc         Add new contact
//@access       private
router.post(
  "/",
  [
    auth,
    [
      check("name", "Please enter contact name").not().isEmpty(),
      check("email", "Please enter valid email").isEmail(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //destructuring-bringing out contact details from request body
    const { name, email, phone, type } = req.body;
    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id,
      });
      const contact = await newContact.save();
      res.json(contact);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);
//@route        PUT "/api/contacts/:id"
//@desc         update contact
//@access       private
router.put("/:id", auth, async (req, res) => {
  const { name, email, phone, type } = req.body;
  //created an empty object
  const updatedFields = {};
  //saving all the edited fields into this empty object updatedFields
  if (name) updatedFields.name = name;
  if (email) updatedFields.email = email;
  if (phone) updatedFields.phone = phone;
  if (type) updatedFields.type = type;
  try {
    //finding the contact by its id
    let contact = await Contact.findById(req.params.id, function (err) {
      if (err) {
        res.status(400).send({ msg: "Invalid token" });
      }
    });
    //if the contact does not exists
    if (!contact) return res.status(404).json({ msg: "Contact not found" });

    //user should edit their own contact. we have to make sure that the contact which is being edited is owned by the user who is editing
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).send("User not authorized");
    }
    //findByIdAndUpdate() method takes in 3 arguments. id which is passed in url, object which has updated information, new:true will create a new record if the record doesn't exists
    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );
    res.json(contact);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

//@route        DELETE "/api/contacts/:id"
//@desc         Delete contact
//@access       private
router.delete("/:id", auth, async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ msg: "Contact not found" });
    }
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }
    contact = await Contact.findByIdAndRemove(req.params.id);
    res.json({ msg: "Contact is deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
