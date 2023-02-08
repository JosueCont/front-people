import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import {
    getProfilesOptions,
    getVacanciesOptions,
    getVacantFields,
    getConnectionsOptions,
    getClientsOptions
} from '../../../redux/jobBankDuck';
import DetailsPublication from './DetailsPublication';
import { deleteFiltersJb } from '../../../utils/functions';
import MainIndexJB from '../MainIndexJB';

const AddOrEditPublication = ({
    action = 'add',
    currentNode,
    getProfilesOptions,
    getVacanciesOptions,
    getVacantFields,
    getConnectionsOptions,
    getClientsOptions
}) => {

    const router = useRouter();
    const [newFilters, setNewFilters] = useState({});
    const deleteKeys = ['id', 'client', 'vacancy', 'strategy'];

    useEffect(()=>{
        if(Object.keys(router.query).length <= 0) return;
        let filters = deleteFiltersJb(router.query, deleteKeys);
        setNewFilters(filters);
    },[router.query])

    useEffect(()=>{
        if(currentNode){
            getProfilesOptions(currentNode.id);
            getVacanciesOptions(currentNode.id, '&status=1');
            getVacantFields(currentNode.id);
            getClientsOptions(currentNode.id);
            getConnectionsOptions(currentNode.id, '&conection_type=1');
        }
    },[currentNode])

    const ExtraBread = [
        {name: 'Publicaciones', URL: '/jobbank/publications'},
        {name: action == 'add' ? 'Nueva' : 'Expediente'}
    ]

    return (
        <MainIndexJB
            pageKey='jb_publications'
            newFilters={newFilters}
            extraBread={ExtraBread}
        >
            <DetailsPublication
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
    mapState,{
        getProfilesOptions,
        getVacanciesOptions,
        getVacantFields,
        getConnectionsOptions,
        getClientsOptions
    }
)(AddOrEditPublication);