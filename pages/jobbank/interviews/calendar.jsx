import React from 'react';
import MainIndexJB from '../../../components/jobbank/MainIndexJB';
import CalendarView from '../../../components/jobbank/interviews/CalendarView';

const calendar = () => {

    return (
        <MainIndexJB
            pageKey='jb_interviews'
            extraBread={[
                {name: 'Entrevistas', URL: '/jobbank/interviews'},
                {name: 'Calendario'}
            ]}
        >
            <CalendarView/>
        </MainIndexJB>
    )
}

export default calendar