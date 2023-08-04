import React, {
    useState,
    useEffect,
    useMemo
} from 'react';
import { connect } from 'react-redux';
import { getDepartmets } from '../../../../redux/catalogCompany';
import SearchCatalogs from '../SearchCatalogs';
import ModalDepartments from './ModalDepartments';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
    Table,
    Space,
    message
} from 'antd';
import WebApiPeople from '../../../../api/WebApiPeople';
import ListItems from '../../../../common/ListItems';

const TableDepartments = ({
    currentNode,
    nameCatalog,
    getDepartmets,
    cat_departments,
    load_departments
}) => {

    const [openModal, setOpenModal] = useState();
    const [itemToEdit, setItemToEdit] = useState({});
    const [itemsSelected, setItemsSelected] = useState([]);
    const [openDelete, setOpenDelete] = useState(false);

    const actionCreate = async (values) => {
        try {
            let body = { ...values, node: currentNode?.id };
            await WebApiPeople.createRegisterCatalogs(
                "/business/department/", body
            )
            message.success('Departamento registrado')
            getDepartmets(currentNode?.id)
        } catch (e) {
            console.log(e)
            message.error('Departamento no registrado')
        }
    }

    const actionUpdate = async (values) => {
        try {
            await WebApiPeople.updateRegisterCatalogs(
                `/business/department/${itemToEdit?.id}/`, values
            )
            message.success('Departamento actualizado')
            getDepartmets(currentNode?.id)
        } catch (e) {
            console.log(e)
            message.error('Departamento no actualizado')
        }
    }

    const actionDelete = async () => {
        try {
            let id = itemsSelected?.at(-1).id;
            await WebApiPeople.deleteRegisterCatalogs(
                `/business/department/${id}/`
            )
            message.success('Departamento eliminado')
            getDepartmets(currentNode?.id)
        } catch (e) {
            console.log(e)
            message.error('Departamento no eliminado')
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

    const showDelete = (item) =>{
        setItemsSelected([item])
        setOpenDelete(true)
    }

    const closeDelete = () =>{
        setItemsSelected([])
        setOpenDelete(false)
    }

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Descripción',
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: 'Código',
            dataIndex: 'code',
            key: 'code'
        },
        {
            title: 'Acciones',
            width: 80,
            render: (item) => (
                <Space>
                    <EditOutlined onClick={() => showEdit(item)} />
                    <DeleteOutlined onClick={()=> showDelete(item)}/>
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
                columns={columns}
                loading={load_departments}
                dataSource={cat_departments}
                pagination={{
                    hideOnSinglePage: true,
                    showSizeChanger: false,
                }}
            />
            <ModalDepartments
                visible={openModal}
                close={closeModal}
                itemToEdit={itemToEdit}
                actionForm={isEdit ? actionUpdate : actionCreate}
                textSave={isEdit ? 'Actualizar' : 'Guardar'}
                title={isEdit
                    ? 'Editar departamento'
                    : 'Agregar departamento'
                }
            />
            <ListItems
                title='¿Estás seguro de eliminar este departamento?'
                visible={openDelete}
                keyTitle='name'
                keyDescription='description'
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
        cat_departments: state.catalogStore.cat_departments,
        load_departments: state.catalogStore.load_departments,
        currentNode: state.userStore.current_node,
        permissions: state.userStore.permissions
    }
}

export default connect(
    mapState, {
    getDepartmets
}
)(TableDepartments);