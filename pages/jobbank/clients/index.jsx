import React, { useState, useEffect } from 'react';
import TableClients from '../../../components/jobbank/clients/TableClients';
import SearchClients from '../../../components/jobbank/clients/SearchClients';
import { connect } from 'react-redux';
import { getClients, getSectors} from '../../../redux/jobBankDuck';
import { withAuthSync } from '../../../libs/auth';
import { useRouter } from 'next/router';
import { getFiltersJB } from '../../../utils/functions';
import MainIndexJB from '../../../components/jobbank/MainIndexJB';

const index = ({
    currentNode,
    getClients,
    getSectors
}) => {

    const router = useRouter();

    useEffect(()=>{
        if(currentNode) getSectors(currentNode.id);
    },[currentNode])

    useEffect(()=>{
        if(currentNode){
            let page = router.query.page ? parseInt(router.query.page) : 1;
            let filters = getFiltersJB(router.query);
            getClients(currentNode.id, filters, page)
        }
    },[currentNode, router.query])

    return (
        <MainIndexJB
            pageKey='jb_clients'
            extraBread={[{name: 'Clientes'}]}
        >
            <SearchClients/>
            <TableClients/>
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
        getClients,
        getSectors
    }
)(withAuthSync(index));