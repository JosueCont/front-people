import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DetailsVacancies from './DetailsVacancies';
import { connect } from 'react-redux';
import {
    getClientsOptions,
    getMainCategories,
    getSubCategories,
    getAcademics,
    getCompetences,
    getScholarship,
    getListStates
} from '../../../redux/jobBankDuck';
import {
    getGroupsAssessments
} from '../../../redux/assessmentDuck';
import { deleteFiltersJb } from '../../../utils/functions';
import MainIndexJB from '../MainIndexJB';

const AddOrEditVacancies = ({
    action = 'add',
    currentNode,
    getClientsOptions,
    getMainCategories,
    getSubCategories,
    getAcademics,
    getCompetences,
    getScholarship,
    getListStates,
    getGroupsAssessments
}) => {

    const router = useRouter();
    const [newFilters, setNewFilters] = useState({});
    const deleteKeys = ['id','client','tab','back'];

    useEffect(()=>{
        if(Object.keys(router.query).length <= 0) return;
        let filters = deleteFiltersJb(router.query, deleteKeys);
        setNewFilters(filters);
    },[router.query])

    useEffect(()=>{
        if(currentNode){
            getClientsOptions(currentNode.id);
            getMainCategories(currentNode.id);
            getSubCategories(currentNode.id);
            getAcademics(currentNode.id);
            getCompetences(currentNode.id);
            getScholarship(currentNode.id);
            getListStates(currentNode.id);
            if(action == 'add') return;
            getGroupsAssessments(currentNode?.id);
        }
    },[currentNode])

    const ExtraBread = [
        {name: 'Vacantes', URL: '/jobbank/vacancies'},
        {name: action == 'add' ? 'Nueva' : 'Expediente'}
    ]

    return (
        <MainIndexJB
            pageKey='jb_vacancies'
            extraBread={ExtraBread}
            newFilters={newFilters}
        >
            <DetailsVacancies
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
        getClientsOptions,
        getMainCategories,
        getSubCategories,
        getAcademics,
        getCompetences,
        getScholarship,
        getListStates,
        getGroupsAssessments
    }
)(AddOrEditVacancies);