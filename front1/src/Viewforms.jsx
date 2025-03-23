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
        console.log("Fetched Form:", fetchedForm);
        console.log("Form Fields:", fetchedForm.fields); // 🔍 Check fields
        
        setForm(fetchedForm);
        const initialData = {};
        const initialErrors = {};
  
        fetchedForm.fields.forEach((field) => {
          console.log(`Field: ${field.label}, Required:`, field.required); // Debug log
          
          const fieldKey = field.label.replace(/\s+/g, "_");
          initialData[fieldKey] = "";
          if (field.required === "true" || field.required === true || field.required === "1") {
            initialErrors[fieldKey] = "";
          }
        });
  
        setFormData(initialData);
        setErrors(initialErrors);
      })
      .catch((error) => console.error("Error fetching form:", error));
  }, [id]);
  


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };


  const validateForm = () => {
    if (!form || !form.fields) return false;
  
    let isValid = true;
    let newErrors = {};
  
    form.fields.forEach((field) => {
      const fieldKey = field.label.replace(/\s+/g, "_");
      const value = formData[fieldKey]?.trim() || "";
  
      // Fix: Explicitly check for `required` instead of assuming its existence
      const isRequired = field.required === "true" || field.required === true || field.required === "1";
  
      console.log(`Checking field: ${field.label}, Value: '${value}', Required: ${field.required}`);
  
      if (isRequired && !value) {
        console.log(`❌ ${field.label} is required but empty!`);
        newErrors[fieldKey] = "This field is required.";
        isValid = false;
      }
  
      if (field.type === "email" && value && !/^\S+@\S+\.\S+$/.test(value)) {
        console.log(`❌ Invalid email format for ${field.label}`);
        newErrors[fieldKey] = "Enter a valid email address.";
        isValid = false;
      }
  
      if (field.type === "number" && value && isNaN(value)) {
        console.log(`❌ ${field.label} must be a number`);
        newErrors[fieldKey] = "Enter a valid number.";
        isValid = false;
      }
    });
  
    setErrors(newErrors);
    return isValid;
  };
  





  const handleSubmit = (e) => {
    e.preventDefault();
  
    const isValid = validateForm(); // Store the validation result
  
    setTimeout(() => {
      if (!isValid) {
        alert("Please fill in all required fields before submitting.");
        return; // ⛔ Prevent form submission and navigation
      }
  
      console.log("✅ Form submitted successfully:", formData);
      alert("Form submitted successfully!");
      navigate("./submit"); // ✅ Only navigate when validation passes
    }, 0); // Ensure validation state updates before navigating
  };
  





  if (!form) return <div className={styles.loading}>Loading form...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2 className={styles.formTitle}>{form.title}</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          {form.fields.map((field, index) => {
            const fieldKey = field.label.replace(/\s+/g, "_");
            return (
              <div key={index} className={styles.formGroup}>
                <label className={styles.label}>
                  {field.label} {field.required === "true" && <span style={{ color: "red" }}>*</span>}
                </label>
                <input
                  type={field.type}
                  name={fieldKey}
                  placeholder={field.placeholder}
                  className={styles.input}
                  value={formData[fieldKey]}
                  onChange={handleChange}
                />
                {errors[fieldKey] && <p className={styles.errorText}>{errors[fieldKey]}</p>}
              </div>
            );
          })}
          <button type="submit" className={styles.submitBtn}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Viewforms;
