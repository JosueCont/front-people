import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import {
    getMainCategories,
    getSubCategories,
    getCompetences,
    getSectors,
} from '../../../redux/jobBankDuck';
import AutoRegister from '../../../components/jobbank/AutoRegister';
import DetailsCandidates from '../../../components/jobbank/candidates/DetailsCandidates';

const candidate = ({
    currentNode,
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

    const action = useMemo(()=>{
        return router.query?.id ? 'edit' : 'add';
    },[router])

    return (
        <AutoRegister>
            <DetailsCandidates isAutoRegister={true} action={action}/>
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
        getCompetences
    }
)(candidate);