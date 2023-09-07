import React, { useEffect, useState } from 'react';
import TableVacancies from '../../../components/jobbank/vacancies/TableVacancies';
import SearchVacancies from '../../../components/jobbank/vacancies/SearchVacancies';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../libs/auth';
import { useRouter } from 'next/router';
import {
    getVacancies,
    getClientsOptions
} from '../../../redux/jobBankDuck';
import { getFiltersJB } from '../../../utils/functions';
import MainIndexJB from '../../../components/jobbank/MainIndexJB';

const index = ({
    getVacancies,
    currentNode,
    getClientsOptions
}) => {

    const router = useRouter();

    useEffect(()=>{
        if(currentNode){
            getClientsOptions(currentNode.id);
        }
    },[currentNode])

    useEffect(()=>{
        if(currentNode){
            let page = router.query.page ? parseInt(router.query.page) : 1;
            let size = router.query.size ? parseInt(router.query.size) : 10;
            let filters = getFiltersJB(router.query);
            getVacancies(currentNode.id, filters, page, size);
        }
    },[currentNode, router.query])

    return (
        <MainIndexJB
            pageKey='jb_vacancies'
            extraBread={[{name: 'Vacantes'}]}
        >
            <SearchVacancies/>
            <TableVacancies/>
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
        getVacancies,
        getClientsOptions
    }
)(withAuthSync(index));