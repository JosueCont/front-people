import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { withAuthSync } from '../../../libs/auth';
import MainIndexJB from '../../../components/jobbank/MainIndexJB';
import SearchPreselection from '../../../components/jobbank/preselection/SearchPreselection';
import TablePreselection from '../../../components/jobbank/preselection/TablePreselection';
import {
    getMainCategories,
    getListStates,
    getScholarship,
    getPreselection,
    getVacanciesOptions
} from '../../../redux/jobBankDuck';
import { getFiltersJB } from '../../../utils/functions';

const index = ({
    currentNode,
    getMainCategories,
    getListStates,
    getScholarship,
    getPreselection,
    getVacanciesOptions
}) =>{

    const router = useRouter();

    useEffect(()=>{
        if(currentNode){
            getMainCategories(currentNode.id)
            getListStates(currentNode.id)
            getScholarship(currentNode.id)
            getVacanciesOptions(currentNode.id, '&status=1&has_strategy=1')
        }
    },[currentNode])

    useEffect(()=>{
        if(currentNode){
            let page = router.query?.page ? parseInt(router.query?.page) : 1;
            let size = router.query.size ? parseInt(router.query.size) : 10;
            let applyMatch = router.query?.applyMatch ?? '1';
            let filters = getFiltersJB({...router.query, applyMatch});
            getPreselection(currentNode.id, filters, page, size)
        }
    },[currentNode, router.query])

    return(
        <MainIndexJB
            pageKey='jb_preselection'
            extraBread={[{name: 'Preseleción'}]}
        >
            <SearchPreselection/>
            <TablePreselection/>
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
        getMainCategories,
        getListStates,
        getScholarship,
        getPreselection,
        getVacanciesOptions
    }
)(withAuthSync(index));