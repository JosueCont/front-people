import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../libs/auth';
import { useRouter } from 'next/router';
import MainKuiz from '../../../components/kuiz/MainKuiz';
import { getAnswers } from '../../../redux/kuizDuck';
import SearchSurveys from '../../../components/kuiz/SearchSurveys';
import TableAnswers from '../../../components/kuiz/answers/TableAnswers';
import DrawerAnswer from '../../../components/kuiz/answers/DrawerAnswer';

const index = ({
    currentNode,
    getAnswers
}) => {

    const router = useRouter();
    const [openDrawer, setOpenDrawer] = useState(false);
    const [itemToEdit, setItemToEdit] = useState({});

    useEffect(() => {
        if (router.query?.question) {
            getAnswers(router.query?.question)
        }
    }, [router.query?.question])

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
            extraBread={[{ name: 'Respuestas' }]}
        >
            <SearchSurveys
                title='Respuestas'
                urlBack='/kuiz/questions'
                actionAdd={()=> setOpenDrawer(true)}
                params={{
                    assessment: router.query?.assessment,
                    section: router.query?.section
                }}
            />
            <TableAnswers showEdit={showEdit}/>
            <DrawerAnswer
                visible={openDrawer}
                itemToEdit={itemToEdit}
                close={closeEdit}
                onReady={()=>{
                    getAnswers(router.query?.question)
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
    getAnswers
}
)(withAuthSync(index));