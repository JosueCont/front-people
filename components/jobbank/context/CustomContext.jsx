import React, { createContext } from 'react';

export const CustomContext = createContext();

export const CustomProvider = ({ children, ...props}) =>{
    return(
        <CustomContext.Provider value={{...props}}>
            {children}
        </CustomContext.Provider>
    )
}