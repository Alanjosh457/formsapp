import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFormById } from "./services";
import styles from "./viewpage.module.css";

const Viewforms = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getFormById(id)
      .then((fetchedForm) => {
        setForm(fetchedForm);
        
        // Initialize form data state
        const initialData = {};
        const initialErrors = {};
        
        fetchedForm.fields.forEach((field) => {
          initialData[field.label] = ""; // Default empty values
          if (field.required) {
            initialErrors[field.label] = ""; // Prepare error state
          }
        });

        setFormData(initialData);
        setErrors(initialErrors);
      })
      .catch((error) => console.error("Error fetching form:", error));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear errors when user types
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    form.fields.forEach((field) => {
      const value = formData[field.label]?.trim() || "";

      // Required field validation
      if (field.required && !value) {
        newErrors[field.label] = "This field is required.";
        isValid = false;
      }

      // Email validation
      if (field.type === "email" && value && !/\S+@\S+\.\S+/.test(value)) {
        newErrors[field.label] = "Please enter a valid email address.";
        isValid = false;
      }

      // Number validation
      if (field.type === "number" && value && isNaN(value)) {
        newErrors[field.label] = "Please enter a valid number.";
        isValid = false;
      }
    });

    setErrors(newErrors);

    if (!isValid) {
      alert("Fields cannot be empty. Please fill in all required fields.");
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("✅ Form submitted successfully:", formData);
      navigate("./submit"); // Redirect after success
    } else {
      console.log("❌ Form validation failed!");
    }
  };

  if (!form) return <div className={styles.loading}>Loading form...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2 className={styles.formTitle}>{form.title}</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          {form.fields.map((field, index) => (
            <div key={index} className={styles.formGroup}>
              <label className={styles.label}>
                {field.label} {field.required && <span style={{ color: "red" }}>*</span>}
              </label>
              <input
                type={field.type}
                name={field.label} // Use field label as key
                placeholder={field.placeholder}
                className={styles.input}
                value={formData[field.label]}
                onChange={handleChange}
              />
              {errors[field.label] && <p className={styles.errorText}>{errors[field.label]}</p>}
            </div>
          ))}
          <button type="submit" className={styles.submitBtn}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Viewforms;
