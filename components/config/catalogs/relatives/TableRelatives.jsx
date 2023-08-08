import React, {
    useState,
    useEffect,
    useMemo
} from 'react';
import { connect } from 'react-redux';
import { getRelationship } from '../../../../redux/catalogCompany';
import SearchCatalogs from '../SearchCatalogs';
import ModalRelatives from './ModalRelatives';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
    Table,
    Space,
    message
} from 'antd';
import WebApiPeople from '../../../../api/WebApiPeople';
import ListItems from '../../../../common/ListItems';

const TableRelatives = ({
    currentNode,
    nameCatalog,
    permissions,
    getRelationship,
    cat_relationship,
    load_relationship
}) => {

    const urlBase = '/business/relationship/';
    const [openModal, setOpenModal] = useState();
    const [itemToEdit, setItemToEdit] = useState({});
    const [itemsSelected, setItemsSelected] = useState([]);
    const [openDelete, setOpenDelete] = useState(false);
    
    const actionCreate = async (values) => {
        try {
            let body = { ...values, node: currentNode?.id };
            await WebApiPeople.createRegisterCatalogs(urlBase, body);
            message.success('Parentesco registrado')
            getRelationship(currentNode?.id)
        } catch (e) {
            console.log(e)
            message.error('Parentesco no registrado')
        }
    }

    const actionUpdate = async (values) => {
        try {
            await WebApiPeople.updateRegisterCatalogs(
                `${urlBase}${itemToEdit?.id}/`, values
            )
            message.success('Parentesco actualizado')
            getRelationship(currentNode?.id)
        } catch (e) {
            console.log(e)
            message.error('Parentesco no actualizado')
        }
    }

    const actionDelete = async () => {
        try {
            let id = itemsSelected?.at(-1).id;
            await WebApiPeople.deleteRegisterCatalogs(`${urlBase}${id}/`)
            message.success('Parentesco eliminado')
            getRelationship(currentNode?.id)
        } catch (e) {
            console.log(e)
            message.error('Parentesco no eliminado')
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
            key: 'name'
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
                    {permissions?.edit && <EditOutlined onClick={() => showEdit(item)} />}
                    {permissions?.delete && <DeleteOutlined onClick={() => showDelete(item)} />}
                </Space>
            )
        }
    ]

    return (
        <>
            <SearchCatalogs
                title={nameCatalog}
                actionAdd={() => setOpenModal(true)}
                showAdd={permissions?.create}
            />
            <Table
                rowKey='id'
                size='small'
                columns={columns}
                loading={load_relationship}
                dataSource={cat_relationship}
                pagination={{
                    hideOnSinglePage: true,
                    showSizeChanger: false,
                }}
            />
            <ModalRelatives
                visible={openModal}
                close={closeModal}
                itemToEdit={itemToEdit}
                actionForm={isEdit ? actionUpdate : actionCreate}
                textSave={isEdit ? 'Actualizar' : 'Guardar'}
                title={isEdit
                    ? 'Editar parentesco'
                    : 'Agregar parentesco'
                }
            />
            <ListItems
                title='¿Estás seguro de eliminar este parentesco?'
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
        cat_relationship: state.catalogStore.cat_relationship,
        load_relationship: state.catalogStore.load_relationship,
        currentNode: state.userStore.current_node,
        permissions: state.userStore.permissions.relationship
    };
};

export default connect(
    mapState, {
        getRelationship
    }
)(TableRelatives);