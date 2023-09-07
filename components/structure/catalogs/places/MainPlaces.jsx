import React, {
    useState,
    useEffect
} from 'react';
import SearchPlaces from './SearchPlaces';
import TablePlaces from './TablePlaces';
import { connect } from 'react-redux'
import {
    getPlaces,
    getJobsOptions,
    getRanksOptions,
    getOrgNodesOptions,
    getPlacesOptions,
    getOrgLevelsOptions
} from '../../../../redux/OrgStructureDuck';
import ModalPlaces from './ModalPlaces';
import ListItems from '../../../../common/ListItems';
import { useRouter } from 'next/router';
import { getFiltersJB } from '../../../../utils/functions';
import WebApiOrgStructure from '../../../../api/WebApiOrgStructure';
import { message } from 'antd';

const MainPlaces = ({
    newFilters,
    catalog,
    currentNode,
    getPlaces,
    getJobsOptions,
    getRanksOptions,
    getOrgNodesOptions,
    getPlacesOptions,
    getOrgLevelsOptions,
    org_filters,
    org_page,
    org_page_size
}) => {

    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [itemToEdit, setItemToEdit] = useState({});

    const [openDelete, setOpenDelete] = useState(false);
    const [itemsSelected, setItemsSelected] = useState([]);

    useEffect(() => {
        getJobsOptions()
        getRanksOptions()
        getOrgNodesOptions()
        getPlacesOptions()
        getOrgLevelsOptions()
    }, [])

    useEffect(() => {
        let page = router.query.page ? parseInt(router.query.page) : 1;
        let size = router.query.size ? parseInt(router.query.size) : 10;
        let filters = getFiltersJB(validFilters(), ['catalog']);
        getPlaces(filters, page, size)
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
            await WebApiOrgStructure.updatePlace(id, { is_deleted: true }, 'patch');
            message.success('Plaza eliminada')
            getPlaces(org_filters, org_page, org_page_size)
        } catch (e) {
            console.log(e)
            message.error('Plaza no eliminada')
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
            <SearchPlaces
                title={catalog?.name}
                actionAdd={() => setOpenModal(true)}
            />
            <TablePlaces
                showEdit={showEdit}
                showDelete={showDelete}
                newFilters={newFilters}
            />
            <ModalPlaces
                visible={openModal}
                itemToEdit={itemToEdit}
                close={closeEdit}
                onReady={() => {
                    getPlaces(org_filters, org_page, org_page_size)
                }}
            />
            <ListItems
                title='¿Estás seguro de eliminar esta plaza?'
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
    getPlaces,
    getJobsOptions,
    getRanksOptions,
    getOrgNodesOptions,
    getPlacesOptions,
    getOrgLevelsOptions
})(MainPlaces);