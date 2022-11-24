import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import {
    getMainCategories,
    getSubCategories,
    getCompetences,
    getSectors,
    getSpecializationArea
} from '../../../redux/jobBankDuck';
import AutoRegister from '../../../components/jobbank/AutoRegister';
import RegisterCandidate from '../../../components/jobbank/candidates/RegisterCandidate';

const candidate = ({
    currentNode,
    getSectors,
    getMainCategories,
    getSubCategories,
    getCompetences,
    getSpecializationArea
}) => {

    useEffect(()=>{
        if(currentNode){
            getSectors(currentNode.id);
            getMainCategories(currentNode.id);
            getSubCategories(currentNode.id);
            getCompetences(currentNode.id);
            getSpecializationArea(currentNode.id);
        }
    },[currentNode])

    return (
        <AutoRegister>
            <RegisterCandidate/>
        </AutoRegister>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, {
        getSectors,
        getMainCategories,
        getSubCategories,
        getCompetences,
        getSpecializationArea
    }
)(candidate);