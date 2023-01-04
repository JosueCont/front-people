import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DetailsClients from './DetailsClients';
import { connect } from 'react-redux';
import { getSectors } from '../../../redux/jobBankDuck';
import { deleteFiltersJb } from '../../../utils/functions';
import MainIndexJB from '../MainIndexJB';

const AddOrEditClients = ({
    action = 'add',
    currentNode,
    getSectors
}) => {

    const router = useRouter();
    const [newFilters, setNewFilters] = useState({});
    const deleteKeys = ['id', 'tab'];

    useEffect(()=>{
        if(Object.keys(router.query).length <= 0) return;
        let filters = deleteFiltersJb(router.query, deleteKeys);
        setNewFilters(filters);
    },[router.query])

    useEffect(()=>{
        if(currentNode) getSectors(currentNode.id);
    },[currentNode])

    const ExtraBread = [
        {name: 'Clientes', URL: '/jobbank/clients'},
        {name: action == 'add' ? 'Nuevo' : 'Expediente'}
    ]

    return (
        <MainIndexJB
            pageKey='jb_clients'
            extraBread={ExtraBread}
            newFilters={newFilters}
        >
            <DetailsClients
                action={action}
                newFilters={newFilters}
            />
        </MainIndexJB>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, { getSectors }
)(AddOrEditClients);