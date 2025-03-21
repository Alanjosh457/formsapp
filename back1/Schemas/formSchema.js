const mongoose = require('mongoose');
const FieldSchema = require('./fieldSchema');  // Import Field schema

const FormSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fields: [FieldSchema] // Use the imported schema
}, { timestamps: true });

module.exports = mongoose.model('Form', FormSchema);
