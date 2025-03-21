const mongoose = require('mongoose');

const FieldSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ["text", "email", "password", "number", "date"] },
  label: { type: String, required: true },
  placeholder: { type: String },
  order: { type: Number, required: true }
});

module.exports = FieldSchema;  // Export as a schema, not a model
