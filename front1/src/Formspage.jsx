import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getForms, deleteForm } from "./services";
import styles from "./formpage.module.css";
import penc from "./images/pencil.png";
import delbun from "./images/delebun.png";

const Formspage = () => {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    getForms()
      .then(setForms)
      .catch((error) => console.error("Error fetching forms:", error));
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteForm(id);
      setForms(forms.filter((form) => form._id !== id));
    } catch (error) {
      console.error("Error deleting form:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Form Builder</h1>
      <button className={styles.createFormBtn}>
        <Link to="/form/create">Create Form</Link>
      </button>
      <ul className={styles.formList}>
        {forms.map((form) => (
          <li key={form._id} className={styles.formItem}>
            <Link to={`/form/${form._id}`}>{form.title}</Link>
            
            <div className={styles.buttonContainer}>
    <Link to={`/form/${form._id}/edit`} className={styles.iconButton}>
      <img src={penc} alt="Edit" className={styles.icon} />
    </Link>

    <button onClick={() => handleDelete(form._id)} className={styles.iconButton}>
      <img src={delbun} alt="Delete" className={styles.icon} />
    </button>
  </div>
          
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Formspage;
