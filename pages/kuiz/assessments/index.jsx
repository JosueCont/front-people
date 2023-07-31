import React, { useEffect } from 'react';
import { withAuthSync } from '../../../libs/auth';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import MainKuiz from '../../../components/kuiz/MainKuiz';
import SearchAssessments from '../../../components/kuiz/assessments/SearchAssessments';
import TableAssessments from '../../../components/kuiz/assessments/TableAssessments';
import {
    getAssessments,
    getAssessmentsOptions,
    getCategories
} from '../../../redux/kuizDuck';
import { getFiltersJB } from '../../../utils/functions';

const index = ({
    currentNode,
    getAssessments,
    // getAssessmentsOptions,
    getCategories
}) => {
    
    const router = useRouter();

    // useEffect(()=>{
    //     if(!currentNode) return;
    //     getAssessmentsOptions(currentNode?.id)
    //     getCategories(currentNode?.id)
    // },[currentNode])

    useEffect(() => {
        if(!currentNode) return;
        let filters = getFiltersJB(router.query);
        getAssessments(currentNode?.id, filters);
    }, [currentNode, router.query])

    return (
        <MainKuiz
            pageKey='surveys'
            extraBread={[{ name: 'Evaluaciones' }]}
        >
            <SearchAssessments />
            <TableAssessments />
        </MainKuiz>
    )
}

const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node,
    }
}

export default connect(
    mapState, {
    getAssessments,
    // getAssessmentsOptions,
    // getCategories
}
)(withAuthSync(index));