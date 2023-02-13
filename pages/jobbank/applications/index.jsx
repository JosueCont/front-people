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
    getApplicationsCandidates
} from '../../../redux/jobBankDuck';
import { getFiltersJB } from '../../../utils/functions';
import moment from 'moment';

const index = ({
    currentNode,
    getApplications,
    getVacanciesOptions,
    getApplicationsCandidates
}) => {

    const router = useRouter();
    const format = 'DD-MM-YYYY';

    useEffect(()=>{
        if(currentNode){
            getVacanciesOptions(currentNode.id, '&status=1');
            getApplicationsCandidates(currentNode.id);
        }
    },[currentNode])

    const validFilters = () =>{
        let params = {...router.query};
        let dates = router.query?.date
            ? router.query?.date?.split(',')
            : [
                moment().startOf('month').format(format),
                moment().endOf('month').format(format)
            ];
        params.registration_date__gte = dates[0];
        params.registration_date__lte = dates[1];
        if(params.date) delete params.date;
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
        getApplicationsCandidates
    }
)(withAuthSync(index));