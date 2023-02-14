import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../libs/auth';
import { useRouter } from 'next/router';
import {
    getPublications,
    getProfilesOptions,
    getVacanciesOptions,
    getConnectionsOptions
} from '../../../redux/jobBankDuck';
import SearchPublications from '../../../components/jobbank/publications/SearchPublications';
import TablePublications from '../../../components/jobbank/publications/TablePublications';
import { getFiltersJB } from '../../../utils/functions';
import MainIndexJB from '../../../components/jobbank/MainIndexJB';

const index = ({
    currentNode,
    getPublications,
    getProfilesOptions,
    getVacanciesOptions,
    getConnectionsOptions
}) => {

    const router = useRouter();

    useEffect(()=>{
        if(currentNode){
            getProfilesOptions(currentNode.id);
            getVacanciesOptions(currentNode.id);
            getConnectionsOptions(currentNode.id, '&conection_type=1');
        }
    },[currentNode])

    useEffect(()=>{
        if(currentNode){
            let params = {...router.query};
            let page = router.query.page ? parseInt(router.query.page) : 1;
            let size = router.query.size ? parseInt(router.query.size) : 10;
            if(router.query?.profile == 'open_fields') params.profile = "";
            let filters = getFiltersJB(params);
            getPublications(currentNode.id, filters, page, size);
        }
    },[currentNode, router.query])

    return (
        <MainIndexJB
            pageKey='jb_publications'
            extraBread={[{name: 'Publicaciones'}]}
        >
            <SearchPublications/>
            <TablePublications/>
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
        getPublications,
        getProfilesOptions,
        getVacanciesOptions,
        getConnectionsOptions
    }
)(withAuthSync(index));