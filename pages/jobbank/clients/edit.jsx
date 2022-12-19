import React from 'react';
import { withAuthSync } from '../../../libs/auth';
import AddOrEditClients from '../../../components/jobbank/clients/AddOrEditClients';

const edit = () => {
    return (
        <AddOrEditClients action='edit'/>
    )
}

export default withAuthSync(edit)