import React from 'react';
import { withAuthSync } from '../../../libs/auth';
import AddOrEditAssessment from '../../../components/kuiz/assessments/AddOrEditAssessment';

const add = () => {
    return (
        <AddOrEditAssessment action='add'/>
    )
}

export default withAuthSync(add);