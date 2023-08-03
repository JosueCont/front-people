import React, { useEffect } from 'react';
import MainIndexJB from '../../../components/jobbank/MainIndexJB';
import CalendarView from '../../../components/jobbank/interviews/CalendarView';
import SearchInterviews from '../../../components/jobbank/interviews/SearchInterviews';
import {
    getVacanciesOptions,
    getInterviews,
    getSelectionOpions,
    getClientsOptions,
    getConnectionsOptions,
    setJobbankFiltersData
} from '../../../redux/jobBankDuck';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../libs/auth';
import { useRouter } from 'next/router';
import { getFiltersJB } from '../../../utils/functions';
import { InterviewProvider } from '../../../components/jobbank/context/InterviewContext';
import moment from 'moment';

const calendar = ({
    currentNode,
    getVacanciesOptions,
    getInterviews,
    getSelectionOpions,
    getClientsOptions,
    getConnectionsOptions,
    setJobbankFiltersData
}) => {

    const router = useRouter();
    const discard = ['type', 'view', 'mth'];
    const watchQuerys = [
        router.query?.year,
        router.query?.customer,
        router.query?.vacant,
        router.query?.recruiter,
        router.query?.candidate
    ];

    useEffect(() => {
        if (currentNode) {
            getVacanciesOptions(currentNode.id);
            getSelectionOpions(currentNode.id);
            getConnectionsOptions(currentNode.id, '&code=GC');
            getClientsOptions(currentNode.id)
        }
    }, [currentNode])

    useEffect(() => {
        let valid = Object.keys(router.query).length <= 0;
        if(valid) setJobbankFiltersData({}, false);
    }, [router.query])

    useEffect(() => {
        if (currentNode) {
            let year = router.query?.year ? parseInt(router.query.year) : moment().year();
            let filters = getFiltersJB({ ...router.query, year }, discard);
            getInterviews(currentNode.id, filters)
        }
    }, [currentNode, ...watchQuerys])

    return (
        <MainIndexJB
            pageKey='jb_interviews'
            extraBread={[{ name: 'Entrevistas' }]}
        >
            <InterviewProvider>
                <SearchInterviews />
                <CalendarView />
            </InterviewProvider>
        </MainIndexJB>
    )
}

const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node,
    }
}

export default connect(
    mapState, {
    getVacanciesOptions,
    getInterviews,
    getSelectionOpions,
    getClientsOptions,
    getConnectionsOptions,
    setJobbankFiltersData
}
)(withAuthSync(calendar));