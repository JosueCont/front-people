import React from 'react';
import { withAuthSync } from '../../../libs/auth';
import AddOrEditRoles from '../../../components/security/roles/AddOrEditRoles';

const edit = () => {
    return (
        <AddOrEditRoles action='edit'/>
    )
}

export default withAuthSync(edit);