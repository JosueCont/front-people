import React from 'react';
import MainKuiz from '../MainKuiz';
import DetailsAssessment from './DetailsAssessment';

const AddOrEditAssessment = ({
    action = 'add'
}) => {

    const ExtraBread = [
        {name: 'Evaluaciones', URL: '/kuiz/assessments'},
        {name: action == 'add' ? 'Registrar' : 'Editar'}
    ]

    return (
        <MainKuiz
            pageKey='surveys'
            extraBread={ExtraBread}
        >
            <DetailsAssessment action={action}/>
        </MainKuiz>
    )
}

export default AddOrEditAssessment