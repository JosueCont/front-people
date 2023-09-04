import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../libs/auth';
import { useRouter } from 'next/router';
import MainKuiz from '../../../components/kuiz/MainKuiz';
import SearchSurveys from '../../../components/kuiz/SearchSurveys';
import TableSections from '../../../components/kuiz/sections/TableSections';
import { getSections } from '../../../redux/kuizDuck';
import DrawerSection from '../../../components/kuiz/sections/DrawerSection';

const index = ({
    currentNode,
    getSections
}) => {

    const router = useRouter();
    const [openDrawer, setOpenDrawer] = useState(false);
    const [itemToEdit, setItemToEdit] = useState({});

    useEffect(() => {
        if (router.query?.assessment) {
            getSections(router.query?.assessment)
        }
    }, [router.query?.assessment])

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
            extraBread={[{ name: 'Secciones' }]}
        >
            <SearchSurveys
                title='Secciones'
                actionAdd={() => setOpenDrawer(true)}
            />
            <TableSections showEdit={showEdit}/>
            <DrawerSection
                visible={openDrawer}
                close={closeEdit}
                itemToEdit={itemToEdit}
                onReady={() => getSections(router.query?.assessment)}
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
    getSections
}
)(withAuthSync(index));