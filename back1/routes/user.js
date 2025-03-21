const express=require("express")
const mongoose = require("mongoose");
const router=express.Router()
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const env=require("dotenv")
const Form = require('../Schemas/formSchema');

const UAParser = require("ua-parser-js");

env.config()
const { nanoid } = require("nanoid");






// ✅ Fetch all forms
router.get("/forms", async (req, res) => {
  try {
    const forms = await Form.find().select("title createdAt");
    res.json(forms);
  } catch (err) {
    res.status(500).json({ message: "Error fetching forms", error: err.message });
  }
});

// ✅ Create a new form
router.post("/form/create", async (req, res) => {
  try {
    console.log("Received data:", req.body); // ✅ Log incoming request data
    const { title, fields } = req.body;

    if (!title || !fields || fields.length === 0) {
      return res.status(400).json({ message: "Title and at least one field are required" });
    }

    const newForm = new Form({ title, fields });

    await newForm.save();
    res.status(201).json({ message: "Form created successfully", form: newForm });
  } catch (err) {
    console.error("Error creating form:", err); // ✅ Log the actual error
    res.status(500).json({ message: "Error creating form", error: err.message });
  }
});


// ✅ Get a specific form by ID
router.get("/form/:id", async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.json(form);
  } catch (err) {
    res.status(500).json({ message: "Error fetching form", error: err.message });
  }
});

// ✅ Edit/update a form
router.put("/form/:id/edit", async (req, res) => {
  try {
    const { title, fields } = req.body;
    const updatedForm = await Form.findByIdAndUpdate(
      req.params.id,
      { title, fields },
      { new: true, runValidators: true }
    );
    if (!updatedForm) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.json({ message: "Form updated successfully", form: updatedForm });
  } catch (err) {
    res.status(500).json({ message: "Error updating form", error: err.message });
  }
});

// ✅ Delete a form
router.delete("/form/:id", async (req, res) => {
  try {
    const deletedForm = await Form.findByIdAndDelete(req.params.id);
    if (!deletedForm) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.json({ message: "Form deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting form", error: err.message });
  }
});





module.exports = router;