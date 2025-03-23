import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createForm } from "./services";
import styles from "./create.module.css";

const Createforms = () => {
  const [title, setTitle] = useState("");
  const [fields, setFields] = useState([]);
  const navigate = useNavigate();

  const addField = (type) => {
    if (fields.length >= 20) {
      alert("You can only add up to 20 fields.");
      return;
    }
    setFields([
      ...fields,
      { type, label: "", placeholder: "", required: false } // ✅ Store as boolean
    ]);
  };

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index, key, value) => {
    setFields(
      fields.map((field, i) =>
        i === index
          ? { ...field, [key]: key === "required" ? Boolean(value) : value } // ✅ Ensure required is always a boolean
          : field
      )
    );
  };

  const saveForm = async () => {
    if (!title.trim()) {
      alert("Form title cannot be empty.");
      return;
    }

    if (fields.length === 0) {
      alert("Please add at least one field before saving.");
      return;
    }

    for (let field of fields) {
      if (!field.label.trim()) {
        alert("Field labels cannot be empty.");
        return;
      }
    }
    const sanitizedFields = fields.map((field, index) => ({
      ...field,
      required: String(field.required), // Convert to string "true" or "false"
      order: index + 1
    }));
    


    console.log("Saving form with fields:", sanitizedFields); // Debugging

    try {
      await createForm({ title, fields: sanitizedFields });
      navigate("/");
    } catch (error) {
      console.error("Error saving form:", error);
    }
  };

  return (
    <div className={styles.createFormContainer}>
      <div className={styles.sidebar}>
        <h3>Add Fields</h3>
        {["text", "email", "password", "number", "date"].map((type) => (
          <button key={type} className={styles.addFieldBtn} onClick={() => addField(type)}>
            Add {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.mainFormArea}>
        <h2>Create Form</h2>

        <input
          type="text"
          placeholder="Form Title"
          className={styles.formInput}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className={styles.fieldsContainer}>
          {fields.map((field, index) => (
            <div key={index} className={styles.fieldWrapper}>
              <button className={styles.deleteBtn} onClick={() => removeField(index)}>✖</button>

              <input
                type="text"
                placeholder="Field Label"
                value={field.label}
                className={styles.formInput}
                onChange={(e) => updateField(index, "label", e.target.value)}
              />

              <input
                type="text"
                placeholder="Field Placeholder"
                value={field.placeholder}
                className={styles.formInput}
                onChange={(e) => updateField(index, "placeholder", e.target.value)}
              />

              <label className={styles.requiredCheckbox}>
                <input
                  type="checkbox"
                  checked={field.required} // ✅ Checkbox properly reflects boolean value
                  onChange={(e) => updateField(index, "required", e.target.checked)}
                />
                Required
              </label>
            </div>
          ))}
        </div>

        <button onClick={saveForm} className={styles.saveBtn}>
          Save Form
        </button>
      </div>
    </div>
  );
};

export default Createforms;
