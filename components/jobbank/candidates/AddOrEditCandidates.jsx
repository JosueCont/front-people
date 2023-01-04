import React, { useEffect, useState } from 'react';
import DetailsCandidates from './DetailsCandidates';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import {
    getMainCategories,
    getSubCategories,
    getCompetences,
    getSectors,
    getListStates
} from '../../../redux/jobBankDuck';
import { deleteFiltersJb } from '../../../utils/functions';
import MainIndexJB from '../MainIndexJB';

const AddOrEditCandidates = ({
    action = 'add',
    currentNode,
    getMainCategories,
    getSubCategories,
    getCompetences,
    getSectors,
    getListStates
}) => {

    const router = useRouter();
    const [newFilters, setNewFilters] = useState({});
    const deleteKeys = ['id','tab'];

    useEffect(()=>{
        if(Object.keys(router.query).length <= 0) return;
        let filters = deleteFiltersJb(router.query, deleteKeys);
        setNewFilters(filters);
    },[router.query])

    useEffect(()=>{
        if(currentNode){
            getMainCategories(currentNode.id);
            getSubCategories(currentNode.id);
            getCompetences(currentNode.id);
            getSectors(currentNode.id);
            getListStates(currentNode.id);
        }
    },[currentNode])

    const ExtraBread = [
        {name: 'Candidatos', URL: '/jobbank/candidates'},
        {name: action == 'add' ? 'Nuevo' : 'Expediente'}
    ]

    return (
        <MainIndexJB
            pageKey='jb_candidates'
            extraBread={ExtraBread}
            newFilters={newFilters}
        >
            <DetailsCandidates
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
    mapState, {
        getMainCategories,
        getSubCategories,
        getCompetences,
        getSectors,
        getListStates
    }
)(AddOrEditCandidates);