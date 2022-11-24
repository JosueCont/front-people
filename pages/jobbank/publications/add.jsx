import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import AddOrEditPublication from '../../../components/jobbank/publications/AddOrEditPublication';

const add = () => {

    const router = useRouter();

    useEffect(()=>{
        router.prefetch('/jobbank/publications/edit');
    },[])

    return (
        <AddOrEditPublication action='add'/>
    )
}

export default add