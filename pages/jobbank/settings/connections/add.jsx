import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { withAuthSync } from '../../../../libs/auth';
import AddOrEditConnections from '../../../../components/jobbank/connections/AddOrEditConnections';

const add = () => {

    const router = useRouter();

    useEffect(()=>{
        router.prefetch('/jobbank/connections/edit');
    },[])

    return (
        <AddOrEditConnections action='add'/>
    )
}

export default withAuthSync(add);