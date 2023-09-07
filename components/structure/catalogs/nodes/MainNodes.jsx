import React, {
    useEffect,
    useState,
    useMemo
} from 'react';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import SearchNodes from './SearchNodes';
import TableNodes from './TableNodes';
import {
    getOrgNodes,
    getOrgNodesOptions,
    getOrgLevelsOptions
} from '../../../../redux/OrgStructureDuck';
import { getFiltersJB } from '../../../../utils/functions';
import ModalNodes from './ModalNodes';
import WebApiOrgStructure from '../../../../api/WebApiOrgStructure';
import { message } from 'antd';
import ListItems from '../../../../common/ListItems';
import TreeList from '../TreeList';

const MainNodes = ({
    catalog,
    getOrgNodes,
    getOrgNodesOptions,
    getOrgLevelsOptions,
    org_filters,
    org_page,
    org_page_size,
    list_org_nodes_tree,
    load_org_nodes_options,
    list_org_nodes_options
}) => {

    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [itemToEdit, setItemToEdit] = useState({});

    const [openDelete, setOpenDelete] = useState(false);
    const [itemsSelected, setItemsSelected] = useState([]);
    const [useWithAction, setUseWithAction] = useState(true);

    useEffect(() => {
        getOrgNodesOptions()
        getOrgLevelsOptions()
    }, [])

    useEffect(() => {
        if (router.query?.tree) return;
        let page = router.query.page ? parseInt(router.query.page) : 1;
        let size = router.query.size ? parseInt(router.query.size) : 10;
        let filters = getFiltersJB(validFilters(), ['catalog']);
        getOrgNodes(filters, page, size)
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
            await WebApiOrgStructure.updateOrgNode(id, { is_deleted: true }, 'patch');
            message.success('Nodo organizacional eliminado')
            getOrgNodes(org_filters, org_page, org_page_size)
            getOrgNodesOptions()
        } catch (e) {
            console.log(e)
            message.error('Nodo organizacional no eliminado')
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
        let result = list_org_nodes_options.find(find_);
        showEdit(result)
    }

    const showDeleteTree = (item) => {
        const find_ = record => record.id == item?.id;
        let result = list_org_nodes_options.find(find_);
        showDelete(result)
    }

    return (
        <>
            <SearchNodes
                title={catalog?.name}
                actionAdd={() => setOpenModal(true)}
            />

            {router.query?.tree == 'true' ? (
                <TreeList
                    list_tree={list_org_nodes_tree}
                    load_tree={load_org_nodes_options}
                    showEditTree={showEditTree}
                    showDeleteTree={showDeleteTree}
                />
            ) : (
                <TableNodes
                    showEdit={showEdit}
                    showDelete={showDelete}
                />
            )}
            <ModalNodes
                visible={openModal}
                itemToEdit={itemToEdit}
                close={closeEdit}
                onReady={() => {
                    getOrgNodes(org_filters, org_page, org_page_size)
                }}
            />
            <ListItems
                title={useWithAction
                    ? '¿Estás seguro de eliminar este nodo organizacional?'
                    : 'Este nodo organizacional no se puede eliminar ya que otros preceden de el.'
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
        list_org_nodes_options: state.orgStore.list_org_nodes_options,
        list_org_nodes_tree: state.orgStore.list_org_nodes_tree,
        load_org_nodes_options: state.orgStore.load_org_nodes_options
    }
}

export default connect(
    mapState, {
    getOrgNodes,
    getOrgNodesOptions,
    getOrgLevelsOptions
}
)(MainNodes);