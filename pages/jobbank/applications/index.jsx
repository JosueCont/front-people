import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { withAuthSync } from '../../../libs/auth';
import MainIndexJB from '../../../components/jobbank/MainIndexJB';
import SearchApplications from '../../../components/jobbank/applications/SearchApplications';
import TableApplications from '../../../components/jobbank/applications/TableApplications';
import {
    getApplications,
    getVacanciesOptions,
    getApplicationsCandidates,
    getClientsOptions
} from '../../../redux/jobBankDuck';
import { getFiltersJB } from '../../../utils/functions';
import moment from 'moment';

const index = ({
    currentNode,
    getApplications,
    getVacanciesOptions,
    getApplicationsCandidates,
    getClientsOptions
}) => {

    const router = useRouter();
    const format = 'YYYY-MM-DD';

    useEffect(()=>{
        if(currentNode){
            getClientsOptions(currentNode.id)
            getVacanciesOptions(currentNode.id, '&status=1');
            getApplicationsCandidates(currentNode.id);
        }
    },[currentNode])

    const validFilters = () =>{
        let params = {...router.query};
        if(params.date){
            let dates = params?.date?.split(',');
            params.registration_date__date__gte = dates[0];
            params.registration_date__date__lte = dates[1];
            delete params.date;
        }
        return params;
    }

    useEffect(()=>{
        if(currentNode){
            let page = router.query.page ? parseInt(router.query.page) : 1;
            let size = router.query.size ? parseInt(router.query.size) : 10;
            let filters = getFiltersJB(validFilters());         
            getApplications(currentNode.id, filters, page, size)
        }
    },[currentNode, router.query])

    return (
        <MainIndexJB
            pageKey='jb_applications'
            extraBread={[{name: 'Postulaciones'}]}
        >
            <SearchApplications/>
            <TableApplications/>
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
        getApplications,
        getVacanciesOptions,
        getApplicationsCandidates,
        getClientsOptions
    }
)(withAuthSync(index));