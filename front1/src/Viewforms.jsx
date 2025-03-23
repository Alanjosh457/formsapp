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
        if (!fetchedForm || !fetchedForm.fields) {
          console.error("Invalid form data:", fetchedForm);
          return;
        }

        setForm(fetchedForm);
        const initialData = {};
        const initialErrors = {};

        fetchedForm.fields.forEach((field) => {
          const fieldKey = field.label.replace(/\s+/g, "_");
          initialData[fieldKey] = "";
          if (["true", true, "1"].includes(field.required)) {
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
      const isRequired = ["true", true, "1"].includes(field.required);

      if (isRequired && !value) {
        newErrors[fieldKey] = "This field is required.";
        isValid = false;
      }

      if (field.type === "email" && value && !/^\S+@\S+\.\S+$/.test(value)) {
        newErrors[fieldKey] = "Enter a valid email address.";
        isValid = false;
      }

      if (field.type === "number" && value && isNaN(value)) {
        newErrors[fieldKey] = "Enter a valid number.";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fill in all required fields before submitting.");
      return;
    }

    console.log("✅ Form submitted successfully:", formData);
    alert("Form submitted successfully!");
    navigate("./submit");
  };

  if (!form) return <div className={styles.loading}>Loading form...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2 className={styles.formTitle}>{form.title}</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          {form.fields.map((field, index) => {
            const fieldKey = field.label.replace(/\s+/g, "_");
            const isRequired = ["true", true, "1"].includes(field.required);

            return (
              <div key={index} className={styles.formGroup}>
                <label className={styles.label}>
                  {field.label} {isRequired && <span className={styles.requiredIcon}>*</span>}
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
