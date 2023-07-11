import React, {
    useEffect,
    useState,
    createContext
} from 'react';

export const PeopleContext = createContext();

export const PeopleProvider = ({children}) => {

    const [itemsKeys, setItemsKeys] = useState([]);
    const [itemsSelected, setItemsSelected] = useState([]);

    const propsProvider = {
        itemsKeys,
        itemsSelected
    }

    return (
        <PeopleContext.Provider value={propsProvider}>
            {children}
            
        </PeopleContext.Provider>
    )
}