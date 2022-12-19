import React from 'react';
import { withAuthSync } from '../../../libs/auth';
import AddorEditProfile from '../../../components/jobbank/profiles/AddorEditProfile';

const edit = () => {
    return (
        <AddorEditProfile action='edit'/>
    )
}

export default withAuthSync(edit);