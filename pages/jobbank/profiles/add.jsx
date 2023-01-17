import React from 'react';
import { withAuthSync } from '../../../libs/auth';
import AddorEditProfile from '../../../components/jobbank/profiles/AddorEditProfile';

const add = () => {
    return (
        <AddorEditProfile action='add'/>
    )
}

export default withAuthSync(add);