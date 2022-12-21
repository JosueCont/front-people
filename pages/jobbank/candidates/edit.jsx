import React from 'react';
import { withAuthSync } from '../../../libs/auth';
import AddOrEditCandidates from '../../../components/jobbank/candidates/AddOrEditCandidates';

const edit = () => {
    return (
        <AddOrEditCandidates action='edit'/>
    )
}

export default withAuthSync(edit);