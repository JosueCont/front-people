import React from 'react';
import { withAuthSync } from '../../../libs/auth';
import AddOrEditCenter from '../../../components/timeclock/centers/AddOrEditCenter';

const add = () => {
    return (
        <AddOrEditCenter action='add'/>
    )
}

export default withAuthSync(add);