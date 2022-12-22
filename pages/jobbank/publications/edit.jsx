import React from 'react';
import { withAuthSync } from '../../../libs/auth';
import AddOrEditPublication from '../../../components/jobbank/publications/AddOrEditPublication';

const edit = () => {
    return (
        <AddOrEditPublication action='edit'/>
    )
}

export default withAuthSync(edit);