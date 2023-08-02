import React, { useEffect, useState } from 'react';
import { withAuthSync } from '../../../libs/auth';
import MainIndexTM from '../../../components/timeclock/MainIndexTM';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import SearchLogs from '../../../components/timeclock/logs/SearchLogs';
import TableLogs from '../../../components/timeclock/logs/TableLogs';
import {
    getLogsEvents,
    getCompanies,
    getWorkCentersOptions,
    setTimeclockFiltersData
} from '../../../redux/timeclockDuck';
import { getFiltersJB } from '../../../utils/functions';
import moment from 'moment';

const index = ({
    currentNode,
    currentUser,
    getLogsEvents,
    getCompanies,
    getWorkCentersOptions,
    setTimeclockFiltersData
}) => {

    const router = useRouter();

    useEffect(() => {
        if (!currentUser) return;
        let query = `?person=${currentUser?.id}`;
        getCompanies(query)
    }, [currentUser])

    useEffect(()=>{
        if(!currentNode) return;
        getWorkCentersOptions(currentNode?.id)
    },[currentNode])

    useEffect(() => {
        if (currentNode) {
            let page = router.query.page ? parseInt(router.query.page) : 1;
            let size = router.query.size ? parseInt(router.query.size) : 10;
            let filters = getFiltersJB(validFilters(), [], true);
            getLogsEvents(filters, page, size)
        }
    }, [currentNode, router.query])

    useEffect(() => {
        let valid = Object.keys(router.query).length <= 0;
        if(valid) setTimeclockFiltersData({}, false);
    }, [router.query])

    const validFilters = () =>{
        let node = router.query?.node;
        let params = {...router.query};
        params.node = node ? node : currentNode?.id;
        if(params.node == 'all') delete params.node;
        if(params.workcenter == 'all') delete params.workcenter;
        if(params.timestamp__date){
            let value = moment(params.timestamp__date, 'DD-MM-YYYY').format('YYYY-MM-DD');
            params.timestamp__date = value;
        }
        return params;
    }

    return (
        <MainIndexTM
            pageKey={["tm_logs"]}
            extraBread={[{ name: 'Logs de eventos' }]}
        >
            <SearchLogs />
            <TableLogs />
        </MainIndexTM>
    )
}

const mapState = (state) => {
    return {
        currentUser: state.userStore.user,
        currentNode: state.userStore.current_node,
    }
}

export default connect(
    mapState, {
    getLogsEvents,
    getCompanies,
    getWorkCentersOptions,
    setTimeclockFiltersData
}
)(withAuthSync(index));