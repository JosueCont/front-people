import React from 'react';
import { withAuthSync } from '../../../libs/auth';
import AddOrEditClients from '../../../components/jobbank/clients/AddOrEditClients';

const add = () => {
    return (
        <AddOrEditClients action='add'/>
    )
}

export default withAuthSync(add);