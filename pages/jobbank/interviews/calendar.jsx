import React, { useEffect } from 'react';
import MainIndexJB from '../../../components/jobbank/MainIndexJB';
import CalendarView from '../../../components/jobbank/interviews/CalendarView';
import SearchInterviews from '../../../components/jobbank/interviews/SearchInterviews';
import {
    getCandidatesOptions,
    getVacanciesOptions,
    getInterviews
} from '../../../redux/jobBankDuck';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../libs/auth';
import { getPersonsCompany } from '../../../redux/UserDuck';
import { useRouter } from 'next/router';
import { getFiltersJB } from '../../../utils/functions';

const calendar = ({
    currentNode,
    getCandidatesOptions,
    getVacanciesOptions,
    getPersonsCompany,
    getInterviews
}) => {

    const router = useRouter();

    useEffect(()=>{
        if(currentNode){
            getCandidatesOptions(currentNode.id);
            getVacanciesOptions(currentNode.id);
            getPersonsCompany(currentNode.id);
            getInterviews(currentNode.id);
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
            <SearchInterviews isCalendar={true}/>
            <CalendarView/>
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
        getCandidatesOptions,
        getVacanciesOptions,
        getPersonsCompany,
        getInterviews
    }
)(withAuthSync(calendar));