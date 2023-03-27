import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../libs/auth';
import MainIndexSecurity from '../../../components/security/MainIndexSecurity';
import SearchRoles from '../../../components/security/roles/SearchRoles';
import TableRoles from '../../../components/security/roles/TableRoles';
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
        <MainIndexSecurity
            pageKey='security_roles'
            extraBread={[{name: 'Roles de administrador'}]}
        >
            <SearchRoles/>
            <TableRoles/>
        </MainIndexSecurity>
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