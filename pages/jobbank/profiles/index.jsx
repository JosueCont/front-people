import React, { useEffect, useState } from 'react';
import { withAuthSync } from '../../../libs/auth';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import SearchProfiles from '../../../components/jobbank/profiles/SearchProfiles';
import TableProfiles from '../../../components/jobbank/profiles/TableProfiles';
import {
    getProfilesList,
    getClientsOptions
} from '../../../redux/jobBankDuck';
import { getFiltersJB } from '../../../utils/functions';
import MainIndexJB from '../../../components/jobbank/MainIndexJB';

const index = ({
    currentNode,
    getProfilesList,
    getClientsOptions
}) => {

    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [currentFilters, setCurrentFilters] = useState('')

    useEffect(()=>{
        if(currentNode){
            getClientsOptions(currentNode.id);
        }
    },[currentNode])

    useEffect(()=>{
        if(currentNode){
            let page = router.query.page ? parseInt(router.query.page) : 1;
            let filters = getFiltersJB(router.query);
            getProfilesList(currentNode.id, filters, page);
            setCurrentPage(page)
            setCurrentFilters(filters)
        }
    },[currentNode, router.query])

    return (
        <MainIndexJB
            pageKey='jb_profiles'
            extraBread={[{name: 'Template de vacante'}]}
        >
            <SearchProfiles/>
            <TableProfiles
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
        getProfilesList,
        getClientsOptions
    }
)(withAuthSync(index));