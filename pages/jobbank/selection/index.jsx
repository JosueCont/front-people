import React, { useEffect, useState } from 'react';
import { withAuthSync } from '../../../libs/auth';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { getFiltersJB } from '../../../utils/functions';
import SearchSelection from '../../../components/jobbank/selection/SearchSelection';
import TableSelection from '../../../components/jobbank/selection/TableSelection';
import {
    getListSelection,
    getVacanciesOptions
} from '../../../redux/jobBankDuck';
import MainIndexJB from '../../../components/jobbank/MainIndexJB';

const index = ({
    currentNode,
    getVacanciesOptions,
    getListSelection
}) => {

    const router = useRouter();
    
    useEffect(()=>{
        if(currentNode){
            getVacanciesOptions(currentNode.id);
        }
    },[currentNode])

    useEffect(()=>{
        if(currentNode){
            let page = router.query.page ? parseInt(router.query.page) : 1;
            let size = router.query.size ? parseInt(router.query.size) : 10;
            let filters = getFiltersJB(router.query);
            getListSelection(currentNode.id, filters, page, size);
        }
    },[currentNode, router.query])

    return (
        <MainIndexJB
            pageKey='jb_selection'
            extraBread={[{name: 'Proceso de selección'}]}
        >
            <SearchSelection/>
            <TableSelection/>
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
        getVacanciesOptions,
        getListSelection
    }
)(withAuthSync(index));