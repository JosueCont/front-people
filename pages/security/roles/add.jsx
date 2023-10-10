import React from 'react';
import { withAuthSync } from '../../../libs/auth';
import AddOrEditRoles from '../../../components/security/roles/AddOrEditRoles';

const add = () => {
    return (
        <AddOrEditRoles action='add'/>
    )
}

export default withAuthSync(add);