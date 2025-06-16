import React ,{useContext,useEffect, useState} from 'react'
import { CaptainDataContext } from '../context/CaptainContext';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const CaptainProtectedWrapper = ({
    children
}) => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const { captain, setCaptain } = useContext(CaptainDataContext);
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is logged in
    useEffect(() => {
        if (!token) {
            navigate('/captain-login'); // Redirect to login if not authenticated
        }
    }, [token]);

    // console.log("token",token);

    // Check if captain data is available
    axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then((response) => {
        if(response.status === 200) {
            setCaptain(response.data.captain); // Set captain data in context
            setIsLoading(false); // Set loading to false after fetching data
        }
    }).catch((error) => {
        console.error("Error fetching captain data:", error);
        localStorage.removeItem('token'); // Remove token if there's an error
        navigate('/captain-login'); // Redirect to login on error
    });


    if(isLoading) {
        return <div>Loading...</div>; // Show a loading state while checking authentication
    }

    return ( 
        <>
            {children}
        </>
    );
  
}

export default CaptainProtectedWrapper