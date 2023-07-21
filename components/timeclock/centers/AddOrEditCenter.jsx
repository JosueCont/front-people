import React, { useEffect, useState } from 'react';
import MainIndexTM from '../MainIndexTM';
import DetailsCenter from './DetailsCenter';
import { getCompanies } from '../../../redux/UserDuck';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { deleteFiltersJb } from '../../../utils/functions';

const AddOrEditCenter = ({
    currentNode,
    currentUser,
    getCompanies,
    action  = 'add'
}) => {

    const router = useRouter();
    const [newFilters, setNewFilters] = useState({});
    const deleteKeys = ['id'];

    useEffect(()=>{
        if(Object.keys(router.query).length <= 0) return;
        let filters = deleteFiltersJb(router.query, deleteKeys);
        setNewFilters(filters);
    },[router.query])

    useEffect(()=>{
        if(!currentUser) return;
        let query = `?person=${currentUser?.id}&active=true`;
        getCompanies(query)
    },[currentUser])

    const ExtraBread = [
        {name: 'Centros de trabajo', URL: '/timeclock/centers'},
        {name: action == 'add' ? 'Registrar' : 'Información'}
    ]

    return (
        <MainIndexTM
            pageKey={["tm_centers"]}
            extraBread={ExtraBread}
            newFilters={newFilters}
        >
            <DetailsCenter
                action={action}
                newFilters={newFilters}
            />
        </MainIndexTM>
    )
}
const mapState = (state) =>{
    return{
        currentUser: state.userStore.user,
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, {
        getCompanies
    }
)(AddOrEditCenter);