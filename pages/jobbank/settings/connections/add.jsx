import React from 'react';
import { withAuthSync } from '../../../../libs/auth';
import AddOrEditConnections from '../../../../components/jobbank/connections/AddOrEditConnections';

const add = () => {
    return (
        <AddOrEditConnections action='add'/>
    )
}

export default withAuthSync(add);