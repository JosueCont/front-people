import React, {
    useEffect,
    useState
} from 'react';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import SearchPersons from './SearchPersons';
import TablePersons from './TablePersons';
import { getFiltersJB } from '../../../../utils/functions';
import { getTypesPersons } from '../../../../redux/OrgStructureDuck';
import ModalPersons from './ModalPersons';
import WebApiOrgStructure from '../../../../api/WebApiOrgStructure';
import ListItems from '../../../../common/ListItems';
import { getTypesPersonsOptions } from '../../../../redux/OrgStructureDuck';

const MainPersons = ({
    catalog,
    currentNode,
    getTypesPersons,
    org_page,
    org_filters,
    org_page_size,
    getTypesPersonsOptions
}) => {

    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [itemToEdit, setItemToEdit] = useState({});

    const [openDelete, setOpenDelete] = useState(false);
    const [itemsSelected, setItemsSelected] = useState([]);

    useEffect(() => {
        if (!currentNode) return;
        getTypesPersonsOptions(currentNode?.id)
    }, [currentNode])

    useEffect(() => {
        if (!currentNode) return;
        let page = router.query.page ? parseInt(router.query.page) : 1;
        let size = router.query.size ? parseInt(router.query.size) : 10;
        let filters = getFiltersJB(validFilters(), ['catalog']);
        getTypesPersons(currentNode?.id, filters, page, size);
    }, [currentNode, router.query])

    const validFilters = () => {
        let filters = { ...router.query };
        let prefix = filters.prefix__unaccent__icontains;

        filters.is_active = filters.is_active ? filters.is_active : 'true';
        if (filters.is_active == 'all') delete filters.is_active;
        if (prefix) filters.code__unaccent__icontains = prefix;
        return filters;
    }

    const actionDelete = async () => {
        try {
            let id = itemsSelected?.at(-1)?.id;
            await WebApiOrgStructure.updateTypePerson(id, { is_deleted: true }, 'patch');
            message.success('Tipo de persona eliminada')
            getTypesPersons(currentNode?.id, org_filters, org_page, org_page_size)
        } catch (e) {
            console.log(e)
            message.error('Tipo de persona no eliminada')
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
            <SearchPersons
                title={catalog?.name}
                actionAdd={() => setOpenModal(true)}
            />
            <TablePersons
                showEdit={showEdit}
                showDelete={showDelete}
            />
            <ModalPersons
                visible={openModal}
                itemToEdit={itemToEdit}
                refreshList={false}
                close={closeEdit}
                onReady={() => {
                    getTypesPersons(currentNode?.id, org_filters, org_page, org_page_size)
                }}
            />
            <ListItems
                title='¿Estás seguro de eliminar este tipo de persona?'
                visible={openDelete}
                keyTitle='name'
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
    getTypesPersons,
    getTypesPersonsOptions
})(MainPersons);