import React, { useEffect, useState } from 'react';
import { withAuthSync } from '../../../libs/auth';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { getFiltersJB } from '../../../utils/functions';
import SearchSelection from '../../../components/jobbank/selection/SearchSelection';
import TableSelection from '../../../components/jobbank/selection/TableSelection';
import { getVacanciesOptions, getCandidatesOptions } from '../../../redux/jobBankDuck';
import { getListSelection } from '../../../redux/jobBankDuck';
import MainIndexJB from '../../../components/jobbank/MainIndexJB';

const index = ({
    currentNode,
    getVacanciesOptions,
    getListSelection,
    getCandidatesOptions
}) => {

    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [currentFilters, setCurrentFilters] = useState('');
    
    useEffect(()=>{
        if(currentNode){
            getVacanciesOptions(currentNode.id);
            getCandidatesOptions(currentNode.id);
        }
    },[currentNode])

    useEffect(()=>{
        if(currentNode){
            let page = router.query.page ? parseInt(router.query.page) : 1;
            let filters = getFiltersJB(router.query);
            getListSelection(currentNode.id, filters, page);
            setCurrentPage(page);
            setCurrentFilters(filters);
        }
    },[currentNode, router.query])

    return (
        <MainIndexJB
            pageKey='jb_selection'
            extraBread={[{name: 'Proceso de selección'}]}
        >
            <SearchSelection
                currentPage={currentPage}
                currentFilters={currentFilters}
            />
            <TableSelection
                currentPage={currentPage}
                currentFilters={currentFilters}
            />
        </MainIndexJB>
    )
}

const mapState = (state) => {
    return{
        currentNode: state.userStore.current_node,
    }
}

export default connect(
    mapState, {
        getVacanciesOptions,
        getListSelection,
        getCandidatesOptions
    }
)(withAuthSync(index));