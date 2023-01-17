import React from 'react';
import { withAuthSync } from '../../../libs/auth';
import AddOrEditCandidates from '../../../components/jobbank/candidates/AddOrEditCandidates';

const add = () => {
    return (
        <AddOrEditCandidates action='add'/>
    )
}

export default withAuthSync(add);