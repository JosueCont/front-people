import React from 'react';
import { withAuthSync } from '../../../../../libs/auth';
import AddOrEditTemplate from '../../../../../components/jobbank/catalogs/Templates/AddOrEditTemplate';

const edit = () => {
    return (
        <AddOrEditTemplate action='edit'/>
    )
}

export default withAuthSync(edit);