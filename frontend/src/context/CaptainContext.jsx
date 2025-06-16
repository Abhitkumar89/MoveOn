import React, { createContext, useState, useContext } from 'react';

// Create the context
export const CaptainDataContext = createContext();

// Create a custom hook to use the context
// export const useCaptain = () => {
//     const context = useContext(CaptainContext);
//     if (!context) {
//         throw new Error('useCaptain must be used within a CaptainProvider');
//     }
//     return context;
// };

// Create the provider component
const CaptainContext = ({ children }) => {
    const [captain, setCaptain] = useState(null);
    const [isLoading,setIsLoading] = useState(false);
    const [error,setError]=useState(null);

    const updateCaptain = (captainData) => {
        setCaptain(captainData);
    };

    const value = {
        captain,
        setCaptain,
        isLoading,
        setIsLoading,
        error,
        setError,
        updateCaptain
    };

    return (
        <CaptainDataContext.Provider value={value}>
            {children}
        </CaptainDataContext.Provider>
    );
};

export default CaptainContext;