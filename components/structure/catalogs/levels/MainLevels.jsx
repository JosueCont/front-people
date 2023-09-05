import React, {
    useEffect,
    useState,
    useMemo
} from 'react';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import SearchLevels from './SearchLevels';
import TableLevels from './TableLevels';
import {
    getOrgLevels,
    getOrgLevelsOptions
} from '../../../../redux/OrgStructureDuck';
import { getFiltersJB } from '../../../../utils/functions';
import ModalLevels from './ModalLevels';
import WebApiOrgStructure from '../../../../api/WebApiOrgStructure';
import { message } from 'antd';
import ListItems from '../../../../common/ListItems';
import TreeList from '../TreeList';

const MainLevels = ({
    catalog,
    getOrgLevels,
    getOrgLevelsOptions,
    currentUser,
    org_filters,
    org_page,
    org_page_size,
    list_org_levels_options,
    load_org_levels_options,
    list_org_levels_tree
}) => {

    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [itemToEdit, setItemToEdit] = useState({});

    const [openDelete, setOpenDelete] = useState(false);
    const [itemsSelected, setItemsSelected] = useState([]);
    const [useWithAction, setUseWithAction] = useState(true);

    useEffect(() => {
        getOrgLevelsOptions()
    }, [])

    useEffect(() => {
        if (router.query?.tree) return;
        let page = router.query.page ? parseInt(router.query.page) : 1;
        let size = router.query.size ? parseInt(router.query.size) : 10;
        let filters = getFiltersJB(validFilters(), ['catalog']);
        getOrgLevels(filters, page, size)
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
            await WebApiOrgStructure.updateOrgLevel(id, { is_deleted: true }, 'patch');
            message.success('Nivel organizacional eliminado')
            getOrgLevels(org_filters, org_page, org_page_size)
            getOrgLevelsOptions()
        } catch (e) {
            console.log(e)
            message.error('Nivel organizacional no eliminado')
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
        setUseWithAction(item?.num_childs <= 0)
        setItemsSelected([item])
        setOpenDelete(true)
    }

    const closeDelete = () => {
        setOpenDelete(false)
        setItemsSelected([])
        setUseWithAction(true)
    }

    const showEditTree = (item) => {
        const find_ = record => record.id == item?.id;
        let result = list_org_levels_options.find(find_);
        showEdit(result)
    }

    const showDeleteTree = (item) => {
        const find_ = record => record.id == item?.id;
        let result = list_org_levels_options.find(find_);
        showDelete(result)
    }

    return (
        <>
            <SearchLevels
                title={catalog?.name}
                actionAdd={() => setOpenModal(true)}
            />
            {router.query?.tree == 'true' ? (
                <TreeList
                    list_tree={list_org_levels_tree}
                    load_tree={load_org_levels_options}
                    showEditTree={showEditTree}
                    showDeleteTree={showDeleteTree}
                />
            ) : (
                <TableLevels
                    showEdit={showEdit}
                    showDelete={showDelete}
                />
            )}
            <ModalLevels
                visible={openModal}
                itemToEdit={itemToEdit}
                close={closeEdit}
                onReady={() => {
                    getOrgLevels(org_filters, org_page, org_page_size)
                }}
            />
            <ListItems
                title={useWithAction
                    ? '¿Estás seguro de eliminar este nivel organizacional?'
                    : 'Este nivel organizacional no se puede eliminar ya que otros preceden de el.'
                }
                visible={openDelete}
                keyTitle='name'
                keyDescription='description'
                close={closeDelete}
                itemsToList={itemsSelected}
                actionConfirm={actionDelete}
                useWithAction={useWithAction}
                textCancel={useWithAction ? 'Cancelar' : 'Cerrar'}
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
        org_page_size: state.orgStore.org_page_size,
        list_org_levels_options: state.orgStore.list_org_levels_options,
        list_org_levels_tree: state.orgStore.list_org_levels_tree,
        load_org_levels_options: state.orgStore.load_org_levels_options
    }
}

export default connect(
    mapState, {
    getOrgLevels,
    getOrgLevelsOptions
}
)(MainLevels);