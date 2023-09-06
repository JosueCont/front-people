import React, { useEffect, useState } from 'react';
import SearchHistory from './SearchHistory';
import Tablehistory from './Tablehistory';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import { getFiltersJB } from '../../../../utils/functions';
import {
    getPlacesHistory,
    getPlacesOptions
} from '../../../../redux/OrgStructureDuck';

const MainHistory = ({
    catalog,
    newFilters,
    getPlacesHistory,
    getPlacesOptions
}) => {

    const router = useRouter();

    useEffect(()=>{
        getPlacesOptions()
    },[])

    useEffect(() => {
        let page = router.query.page ? parseInt(router.query.page) : 1;
        let size = router.query.size ? parseInt(router.query.size) : 10;
        let filters = getFiltersJB(validFilters(), ['catalog'], true);
        getPlacesHistory(filters, page, size);
    }, [router.query])

    const validFilters = () => {
        let filters = { ...router.query };
        if(!filters.is_current) filters.is_current = 'true';
        return filters;
    }

    return (
        <>
            <SearchHistory
                title={catalog?.name}
                newFilters={newFilters}
            />
            <Tablehistory newFilters={newFilters} />
        </>
    )
}

const mapState = (state) => {
    return {
        currentUser: state.userStore.user,
        currentNode: state.userStore.current_node,
        org_page: state.orgStore.org_page,
        org_filters: state.orgStore.org_filters,
        org_page_size: state.orgStore.org_page_size
    }
}

export default connect(
    mapState, {
    getPlacesHistory,
    getPlacesOptions
})(MainHistory);