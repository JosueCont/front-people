import React, { useEffect, useState } from 'react';
import { withAuthSync } from '../../../libs/auth';
import MainIndexTM from '../../../components/timeclock/MainIndexTM';
import SearchCenters from '../../../components/timeclock/centers/SearchCenters';
import TableCenters from '../../../components/timeclock/centers/TableCenters';
import { getWorkCenters, getCompanies } from '../../../redux/timeclockDuck';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { getFiltersJB } from '../../../utils/functions';

const index = ({
    currentNode,
    currentUser,
    getWorkCenters,
    getCompanies
}) => {

    const router = useRouter();

    useEffect(() => {
        if (!currentUser) return;
        let query = `?person=${currentUser?.id}`;
        getCompanies(query)
    }, [currentUser])

    useEffect(() => {
        if (currentNode) {
            let page = router.query?.page ? parseInt(router.query?.page) : 1;
            let size = router.query.size ? parseInt(router.query.size) : 10;
            let filters = getFiltersJB(validFilters());
            let params = `?is_deleted=false${filters}`;
            getWorkCenters(params, page, size)
        }
    }, [currentNode, router.query])

    const validFilters = () => {
        let params = { ...router.query };
        params.node = router.query?.node
            ? router.query?.node : currentNode?.id;
        if (params.node == 'all') delete params.node;
        return params;
    }

    return (
        <MainIndexTM
            pageKey={["tm_centers"]}
            extraBread={[{ name: 'Centros de trabajo' }]}
        >
            <SearchCenters />
            <TableCenters />
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
    getWorkCenters,
    getCompanies
}
)(withAuthSync(index));