import React, { useEffect } from 'react';
import MainIndexJB from '../../../components/jobbank/MainIndexJB';
import CalendarView from '../../../components/jobbank/interviews/CalendarView';
import SearchInterviews from '../../../components/jobbank/interviews/SearchInterviews';
import {
    getVacanciesOptions,
    getInterviews,
    getSelectionOpions,
    getClientsOptions,
    getConnectionsOptions
} from '../../../redux/jobBankDuck';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../libs/auth';
import { getPersonsCompany } from '../../../redux/UserDuck';
import { useRouter } from 'next/router';
import { getFiltersJB } from '../../../utils/functions';
import { InterviewProvider } from '../../../components/jobbank/context/InterviewContext';

const calendar = ({
    currentNode,
    getVacanciesOptions,
    getPersonsCompany,
    getInterviews,
    getSelectionOpions,
    getClientsOptions,
    getConnectionsOptions
}) => {

    const router = useRouter();

    useEffect(()=>{
        if(currentNode){
            getVacanciesOptions(currentNode.id);
            getPersonsCompany(currentNode.id);
            getSelectionOpions(currentNode.id);
            getConnectionsOptions(currentNode.id, '&code=GC');
            getClientsOptions(currentNode.id)
        }
    },[currentNode])

    useEffect(()=>{
        if(currentNode){
            let page = router.query.page ? parseInt(router.query.page) : 1;
            let filters = getFiltersJB(router.query);
            getInterviews(currentNode.id, filters, page)
        }
    },[currentNode, router.query])

    return (
        <MainIndexJB
            pageKey='jb_interviews'
            extraBread={[
                {name: 'Entrevistas', URL: '/jobbank/interviews'},
                {name: 'Calendario'}
            ]}
        >
            <InterviewProvider>
                <SearchInterviews isCalendar={true}/>
                <CalendarView/>
            </InterviewProvider>
        </MainIndexJB>
    )
}

const mapState = (state) => {
    return{
        currentNode: state.userStore.current_node,
    }
}

export default connect(
    mapState, {
        getVacanciesOptions,
        getPersonsCompany,
        getInterviews,
        getSelectionOpions,
        getClientsOptions,
        getConnectionsOptions
    }
)(withAuthSync(calendar));