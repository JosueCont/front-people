import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../libs/auth';
import { useRouter } from 'next/router';
import SearchCandidates from '../../../components/jobbank/candidates/SearchCandidates';
import TableCandidates from '../../../components/jobbank/candidates/TableCandidates';
import {
    getCandidates,
    getMainCategories,
    getListStates
} from '../../../redux/jobBankDuck';
import { getFiltersJB } from '../../../utils/functions';
import MainIndexJB from '../../../components/jobbank/MainIndexJB';

const index = ({
    currentNode,
    getCandidates,
    getListStates,
    getMainCategories
}) => {

    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [currentFilters, setCurrentFilters] = useState('');

    useEffect(()=>{
        if(currentNode){
            getMainCategories(currentNode.id);
            getListStates(currentNode.id);
        }
    },[currentNode])

    useEffect(()=>{
        if(currentNode){
            let page = router.query.page ? parseInt(router.query.page) : 1;
            let filters = getFiltersJB(router.query);
            getCandidates(currentNode.id, filters, page);
            setCurrentPage(page)
            setCurrentFilters(filters)
        }
    },[currentNode, router.query])

    return (
        <MainIndexJB
            pageKey='jb_candidates'
            extraBread={[{name: 'Candidatos'}]}
        >
            <SearchCandidates/>
            <TableCandidates
                currentPage={currentPage}
                currentFilters={currentFilters}
            />
        </MainIndexJB>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node,
    }
}

export default connect(
    mapState,{
        getCandidates,
        getListStates,
        getMainCategories
    }
)(withAuthSync(index));