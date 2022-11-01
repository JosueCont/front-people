import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import AddorEditProfile from '../../../components/jobbank/profiles/AddorEditProfile';

const add = () => {

    const router = useRouter();

    useEffect(()=>{
        router.prefetch('/jobbank/profiles/edit');
    },[])

    return (
        <AddorEditProfile action='add'/>
    )
}

export default add