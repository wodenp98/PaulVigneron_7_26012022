import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

function PageNotFound() {
  let navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate('/login')
    } 
  })

  return  (  
    <div className='pageNotFound'>
        <h1>Page non trouvé</h1>
        <Link to="/">Retour à la page d'accueil</Link>
    </div>
  )
}

export default PageNotFound;
