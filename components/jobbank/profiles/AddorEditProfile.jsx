import React, { useEffect, useState } from 'react';
import DetailsProfiles from './DetailsProfiles';
import { connect } from 'react-redux';
import {
    getProfilesTypes,
    getVacantFields,
    getClientsOptions
} from '../../../redux/jobBankDuck';
import { useRouter } from 'next/router';
import { deleteFiltersJb } from '../../../utils/functions';
import MainIndexJB from '../MainIndexJB';

const AddorEditProfile = ({
    action = 'add',
    currentNode,
    getProfilesTypes,
    getVacantFields,
    getClientsOptions
}) => {

    const router = useRouter();
    const [newFilters, setNewFilters] = useState({});
    const deleteKeys = ['id','client','back'];

    useEffect(()=>{
        if(Object.keys(router.query).length <= 0) return;
        let filters = deleteFiltersJb(router.query, deleteKeys);
        setNewFilters(filters);
    },[router.query])

    useEffect(()=>{
        if(currentNode){
            getProfilesTypes(currentNode.id)
            getVacantFields(currentNode.id)
            getClientsOptions(currentNode.id)
        };
    },[currentNode])

    const ExtraBread = [
        {name: 'Template de vacante', URL: '/jobbank/profiles'},
        {name: action == 'add' ? 'Nuevo' : 'Expediente'}
    ]

    return (
        <MainIndexJB
            pageKey='jb_profiles'
            newFilters={newFilters}
            extraBread={ExtraBread}
        >
            <DetailsProfiles
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
        getProfilesTypes,
        getVacantFields,
        getClientsOptions
    }
)(AddorEditProfile);