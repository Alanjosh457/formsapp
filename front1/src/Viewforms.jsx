import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFormById } from "./services";
import styles from "./viewpage.module.css";

const Viewforms = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);

  useEffect(() => {
    getFormById(id)
      .then(setForm)
      .catch((error) => console.error("Error fetching form:", error));
  }, [id]);

  if (!form) return <div className={styles.loading}>Loading form...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2 className={styles.formTitle}>{form.title}</h2>
        <form className={styles.form}>
          {form.fields.map((field, index) => (
            <div key={index} className={styles.formGroup}>
              <label className={styles.label}>{field.label}</label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                className={styles.input}
              />
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
