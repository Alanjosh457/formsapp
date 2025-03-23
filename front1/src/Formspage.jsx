import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getForms, deleteForm } from "./services";
import styles from "./formpage.module.css";
import penc from "./images/pencil.png";
import delbun from "./images/delebun.png";

const Formspage = () => {
  const [forms, setForms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(null);

  useEffect(() => {
    getForms()
      .then(setForms)
      .catch((error) => console.error("Error fetching forms:", error));
  }, []);

  const handleDeleteClick = (id) => {
    setSelectedFormId(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteForm(selectedFormId);
      setForms(forms.filter((form) => form._id !== selectedFormId));
      setIsModalOpen(false);
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

      {/* Conditional Rendering for No Forms */}
      {forms.length === 0 ? (
        <p className={styles.noFormsText}>No forms here yet.</p>
      ) : (
        <ul className={styles.formList}>
          {forms.map((form) => (
            <li key={form._id} className={styles.formItem}>
              <Link to={`/form/${form._id}`}>{form.title}</Link>

              <div className={styles.buttonContainer}>
                <Link to={`/form/${form._id}/edit`} className={styles.iconButton}>
                  <img src={penc} alt="Edit" className={styles.icon} />
                </Link>

                <button onClick={() => handleDeleteClick(form._id)} className={styles.iconButton}>
                  <img src={delbun} alt="Delete" className={styles.icon} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Are you sure you want to delete this form?</h3>
            <div className={styles.modalButtons}>
              <button onClick={handleConfirmDelete} className={styles.confirmBtn}>Yes, Delete</button>
              <button onClick={() => setIsModalOpen(false)} className={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Formspage;
