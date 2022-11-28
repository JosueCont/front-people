import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import AddOrEditTemplate from '../../../../../components/jobbank/catalogs/Templates/AddOrEditTemplate';

const add = () => {

    const router = useRouter();

    useEffect(()=>{
        router.prefetch('/jobbank/settings/catalogs/profiles/edit');
    },[])

    return (
        <AddOrEditTemplate action='add'/>
    )
}

export default add