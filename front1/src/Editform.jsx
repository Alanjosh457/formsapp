import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFormById, updateForm } from "./services"; 
import styles from "./editform.module.css";

const EditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const data = await getFormById(id);
        if (data) {
          setTitle(data.title || "");
          setFields(data.fields || []);
        }
      } catch (error) {
        console.error("Error fetching form:", error);
        alert("Failed to load form. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [id]);

  const addField = (type) => {
    if (fields.length >= 20) {
      alert("You can only add up to 20 fields.");
      return;
    }
    setFields([...fields, { type, label: "", placeholder: "", required: false }]);
  };

  const handleChange = (index, key, value) => {
    setFields((prevFields) =>
      prevFields.map((field, i) =>
        i === index ? { ...field, [key]: value } : field
      )
    );
  };

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const toggleRequired = (index) => {
    setFields((prevFields) =>
      prevFields.map((field, i) =>
        i === index ? { ...field, required: !field.required } : field
      )
    );
  };

  const saveForm = async () => {
    if (!title.trim()) {
      alert("Form title cannot be empty.");
      return;
    }

    const hasEmptyLabels = fields.some((field) => !field.label.trim());

    if (hasEmptyLabels) {
      alert("All fields must have a label.");
      return;
    }

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
      alert("Failed to update form. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading form...</p>;
  }

  return (
    <div className={styles.editFormContainer}>
      {/* Sidebar */}
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

      {/* Main Form Area */}
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
                placeholder="Placeholder (Optional)"
                value={field.placeholder}
                onChange={(e) => handleChange(index, "placeholder", e.target.value)}
                className={styles.formInput}
              />
              
              <div className={styles.checkboxWrapper}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={() => toggleRequired(index)}
                  />
                  Required
                </label>
              </div>
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
