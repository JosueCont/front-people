import React, { useEffect } from 'react';
import { withAuthSync } from '../../../libs/auth';
import { connect } from 'react-redux';
import MainKuiz from '../../../components/kuiz/MainKuiz';
import SearchAssessments from '../../../components/kuiz/assessments/SearchAssessments';
import TableAssessments from '../../../components/kuiz/assessments/TableAssessments';
import { getAssessments } from '../../../redux/kuizDuck';

const index = ({
    currentNode,
    getAssessments
}) => {

    useEffect(() => {
        if(!currentNode) return;
        return () => {
            getAssessments(currentNode?.id)
        }
    }, [currentNode])

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
    getAssessments
}
)(withAuthSync(index));