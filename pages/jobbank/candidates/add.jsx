import React, { useEffect } from 'react';
import { withAuthSync } from '../../../libs/auth';
import { useRouter } from 'next/router';
import AddOrEditCandidates from '../../../components/jobbank/candidates/AddOrEditCandidates';

const add = () => {

    const router = useRouter();

    useEffect(()=>{
        router.prefetch('/jobbank/candidates/edit');
    },[])

    return (
        <AddOrEditCandidates action='add'/>
    )
}

export default withAuthSync(add);