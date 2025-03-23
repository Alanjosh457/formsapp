import React from 'react'
import styles from './sub.module.css'
import {  useNavigate } from "react-router-dom";
const Submission = () => {
const navigate=useNavigate()

  const home=()=>{
    navigate('/')
    e.preventDefault(); 
  }
  return (
<>
<center>
<h1>Your Response has been submitted</h1>

<div>
<button onClick={home} className={styles.homebtn}>Go Home</button>
  
  </div>
</center>

</>
  )
}

export default Submission