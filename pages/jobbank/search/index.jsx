import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import SearchVacants from '../../../components/jobbank/search/SearchVacants';
import {
    getMainCategories,
    getListStates,
    getVacanciesSearch
} from '../../../redux/jobBankDuck';
import { useRouter } from 'next/router';
import { getFiltersJB } from '../../../utils/functions';
import MainSearch from '../../../components/jobbank/search/MainSearch';

const index = ({
    currentNode,
    getMainCategories,
    getListStates,
    getVacanciesSearch
}) => {

    const router = useRouter();

    useEffect(() => {
        if (!currentNode) return;
        getMainCategories(currentNode?.id)
        getListStates(currentNode?.id)
    }, [currentNode])

    useEffect(() => {
        if (!currentNode) return;
        let page = router.query.page ? parseInt(router.query.page) : 1;
        let filters = getFiltersJB({ ...router.query }, ['page']);
        let params = `${filters}&page=${page}`;
        getVacanciesSearch(currentNode.id, params, page);
    }, [currentNode, router.query])

    return (
        <MainSearch>
            <SearchVacants />
        </MainSearch>
    )
}

const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node
    }
}

export default connect(
        mapState, {
        getMainCategories,
        getListStates,
        getVacanciesSearch
    }
)(index);