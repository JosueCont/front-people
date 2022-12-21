import React, { useEffect } from 'react';
import { withAuthSync } from '../../../libs/auth';
import { useRouter } from 'next/router';
import AddOrEditClients from '../../../components/jobbank/clients/AddOrEditClients';

const add = () => {

    const router = useRouter();

    useEffect(()=>{
        router.prefetch('/jobbank/clients/edit');
    },[])

    return (
        <AddOrEditClients action='add'/>
    )
}

export default withAuthSync(add);