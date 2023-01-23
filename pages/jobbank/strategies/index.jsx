import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../libs/auth';
import { useRouter } from 'next/router';
import {
    getStrategies,
    getClientsOptions,
    getVacanciesOptions
} from '../../../redux/jobBankDuck';
import TableStrategies from '../../../components/jobbank/strategies/TableStrategies';
import SearchStrategies from '../../../components/jobbank/strategies/SearchStrategies';
import { getFiltersJB } from '../../../utils/functions';
import MainIndexJB from '../../../components/jobbank/MainIndexJB';

const index = ({
    currentNode,
    getStrategies,
    getClientsOptions,
    getVacanciesOptions
}) => {

    const router = useRouter();

    useEffect(()=>{
        if(currentNode){
            getClientsOptions(currentNode.id);
            getVacanciesOptions(currentNode.id);
        }
    },[currentNode])

    useEffect(()=>{
        if(currentNode){
            let page = router.query.page
                ? parseInt(router.query.page)
                : 1;
            let filters = getFiltersJB(router.query);
            getStrategies(currentNode.id, filters, page);
        }
    },[currentNode, router.query])

    return (
        <MainIndexJB
            pageKey='jb_strategies'
            extraBread={[{name: 'Estrategias'}]}
        >
            <SearchStrategies/>
            <TableStrategies/>
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
        getStrategies,
        getClientsOptions,
        getVacanciesOptions
    }
)(withAuthSync(index));