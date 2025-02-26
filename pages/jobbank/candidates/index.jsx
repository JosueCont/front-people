import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../libs/auth';
import { useRouter } from 'next/router';
import SearchCandidates from '../../../components/jobbank/candidates/SearchCandidates';
import TableCandidates from '../../../components/jobbank/candidates/TableCandidates';
import {
    getCandidates,
    getMainCategories,
    getSubCategories,
    getSectors,
    getListStates
} from '../../../redux/jobBankDuck';
import { getFiltersJB } from '../../../utils/functions';
import MainIndexJB from '../../../components/jobbank/MainIndexJB';

const index = ({
    currentNode,
    getCandidates,
    getListStates,
    getMainCategories,
    getSubCategories,
    getSectors
}) => {

    const router = useRouter();

    useEffect(()=>{
        if(currentNode){
            getMainCategories(currentNode.id);
            getListStates(currentNode.id);
            getSectors(currentNode.id);
            getSubCategories(currentNode.id);
        }
    },[currentNode])

    useEffect(()=>{
        if(currentNode){
            let page = router.query.page ? parseInt(router.query.page) : 1;
            let size = router.query.size ? parseInt(router.query.size) : 10;
            let filters = getFiltersJB(router.query);
            getCandidates(currentNode.id, filters, page, size);
        }
    },[currentNode, router.query])

    return (
        <MainIndexJB
            pageKey='jb_candidates'
            extraBread={[{name: 'Candidatos'}]}
        >
            <SearchCandidates/>
            <TableCandidates/>
        </MainIndexJB>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node,
    }
}

export default connect(
    mapState,{
        getCandidates,
        getListStates,
        getMainCategories,
        getSubCategories,
        getSectors
    }
)(withAuthSync(index));