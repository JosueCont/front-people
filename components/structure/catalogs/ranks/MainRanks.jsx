import React, {
    useEffect,
    useState
} from 'react';
import { useRouter } from 'next/router';
import SearchRanks from './SearchRanks';
import TableRanks from './TableRanks';
import { connect } from 'react-redux';
import {
    getRanks,
    getOrgNodesOptions,
    getOrgLevelsOptions
} from '../../../../redux/OrgStructureDuck';
import ModalRanks from './ModalRanks';
import { getFiltersJB } from '../../../../utils/functions';
import WebApiOrgStructure from '../../../../api/WebApiOrgStructure';
import ListItems from '../../../../common/ListItems';
import { message } from 'antd';

const MainRanks = ({
    nameCatalog,
    currentNode,
    getRanks,
    getOrgNodesOptions,
    getOrgLevelsOptions,
    org_filters,
    org_page_size,
    org_page
}) => {

    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [itemToEdit, setItemToEdit] = useState({});

    const [openDelete, setOpenDelete] = useState(false);
    const [itemsSelected, setItemsSelected] = useState([]);

    useEffect(() => {
        getOrgNodesOptions()
        getOrgLevelsOptions()
    }, [])

    useEffect(() => {
        let page = router.query.page ? parseInt(router.query.page) : 1;
        let size = router.query.size ? parseInt(router.query.size) : 10;
        let filters = getFiltersJB(validFilters(), ['catalog']);
        getRanks(filters, page, size)
    }, [router.query])

    const validFilters = () => {
        let filters = { ...router.query };
        filters.is_active = filters.is_active
            ? filters.is_active : 'true';
        if (filters.is_active == 'all') delete filters.is_active;
        return filters;
    }

    const actionDelete = async () => {
        try {
            let id = itemsSelected?.at(-1)?.id;
            await WebApiOrgStructure.updateRank(id, { is_deleted: true }, 'patch');
            message.success('Nivel jerárquico eliminado')
            getRanks(org_filters, org_page, org_page_size)
        } catch (e) {
            console.log(e)
            message.error('Nivel jerárquico no eliminado')
        }
    }

    const showEdit = (item) => {
        setItemToEdit(item)
        setOpenModal(true)
    }

    const closeEdit = () => {
        setItemToEdit({})
        setOpenModal(false)
    }

    const showDelete = (item) => {
        setItemsSelected([item])
        setOpenDelete(true)
    }

    const closeDelete = () => {
        setOpenDelete(false)
        setItemsSelected([])
    }

    return (
        <>
            <SearchRanks
                title={nameCatalog}
                actionAdd={() => setOpenModal(true)}
            />
            <TableRanks
                showEdit={showEdit}
                showDelete={showDelete}
            />
            <ModalRanks
                visible={openModal}
                itemToEdit={itemToEdit}
                close={closeEdit}
                onReady={() => {
                    getRanks(org_filters, org_page, org_page_size)
                }}
            />
            <ListItems
                title='¿Estás seguro de eliminar este nivel jerárquico?'
                visible={openDelete}
                keyTitle='name'
                keyDescription='description'
                close={closeDelete}
                itemsToList={itemsSelected}
                actionConfirm={actionDelete}
            />
        </>
    )
}

const mapState = (state) => {
    return {
        currentUser: state.userStore.user,
        currentNode: state.userStore.current_node,
        org_page: state.orgStore.org_page,
        org_filters: state.orgStore.org_filters,
        org_page_size: state.orgStore.org_page_size
    }
}

export default connect(
    mapState, {
    getRanks,
    getOrgNodesOptions,
    getOrgLevelsOptions
}
)(MainRanks);