import React, { useEffect, useState } from 'react';
import { withAuthSync } from '../../../libs/auth';
import MainIndexTM from '../../../components/timeclock/MainIndexTM';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import SearchLogs from '../../../components/timeclock/logs/SearchLogs';
import TableLogs from '../../../components/timeclock/logs/TableLogs';
import { getLogsEvents } from '../../../redux/timeclockDuck';
import { getFiltersJB } from '../../../utils/functions';

const index = ({
    currentNode,
    currentUser,
    getLogsEvents
}) => {

    const router = useRouter();

    useEffect(()=>{
        let page = router.query.page ? parseInt(router.query.page) : 1;
        let size = router.query.size ? parseInt(router.query.size) : 10;
        let filters = getFiltersJB({ ...router.query });
        let params = `?is_deleted=false${filters}`;
        getLogsEvents(params, page, size)
    },[router.query])

    return (
        <MainIndexTM
            pageKey={["tm_logs"]}
            extraBread={[{ name: 'Logs de eventos' }]}
        >
            <SearchLogs/>
            <TableLogs/>
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
        getLogsEvents
    }
)(withAuthSync(index));