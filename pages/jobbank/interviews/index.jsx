import React, { useEffect } from 'react';
import MainIndexJB from '../../../components/jobbank/MainIndexJB';
import CalendarView from '../../../components/jobbank/interviews/CalendarView';
import SearchInterviews from '../../../components/jobbank/interviews/SearchInterviews';
import {
    getCandidatesOptions,
    getVacanciesOptions,
    getInterviews,
    getSelectionOpions,
    getClientsOptions,
    getConnectionsOptions
} from '../../../redux/jobBankDuck';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../libs/auth';
import { useRouter } from 'next/router';
import { getFiltersJB } from '../../../utils/functions';
import { InterviewProvider } from '../../../components/jobbank/context/InterviewContext';
import moment from 'moment';

const calendar = ({
    currentNode,
    getCandidatesOptions,
    getVacanciesOptions,
    getInterviews,
    getSelectionOpions,
    getClientsOptions,
    getConnectionsOptions
}) => {

    const router = useRouter();
    const discard = ['type','view','mth'];
    const watchQuerys = [
        router.query?.year,
        router.query?.customer,
        router.query?.vacant,
        router.query?.recruiter,
        router.query?.candidate
    ];

    useEffect(()=>{
        if(currentNode){
            getCandidatesOptions(currentNode.id);
            getVacanciesOptions(currentNode.id);
            getSelectionOpions(currentNode.id);
            getConnectionsOptions(currentNode.id, '&code=GC');
            getClientsOptions(currentNode.id)
        }
    },[currentNode])

    useEffect(()=>{
        if(currentNode){
            let year = router.query?.year ? parseInt(router.query.year) : moment().year();
            let filters = getFiltersJB({...router.query, year}, discard);
            getInterviews(currentNode.id, filters)
        }
    },[currentNode, ...watchQuerys])

    return (
        <MainIndexJB
            pageKey='jb_interviews'
            extraBread={[{name: 'Entrevistas'}]}
        >
            <InterviewProvider>
                <SearchInterviews/>
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
        getCandidatesOptions,
        getVacanciesOptions,
        getInterviews,
        getSelectionOpions,
        getClientsOptions,
        getConnectionsOptions
    }
)(withAuthSync(calendar));

// import React, { useEffect, useState } from 'react';
// import { connect } from 'react-redux';
// import { withAuthSync } from '../../../libs/auth';
// import MainIndexJB from '../../../components/jobbank/MainIndexJB';
// import SearchInterviews from '../../../components/jobbank/interviews/SearchInterviews';
// import TableInterviews from '../../../components/jobbank/interviews/TableInterviews';
// import {
//     getCandidatesOptions,
//     getVacanciesOptions,
//     getInterviews,
//     getSelectionOpions,
//     getClientsOptions,
//     getConnectionsOptions
// } from '../../../redux/jobBankDuck';
// import { getPersonsCompany } from '../../../redux/UserDuck';
// import { useRouter } from 'next/router';
// import { getFiltersJB } from '../../../utils/functions';
// import { InterviewProvider } from '../../../components/jobbank/context/InterviewContext';

// const index = ({
//     currentNode,
//     getCandidatesOptions,
//     getVacanciesOptions,
//     getPersonsCompany,
//     getInterviews,
//     getSelectionOpions,
//     getClientsOptions,
//     getConnectionsOptions
// }) => {

//     const router = useRouter();

//     useEffect(()=>{
//         if(currentNode){
//             getCandidatesOptions(currentNode.id);
//             getVacanciesOptions(currentNode.id);
//             getPersonsCompany(currentNode.id);
//             getSelectionOpions(currentNode.id);
//             getClientsOptions(currentNode.id);
//             getConnectionsOptions(currentNode.id, '&code=GC');
//         }
//     },[currentNode])

//     useEffect(()=>{
//         if(currentNode){
//             let page = router.query.page ? parseInt(router.query.page) : 1;
//             let filters = getFiltersJB(router.query);
//             getInterviews(currentNode.id, filters, page)
//         }
//     },[currentNode, router.query])

//     return (
//         <MainIndexJB
//             pageKey='jb_interviews'
//             extraBread={[{name: 'Entrevistas'}]}
//         >
//             <InterviewProvider>
//                 <SearchInterviews/>
//                 <TableInterviews/>
//             </InterviewProvider>
//         </MainIndexJB>
//     )
// }

// const mapState = (state) => {
//     return{
//         currentNode: state.userStore.current_node,
//     }
// }

// export default connect(
//     mapState, {
//         getCandidatesOptions,
//         getVacanciesOptions,
//         getPersonsCompany,
//         getInterviews,
//         getSelectionOpions,
//         getClientsOptions,
//         getConnectionsOptions
//     }
// )(withAuthSync(index));