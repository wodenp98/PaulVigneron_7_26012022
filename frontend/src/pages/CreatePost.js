import React, { useEffect, useState }from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';




function CreatePost() {

    let navigate = useNavigate();
    
    // Valeur initiale des champs
    const initialValues = {
        title: "",
        postText: "",
    }

    useEffect(() => {
        // Si accessToken est false --> page login
        if (!localStorage.getItem("accessToken")) {
            navigate('/login')
        }
        // eslint-disable-next-line
    }, [navigate])

    // Restriction des champs
    const validationSchema = Yup.object().shape({
        title: Yup.string().required("You must input a Title!"),
        postText: Yup.string().required(),

    })

    // State du nom du fichier
    const [file, setFile] = useState(null);

    // Envoie les données du formulaires avec data titre et corps
    const onSubmit = (data) => {  
        // données de l'image
        const formData = new FormData()
        // ajoute le nom du fichier
        formData.append('photo', file)
        // titre
        formData.append('title', data.title)
        // corps
        formData.append('postText', data.postText)

        axios.post("http://localhost:3001/posts", formData, {
            headers: {
                accessToken: localStorage.getItem('accessToken'),
                'content-type': 'multipart/form-data'
            }
        }).then((response) => {
            // on va sur la page home
          navigate('/');
            })
            .catch((err) => {
                console.log('err', err)
            })      
    }

    // met à jour le state avec le nom du fichier
    const onInputChange = (e) => {
        setFile(e.target.files[0])
    }
     
    
  return (
  <div className='createPostPage'> 
    <Formik 
        // valeurs initiales
        initialValues={initialValues} 
        // fonction au click de l'envoie des données
        onSubmit={onSubmit} 
        // restriction des champs
        validationSchema={validationSchema}
        >

        <Form className='formContainer'>
            <label>Titre: </label>
            <ErrorMessage name='title' component="span" />
            <Field 
            // Pas d'historique
            autoComplete="off"
            className="inputCreatePost" 
            // Champ de la base de données
            name="title" 
            // description
            placeholder="(Ex: Votre Titre)" 
            />

            <label>Post: </label>
            <ErrorMessage name='postText' component="span" />
            <Field 
            autoComplete="off"
            className="inputCreatePost" 
            name="postText" 
            placeholder="(Ex: Votre post)" 
            />
            {/* envoie de la photo dans le back */}
            <input type="file" name="photo" onChange={onInputChange}/>
            <button type='submit'>Publier</button>
        </Form>
    </Formik>
    
    </div>
    );
}

export default CreatePost;
