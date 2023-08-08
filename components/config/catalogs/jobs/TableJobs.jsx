import React, {
    useState,
    useEffect,
    useMemo
} from 'react';
import { connect } from 'react-redux';
import { getProfiles } from '../../../../redux/assessmentDuck';
import { getJobs } from '../../../../redux/catalogCompany';
import SearchCatalogs from '../SearchCatalogs';
import ModalJobs from './ModalJobs';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
    Table,
    Space,
    message
} from 'antd';
import WebApiPeople from '../../../../api/WebApiPeople';
import ListItems from '../../../../common/ListItems';
import ListCatalogData from '../../../forms/ListCatalogData';

const TableJobs = ({
    currentNode,
    nameCatalog,
    getJobs,
    cat_job,
    load_jobs,
    getProfiles,
    general_config
}) => {

    const urlBase = '/business/job/';
    const [openModal, setOpenModal] = useState();
    const [itemToEdit, setItemToEdit] = useState({});
    const [itemsSelected, setItemsSelected] = useState([]);
    const [openDelete, setOpenDelete] = useState(false);

    // useEffect(()=>{
    //     if(!currentNode) return;
    //     getProfiles(currentNode?.id)
    // },[currentNode])

    const actionCreate = async (values) => {
        try {
            let body = { ...values, node: currentNode?.id };
            await WebApiPeople.createRegisterCatalogs(urlBase, body);
            message.success('Puesto registrado')
            getJobs(currentNode?.id)
        } catch (e) {
            console.log(e)
            message.error('Puesto no registrado')
        }
    }

    const actionUpdate = async (values) => {
        try {
            await WebApiPeople.updateRegisterCatalogs(
                `${urlBase}${itemToEdit?.id}/`, values
            )
            message.success('Puesto actualizado')
            getJobs(currentNode?.id)
        } catch (e) {
            console.log(e)
            message.error('Puesto no actualizado')
        }
    }

    const actionDelete = async () => {
        try {
            let id = itemsSelected?.at(-1).id;
            await WebApiPeople.deleteRegisterCatalogs(`${urlBase}${id}/`)
            message.success('Puesto eliminado')
            getJobs(currentNode?.id)
        } catch (e) {
            console.log(e)
            message.error('Puesto no eliminado')
        }
    }

    const isEdit = useMemo(() => Object.keys(itemToEdit).length > 0, [itemToEdit]);

    const showEdit = (item) => {
        setItemToEdit(item)
        setOpenModal(true)
    }

    const closeModal = () => {
        setItemToEdit({})
        setOpenModal(false)
    }

    const showDelete = (item) => {
        setItemsSelected([item])
        setOpenDelete(true)
    }

    const closeDelete = () => {
        setItemsSelected([])
        setOpenDelete(false)
    }

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name',
            show: true
        },
        {
            title: 'Código',
            dataIndex: 'code',
            key: 'code',
            show: true
        },
        {
            title: 'Centros de costos',
            dataIndex: 'cost_center',
            show: true,
            render: (item) => (
                <ListCatalogData
                    catalog='cat_cost_center'
                    attrName='code'
                    items={item}
                />
            )
        },
        {
            title: 'Etiquetas',
            dataIndex: 'tag',
            show: true,
            render: (item) => (
                <ListCatalogData
                    catalog='cat_tags'
                    attrName='name'
                    items={item}
                />
            )
        },
        {
            title: 'Perfil de competencias',
            show: general_config?.kuiz_enabled
        },
        {
            title: 'Acciones',
            width: 80,
            show: true,
            render: (item) => (
                <Space>
                    <EditOutlined onClick={() => showEdit(item)} />
                    <DeleteOutlined onClick={() => showDelete(item)} />
                </Space>
            )
        }
    ]

    return (
        <>
            <SearchCatalogs
                title={nameCatalog}
                actionAdd={() => setOpenModal(true)}
            />
            <Table
                rowKey='id'
                size='small'
                columns={columns.filter(item => item.show)}
                loading={load_jobs}
                dataSource={cat_job}
                pagination={{
                    hideOnSinglePage: true,
                    showSizeChanger: false,
                }}
            />
            <ModalJobs
                visible={openModal}
                close={closeModal}
                itemToEdit={itemToEdit}
                actionForm={isEdit ? actionUpdate : actionCreate}
                textSave={isEdit ? 'Actualizar' : 'Guardar'}
                title={isEdit
                    ? 'Editar puesto de trabajo'
                    : 'Agregar puesto de trabajo'
                }
            />
            <ListItems
                title='¿Estás seguro de eliminar este puesto?'
                visible={openDelete}
                keyTitle='name'
                keyDescription='code'
                close={closeDelete}
                itemsToList={itemsSelected}
                actionConfirm={actionDelete}
                timeLoad={1000}
            />
        </>
    )
}

const mapState = (state) => {
    return {
        cat_job: state.catalogStore.cat_job,
        load_jobs: state.catalogStore.load_jobs,
        currentNode: state.userStore.current_node,
        general_config: state.userStore.general_config,
    };
};

export default connect(
    mapState, {
        getJobs,
        getProfiles
    }
)(TableJobs);