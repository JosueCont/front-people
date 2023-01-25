import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../libs/auth';
import MainIndexJB from '../../../components/jobbank/MainIndexJB';
import SearchInterviews from '../../../components/jobbank/interviews/SearchInterviews';
import TableInterviews from '../../../components/jobbank/interviews/TableInterviews';
import {
    getCandidatesOptions,
    getVacanciesOptions,
    getInterviews,
    getSelectionOpions,
    getClientsOptions,
    getConnectionsOptions
} from '../../../redux/jobBankDuck';
import { getPersonsCompany } from '../../../redux/UserDuck';
import { useRouter } from 'next/router';
import { getFiltersJB } from '../../../utils/functions';
import { InterviewProvider } from '../../../components/jobbank/context/InterviewContext';

const index = ({
    currentNode,
    getCandidatesOptions,
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
            getCandidatesOptions(currentNode.id);
            getVacanciesOptions(currentNode.id);
            getPersonsCompany(currentNode.id);
            getSelectionOpions(currentNode.id);
            getClientsOptions(currentNode.id);
            getConnectionsOptions(currentNode.id, '&code=GC');
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
            extraBread={[{name: 'Entrevistas'}]}
        >
            <InterviewProvider>
                <SearchInterviews/>
                <TableInterviews/>
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
        getCandidatesOptions,
        getVacanciesOptions,
        getPersonsCompany,
        getInterviews,
        getSelectionOpions,
        getClientsOptions,
        getConnectionsOptions
    }
)(withAuthSync(index));