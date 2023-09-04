import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../libs/auth';
import { useRouter } from 'next/router';
import MainKuiz from '../../../components/kuiz/MainKuiz';
import SearchSurveys from '../../../components/kuiz/SearchSurveys';
import TableQuestions from '../../../components/kuiz/questions/TableQuestions';
import { getQuestions } from '../../../redux/kuizDuck';
import DrawerQuestion from '../../../components/kuiz/questions/DrawerQuestion';

const index = ({
    currentNode,
    getQuestions
}) => {

    const router = useRouter();
    const [openDrawer, setOpenDrawer] = useState(false);
    const [itemToEdit, setItemToEdit] = useState({});

    useEffect(()=>{
        if(router.query?.section){
            getQuestions(router.query?.section)
        }
    },[router.query?.section])

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
            extraBread={[{name: 'Preguntas'}]}
        >
            <SearchSurveys
                title='Preguntas'
                urlBack='/kuiz/sections'
                actionAdd={()=> setOpenDrawer(true)}
                params={{
                    assessment: router.query?.assessment
                }}
            />
            <TableQuestions showEdit={showEdit}/>
            <DrawerQuestion
                visible={openDrawer}
                itemToEdit={itemToEdit}
                close={closeEdit}
                onReady={()=>{
                    getQuestions(router.query?.section)
                }}
            />
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
        getQuestions
}
)(withAuthSync(index));