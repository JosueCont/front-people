import React from 'react';
import { withAuthSync } from '../../../libs/auth';
import AddOrEditPublication from '../../../components/jobbank/publications/AddOrEditPublication';

const add = () => {
    return (
        <AddOrEditPublication action='add'/>
    )
}

export default withAuthSync(add);