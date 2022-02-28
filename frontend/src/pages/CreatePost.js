import React, { useEffect, useState }from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';




function CreatePost() {

    let navigate = useNavigate();
    
    const initialValues = {
        title: "",
        postText: "",
    }

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            navigate('/login')
        }
        // eslint-disable-next-line
    }, [navigate])

    const validationSchema = Yup.object().shape({
        title: Yup.string().required("You must input a Title!"),
        postText: Yup.string().required(),

    })

    const [file, setFile] = useState(null);

    const onSubmit = (data) => {  
        const formData = new FormData()
        formData.append('photo', file)
        formData.append('title', data.title)
        formData.append('postText', data.postText)

        axios.post("http://localhost:3001/posts", formData, {
            headers: {
                accessToken: localStorage.getItem('accessToken'),
                'content-type': 'multipart/form-data'
            }
        }).then((response) => {
          navigate('/');
            })
            .catch((err) => {
                console.log('err', err)
            })      
    }

    const onInputChange = (e) => {
        setFile(e.target.files[0])
    }
     
    
  return (
  <div className='createPostPage'> 
    <Formik 
        initialValues={initialValues} 
        onSubmit={onSubmit} 
        validationSchema={validationSchema}
        >

        <Form className='formContainer'>
            <label>Titre: </label>
            <ErrorMessage name='title' component="span" />
            <Field 
            id="inputCreatePost" 
            name="title" 
            placeholder="(Ex: Votre Titre)" 
            />

            <label>Post: </label>
            <ErrorMessage name='postText' component="span" />
            <Field 
            id="inputCreatePost" 
            name="postText" 
            placeholder="(Ex: Votre post)" 
            />
            <input type="file" name="photo" onChange={onInputChange}/>
            <button type='submit'>Publier</button>
        </Form>
    </Formik>
    
    </div>
    );
}

export default CreatePost;
