import React from 'react';
import { withAuthSync } from '../../../../../libs/auth';
import AddOrEditCatalog from '../../../../../components/jobbank/catalogs/AddOrEditCatalog';

const edit = () => {
    return (
        <AddOrEditCatalog action='edit'/>
    )
}

export default withAuthSync(edit);