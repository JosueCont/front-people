import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../libs/auth';
import { useRouter } from 'next/router';
import MainKuiz from '../../../components/kuiz/MainKuiz';
import { getAnswers } from '../../../redux/kuizDuck';
import SearchAnswers from '../../../components/kuiz/answers/SearchAnswers';
import TableAnswers from '../../../components/kuiz/answers/TableAnswers';

const index = ({
    currentNode,
    getAnswers
}) => {

    const router = useRouter();

    useEffect(() => {
        if (router.query?.question) {
            getAnswers(router.query?.question)
        }
    }, [router.query?.question])

    return (
        <MainKuiz
            pageKey='surveys'
            extraBread={[{ name: 'Respuestas' }]}
        >
            <SearchAnswers/>
            <TableAnswers/>
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
    getAnswers
}
)(withAuthSync(index));