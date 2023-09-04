import React, { useEffect, useState } from 'react';
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
import DrawerAssessment from '../../../components/kuiz/assessments/DrawerAssessment';

const index = ({
    currentNode,
    kuiz_filters,
    getAssessments,
    // getAssessmentsOptions,
    getCategories
}) => {
    
    const router = useRouter();
    const [openDrawer, setOpenDrawer] = useState(false);
    const [itemToEdit, setItemToEdit] = useState({});

    useEffect(()=>{
        if(!currentNode) return;
        // getAssessmentsOptions(currentNode?.id)
        getCategories(currentNode?.id)
    },[currentNode])

    useEffect(() => {
        if(!currentNode) return;
        let filters = getFiltersJB(router.query);
        getAssessments(currentNode?.id, filters);
    }, [currentNode, router.query])

    const showEdit = (item) => {
        setItemToEdit(item)
        setOpenDrawer(true)
    }

    const closeEdit = () => {
        setItemToEdit({})
        setOpenDrawer(false)
    }

    return (
        <MainKuiz
            pageKey='kuiz_assessments'
            extraBread={[{ name: 'Evaluaciones' }]}
        >
            <SearchAssessments actionAdd={()=> setOpenDrawer(true)}/>
            <TableAssessments showEdit={showEdit}/>
            <DrawerAssessment
                itemToEdit={itemToEdit}
                visible={openDrawer}
                close={closeEdit}
                onReady={()=>{
                    getAssessments(currentNode?.id, kuiz_filters)
                }}
            />
        </MainKuiz>
    )
}

const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node,
        kuiz_filters: state.kuizStore.kuiz_filters
    }
}

export default connect(
    mapState, {
    getAssessments,
    // getAssessmentsOptions,
    getCategories
}
)(withAuthSync(index));