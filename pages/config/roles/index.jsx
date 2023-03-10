import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../libs/auth';
import MainIndexConfig from '../../../components/config/MainConfig';
import SearchRoles from '../../../components/config/roles/SearchRoles';
import TableRoles from '../../../components/config/roles/TableRoles';
import { getAdminRoles } from '../../../redux/catalogCompany';
import { getFiltersJB } from '../../../utils/functions';

const index = ({
    currentNode,
    getAdminRoles
}) => {

    const router = useRouter();

    useEffect(()=>{
        if(!currentNode) return;
        let page = router.query.page ? parseInt(router.query.page) : 1;
        let filters = getFiltersJB({...router.query});
        getAdminRoles(currentNode.id, filters, page);
    },[currentNode, router.query])

    return (
        <MainIndexConfig
            pageKey='config_roles'
            extraBread={[{name: 'Roles de administrador'}]}
        >
            <SearchRoles/>
            <TableRoles/>
        </MainIndexConfig>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node,
    }
}

export default connect(
    mapState,{
        getAdminRoles
    }
)(withAuthSync(index));