import React from 'react';
import { withAuthSync } from '../../../../../libs/auth';
import AddOrEditCatalog from '../../../../../components/jobbank/catalogs/AddOrEditCatalog';

const add = () => {
    return (
        <AddOrEditCatalog action='add'/>
    )
}

export default withAuthSync(add);