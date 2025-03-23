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
    setFields([...fields, { type, label: "", placeholder: "", required: false }]);
  };

  const removeField = (index) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
  };

  const updateField = (index, key, value) => {
    const updatedFields = fields.map((field, i) =>
      i === index ? { ...field, [key]: value } : field
    );
    setFields(updatedFields);
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

    // Check for empty labels
    for (let field of fields) {
      if (!field.label.trim()) {
        alert("Field labels cannot be empty.");
        return;
      }
    }

    try {
      const formWithOrder = {
        title,
        fields: fields.map((field, index) => ({
          ...field,
          order: index + 1,
        })),
      };

      await createForm(formWithOrder);
      navigate("/");
    } catch (error) {
      console.error("Error saving form:", error);
    }
  };

  return (
    <div className={styles.createFormContainer}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <h3>Add Fields</h3>
        <button className={styles.addFieldBtn} onClick={() => addField("text")}>Add Text</button>
        <button className={styles.addFieldBtn} onClick={() => addField("email")}>Add Email</button>
        <button className={styles.addFieldBtn} onClick={() => addField("password")}>Add Password</button>
        <button className={styles.addFieldBtn} onClick={() => addField("number")}>Add Number</button>
        <button className={styles.addFieldBtn} onClick={() => addField("date")}>Add Date</button>
      </div>

      {/* Main Form Area */}
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
              
              {/* Label Input */}
              <input
                type="text"
                placeholder="Field Label"
                value={field.label}
                className={styles.formInput}
                onChange={(e) => updateField(index, "label", e.target.value)}
              />

              {/* Placeholder Input */}
              <input
                type="text"
                placeholder="Field Placeholder"
                value={field.placeholder}
                className={styles.formInput}
                onChange={(e) => updateField(index, "placeholder", e.target.value)}
              />

              {/* Required Checkbox */}
              <label className={styles.requiredCheckbox}>
                <input
                  type="checkbox"
                  checked={field.required}
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
