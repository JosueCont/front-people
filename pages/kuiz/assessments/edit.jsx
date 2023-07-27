import React from 'react';
import { withAuthSync } from '../../../libs/auth';
import AddOrEditAssessment from '../../../components/kuiz/assessments/AddOrEditAssessment';

const edit = () => {
    return (
        <AddOrEditAssessment action='edit'/>
    )
}

export default withAuthSync(edit);