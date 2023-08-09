import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../libs/auth';
import { useRouter } from 'next/router';
import MainKuiz from '../../../components/kuiz/MainKuiz';
import SearchSections from '../../../components/kuiz/sections/SearchSections';
import TableSections from '../../../components/kuiz/sections/TableSections';
import { getSections } from '../../../redux/kuizDuck';

const index = ({
    currentNode,
    getSections
}) => {

    const router = useRouter();

    useEffect(() => {
        if (router.query?.assessment){
            getSections(router.query?.assessment)
        }
    }, [router.query?.assessment])

    return (
        <MainKuiz
            pageKey='surveys'
            extraBread={[{ name: 'Secciones' }]}
        >
            <SearchSections/>
            <TableSections />
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
        getSections
    }
)(withAuthSync(index));