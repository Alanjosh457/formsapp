import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFormById, updateForm } from "./services"; // Import from services
import styles from "./editform.module.css";

const EditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [fields, setFields] = useState([]);

  useEffect(() => {
    getFormById(id)
      .then((data) => {
        setTitle(data.title);
        setFields(data.fields);
      })
      .catch((error) => console.error("Error fetching form:", error));
  }, [id]);

  const addField = (type) => {
    setFields([...fields, { type, label: "", placeholder: "" }]);
  };

  const handleChange = (index, field, value) => {
    const updatedFields = [...fields];
    updatedFields[index][field] = value;
    setFields(updatedFields);
  };

  const removeField = (index) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
  };

  const saveForm = async () => {
    try {
      const updatedForm = {
        title,
        fields: fields.map((field, index) => ({
          ...field,
          order: index + 1,
        })),
      };

      await updateForm(id, updatedForm);
      alert("Form updated successfully!");
      navigate(`/form/${id}`);
    } catch (error) {
      console.error("Error updating form:", error);
    }
  };

  return (
    <div className={styles.editFormContainer}>
      
      {/* Sidebar (Sticks to Left) */}
      <div className={styles.sidebar}>
        <h3>Edit Fields</h3>
        <button className={styles.addFieldBtn} onClick={() => addField("text")}>
          Add Text
        </button>
        <button className={styles.addFieldBtn} onClick={() => addField("email")}>
          Add Email
        </button>
        <button className={styles.addFieldBtn} onClick={() => addField("password")}>
          Add Password
        </button>
        <button className={styles.addFieldBtn} onClick={() => addField("number")}>
          Add Number
        </button>
        <button className={styles.addFieldBtn} onClick={() => addField("date")}>
          Add Date
        </button>
      </div>

      {/* Main Form Section */}
      <div className={styles.mainFormArea}>
        <h2>Edit Form</h2>
        
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
                placeholder="Label"
                value={field.label}
                onChange={(e) => handleChange(index, "label", e.target.value)}
                className={styles.formInput}
              />
              <input
                type="text"
                placeholder="Placeholder"
                value={field.placeholder}
                onChange={(e) => handleChange(index, "placeholder", e.target.value)}
                className={styles.formInput}
              />
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

export default EditForm;
