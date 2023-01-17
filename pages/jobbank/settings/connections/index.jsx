import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../../libs/auth';
import { useRouter } from 'next/router';
import { getConnections, getConnectionsOptions } from '../../../../redux/jobBankDuck';
import SearchConnections from '../../../../components/jobbank/connections/SearchConnections';
import TableConnections from '../../../../components/jobbank/connections/TableConnections';
import { getFiltersJB } from '../../../../utils/functions';
import MainIndexJB from '../../../../components/jobbank/MainIndexJB';

const index = ({
    currentNode,
    getConnections,
    getConnectionsOptions
}) => {

    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [currentFilters, setCurrentFilters] = useState('');

    useEffect(()=>{
        if(currentNode) getConnectionsOptions(currentNode.id);
    },[currentNode])

    useEffect(()=>{
        if(currentNode){
            let page = router.query.page ? parseInt(router.query.page) : 1;
            let filters = getFiltersJB(router.query);
            getConnections(currentNode.id, filters, page);
            setCurrentPage(page)
            setCurrentFilters(filters)
        }
    },[currentNode, router.query])

    const ExtraBread = [
        {name: 'Configuraciones', URL: '/jobbank/settings'},
        {name: 'Conexiones'}
    ]

    return (
        <MainIndexJB
            pageKey='jb_settings'
            extraBread={ExtraBread}
        >
            <SearchConnections
                currentPage={currentPage}
                currentFilters={currentFilters}
            />
            <TableConnections
                currentPage={currentPage}
                currentFilters={currentFilters}
            />
        </MainIndexJB>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node,
    }
}

export default connect(
    mapState, {
        getConnections,
        getConnectionsOptions
    }
)(withAuthSync(index));