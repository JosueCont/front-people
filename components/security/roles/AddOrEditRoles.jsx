import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MainIndexSecurity from '../MainIndexSecurity';
import DetailsRoles from './DetailsRoles';
import { connect } from 'react-redux';
import { getModulesPermissions } from '../../../redux/catalogCompany';
import { deleteFiltersJb } from '../../../utils/functions';

const AddOrEditRoles = ({
    action = 'add',
    currentNode,
    getModulesPermissions
}) => {

    const router = useRouter();
    const [newFilters, setNewFilters] = useState({});
    const deleteKeys = ['id'];

    useEffect(()=>{
        if(Object.keys(router.query).length <= 0) return;
        let filters = deleteFiltersJb({...router.query}, deleteKeys);
        setNewFilters(filters);
    },[router.query])

    useEffect(()=>{
        //No se requiere el nodo, son módulos globales.
        getModulesPermissions();
    },[])

    const ExtraBread = [
        {name: 'Roles de administrador', URL: '/security/roles'},
        {name: action == 'add' ? 'Nuevo' : 'Expediente'}
    ]

    return (
        <MainIndexSecurity
            pageKey='security_roles'
            extraBread={ExtraBread}
            newFilters={newFilters}
        >
            <DetailsRoles
                action={action}
                newFilters={newFilters}
            />
        </MainIndexSecurity>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, {
        getModulesPermissions
    }
)(AddOrEditRoles);