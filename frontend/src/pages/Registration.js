import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from "axios";
import { useNavigate } from 'react-router-dom'

function Registration() {
    const initialValues = {
        username: "",
        password: "",
    }

    const validationSchema = Yup.object().shape({
        username: Yup.string().min(3).max(30).required(),
        password: Yup.string().min(4).max(20).required(),
    })

    let navigate = useNavigate()

    const onSubmit = (data) => {
        axios.post("http://localhost:3001/auth", data).then(() => {
            navigate('/login')
        })
    }

  return (
    <div>
      <Formik 
        initialValues={initialValues} 
        onSubmit={onSubmit} 
        validationSchema={validationSchema}
        >

        <Form className='formContainer'>
            <label>Pseudo: </label>
            <ErrorMessage name='username' component="span" />
            <Field 
            className="inputCreatePost" 
            name="username" 
            placeholder="(Votre pseudo)" 
            />

            <label>Mot de passe: </label>
            <ErrorMessage name='password' component="span" />
            <Field 
            type="password"
            className="inputCreatePost" 
            name="password" 
            placeholder="(Votre mot de passe)" 
            />

            <button type='submit'>S'inscrire</button>
        </Form>
     </Formik>
    </div>
  )
}

export default Registration;
