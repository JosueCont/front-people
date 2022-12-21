import React, { useEffect } from 'react';
import { withAuthSync } from '../../../libs/auth';
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

export default withAuthSync(add);