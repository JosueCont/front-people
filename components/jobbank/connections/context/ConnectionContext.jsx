import React, { createContext } from 'react';

export const ConnectionContext = createContext();

export const ConnectionProvider = ({ children, ...props}) =>{
    return(
        <ConnectionContext.Provider value={{...props}}>
            {children}
        </ConnectionContext.Provider>
    )
}