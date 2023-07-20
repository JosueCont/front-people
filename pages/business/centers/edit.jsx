import React from 'react';
import { withAuthSync } from '../../../libs/auth';
import AddOrEditCenter from '../../../components/business/centers/AddOrEditCenter';

const add = () => {
    return (
        <AddOrEditCenter action='edit'/>
    )
}

export default withAuthSync(add);