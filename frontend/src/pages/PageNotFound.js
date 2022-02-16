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
        <h1>Page Not Found</h1>
        <h3> Go to the home page: 
        <Link to="/"> Home Page</Link>
        </h3>
    </div>
  )
}

export default PageNotFound;
