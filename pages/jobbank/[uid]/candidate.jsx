import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import {
    getInfoCandidate,
    getMainCategories,
    getSubCategories,
    getCompetences,
    getSectors
} from '../../../redux/jobBankDuck';
import AutoRegister from '../../../components/jobbank/AutoRegister';
import RegisterCandidate from '../../../components/jobbank/candidates/RegisterCandidate';

const candidate = ({
    currentNode,
    getInfoCandidate,
    getSectors,
    getMainCategories,
    getSubCategories,
    getCompetences
}) => {

    const router = useRouter();

    useEffect(()=>{
        if(currentNode){
            getSectors(currentNode.id);
            getMainCategories(currentNode.id);
            getSubCategories(currentNode.id);
            getCompetences(currentNode.id);
        }
    },[currentNode])

    // useEffect(()=>{
    //     if(router.query.id) getInfoCandidate(router.query.id);
    // },[router])

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
        getInfoCandidate,
        getSectors,
        getMainCategories,
        getSubCategories,
        getCompetences
    }
)(candidate);