import React, { useEffect, useState } from 'react';
import { withAuthSync } from '../../../libs/auth';
import MainIndexTM from '../../../components/timeclock/MainIndexTM';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import SearchLogs from '../../../components/timeclock/logs/SearchLogs';
import TableLogs from '../../../components/timeclock/logs/TableLogs';
import { getLogsEvents, getCompanies, getWorkCentersOptions } from '../../../redux/timeclockDuck';
import { getFiltersJB } from '../../../utils/functions';
import moment from 'moment';

const index = ({
    currentNode,
    currentUser,
    getLogsEvents,
    getCompanies,
    getWorkCentersOptions
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
            let params = {...router.query};
            let page = params.page ? parseInt(params.page) : 1;
            let size = params.size ? parseInt(router.query.size) : 10;
            let node = params.node ? params.node : currentNode?.id;
            let filters = getFiltersJB(validFilters(), ['node']);
            getLogsEvents(node, filters, page, size)
        }
    }, [currentNode, router.query])

    const validFilters = () =>{
        let params = {...router.query};
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
    getWorkCentersOptions
}
)(withAuthSync(index));