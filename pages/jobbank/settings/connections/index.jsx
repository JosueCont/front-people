import React, { useEffect, useState } from 'react';
import MainLayout from '../../../../layout/MainInter';
import { Breadcrumb } from 'antd';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../../libs/auth';
import { useRouter } from 'next/router';
import { getConnections } from '../../../../redux/jobBankDuck';
import SearchConnections from '../../../../components/jobbank/connections/SearchConnections';
import TableConnections from '../../../../components/jobbank/connections/TableConnections';
import { verifyMenuNewForTenant, getFiltersJB } from '../../../../utils/functions';
import MainIndexJB from '../../../../components/jobbank/MainIndexJB';

const index = ({
    currentNode,
    getConnections
}) => {

    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [currentFilters, setCurrentFilters] = useState('');

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
            <SearchConnections/>
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
    mapState, { getConnections }
)(withAuthSync(index));