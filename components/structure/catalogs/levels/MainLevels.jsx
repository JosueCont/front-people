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
} from '../../../../redux/orgStructureDuck';
import { getFiltersJB } from '../../../../utils/functions';
import ModalLevels from './ModalLevels';
import WebApiOrgStructure from '../../../../api/WebApiOrgStructure';
import { message } from 'antd';
import TreeLevels from './TreeLevels';

const MainLevels = ({
    nameCatalog,
    getOrgLevels,
    getOrgLevelsOptions,
    currentUser,
    org_filters,
    org_page,
    org_page_size
}) => {

    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [itemToEdit, setItemToEdit] = useState({});

    const watchQuerys = [
        router.query?.name__unaccent__icontains,
        router.query?.description__unaccent__icontains,
        router.query?.is_active,
        router.query?.parent,
        router.query?.enable_assign_worktitle,
        router.query?.enable_custom_catalogs
    ]

    useEffect(()=>{
        getOrgLevelsOptions() 
    },[])

    useEffect(() => {
        let page = router.query.page ? parseInt(router.query.page) : 1;
        let size = router.query.size ? parseInt(router.query.size) : 10;
        let filters = getFiltersJB(validFilters(), ['catalog']);
        getOrgLevels(filters, page, size)
    }, [...watchQuerys])

    const validFilters = () => {
        let filters = { ...router.query };
        filters.is_active = filters.is_active
            ? filters.is_active : 'true';
        if (filters.is_active == 'all') delete filters.is_active;
        return filters;
    }

    const actionCreate = async (values) => {
        try {
            await WebApiOrgStructure.createOrgLevel(values);
            message.success('Nivel organizacional registrado')
            getOrgLevels(org_filters, org_page, org_page_size)
            getOrgLevelsOptions()
        } catch (e) {
            console.log(e)
            message.error('Nivel organizacional no registrado')
        }
    }

    const actionUpdate = async (values) => {
        try {
            await WebApiOrgStructure.updateOrgLevel(itemToEdit?.id, values)
            message.success('Nivel organizacional actualizado')
            getOrgLevels(org_filters, org_page, org_page_size)
            getOrgLevelsOptions()
        } catch (e) {
            console.log(e)
            message.error('Nivel organizacional no actualizado')
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

    const isEdit = useMemo(() => Object.keys(itemToEdit).length > 0, [itemToEdit])

    return (
        <>
            <SearchLevels
                title={nameCatalog}
                actionAdd={() => setOpenModal(true)}
            />
            {router.query?.tree == 'true' ? (
                <TreeLevels/>
            ):(
                <TableLevels showEdit={showEdit} />
            )}
            <ModalLevels
                visible={openModal}
                title={isEdit
                    ? 'Editar nivel organizacional'
                    : 'Agregar nivel organizacional'
                }
                textSave={isEdit ? 'Actualizar' : 'Guardar'}
                actionForm={isEdit ? actionUpdate : actionCreate}
                itemToEdit={itemToEdit}
                close={closeEdit}
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
    }
}

export default connect(
    mapState, {
    getOrgLevels,
    getOrgLevelsOptions
}
)(MainLevels);