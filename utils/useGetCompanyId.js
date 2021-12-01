import { useState } from 'react';

export const useGetCompanyId = () => {
    const [companyId, setCompanyId] = useState(null);

    const getCompanyId = () => {
        console.log('este es el id de la comáñia', sessionStorage.getItem("data"));
        if(sessionStorage.getItem("data")){
            setCompanyId(sessionStorage.getItem("data"));
        }
    }

    return {
        companyId,
        getCompanyId
    }
}