import React from 'react';
import { withAuthSync } from '../../../../libs/auth';
import AddOrEditConnections from '../../../../components/jobbank/connections/AddOrEditConnections';

const edit = () => {
    return (
        <AddOrEditConnections action='edit'/>
    )
}

export default withAuthSync(edit);