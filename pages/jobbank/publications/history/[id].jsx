import React, { useEffect, useState } from 'react';
import { withAuthSync } from '../../../../libs/auth';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import TableHistory from '../../../../components/jobbank/publications/TableHistory';
import { deleteFiltersJb } from '../../../../utils/functions';
import { getConnectionsOptions } from '../../../../redux/jobBankDuck';
import MainIndexJB from '../../../../components/jobbank/MainIndexJB';

const index = ({
    currentNode,
    getConnectionsOptions
}) => {

    const router = useRouter();
    const [newFilters, setNewFilters] = useState({});
    const deletekeys = ['id', 'start', 'end', 'account'];

    useEffect(()=>{
        if(Object.keys(router.query).length <= 0) return;
        let filters = deleteFiltersJb(router.query, deletekeys);
        setNewFilters(filters);
    },[router.query])

    useEffect(()=>{
        if(currentNode) getConnectionsOptions(currentNode.id, '&is_active=true');
    },[currentNode])

    const ExtraBread = [
        {name: 'Publicaciones', URL: '/jobbank/publications'},
        {name: 'Historial'}
    ]

    return (
        <MainIndexJB
            pageKey='jb_publications'
            newFilters={newFilters}
            extraBread={ExtraBread}
        >
            <TableHistory newFilters={newFilters}/>
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
        getConnectionsOptions
    }
)(withAuthSync(index));