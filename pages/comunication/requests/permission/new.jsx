import React from 'react';
import { withAuthSync } from '../../../../libs/auth';
import AddOrEditPermission from '../../../../components/comunication/permission/AddOrEditPermission';

const index = () => {
    return (
        <AddOrEditPermission action='add'/>
    )
}

export default withAuthSync(index)