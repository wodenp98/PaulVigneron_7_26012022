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
      // Controle des données des champs
        username: Yup.string().min(3, '3 caractères minimum').max(30, '30 caractères maximum').required(),
        password: Yup.string().min(4, '4 caractères minimum').max(20, '20 caractères maximum').required(),
    })

    let navigate = useNavigate()

    // Envoie les données puis redirige vers login après la création du compte
    const onSubmit = (data) => {
        axios.post("http://localhost:3001/auth", data).then(() => {
            navigate('/login')
        })
    }

  return (
    <div>
      <Formik 
      // valeurs initiales du formulaires
        initialValues={initialValues} 
        // fonction à la soumission du formulaire
        onSubmit={onSubmit} 
        // vérification des champs
        validationSchema={validationSchema}
        >

        <Form className='formContainer'>
            <label>Pseudo: </label>
            <ErrorMessage name='username' component="span" />
            <Field 
            autoComplete="off"
            className="inputCreatePost" 
            name="username" 
            placeholder="(Votre pseudo)" 
            />

            <label>Mot de passe: </label>
            <ErrorMessage name='password' component="span" />
            <Field 
            autoComplete="off"
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
