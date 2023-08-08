import React, {
    useState,
    useEffect,
    useMemo
} from 'react';
import { connect } from 'react-redux';
import { getBranches } from '../../../../redux/catalogCompany';
import SearchCatalogs from '../SearchCatalogs';
import ModalOffices from './ModalOffices';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
    Table,
    Space,
    message
} from 'antd';
import WebApiPeople from '../../../../api/WebApiPeople';
import ListItems from '../../../../common/ListItems';

const TableOffices = ({
    currentNode,
    nameCatalog,
    getBranches,
    cat_branches,
    load_branches
}) => {

    const [openModal, setOpenModal] = useState();
    const [itemToEdit, setItemToEdit] = useState({});
    const [itemsSelected, setItemsSelected] = useState([]);
    const [openDelete, setOpenDelete] = useState(false);

    const actionCreate = async (values) => {
        try {
            let body = { ...values, node: currentNode?.id };
            await WebApiPeople.saveBranch(body);
            message.success('Sucursal registrada')
            getBranches(currentNode?.id)
        } catch (e) {
            console.log(e)
            message.error('Sucursal no registrada')
        }
    }

    const actionUpdate = async (values) => {
        try {
            await WebApiPeople.updateBranch(itemToEdit?.id, values)
            message.success('Sucursal actualizada')
            getBranches(currentNode?.id)
        } catch (e) {
            console.log(e)
            message.error('Sucursal no actualizada')
        }
    }

    const actionDelete = async () => {
        try {
            let id = itemsSelected?.at(-1).id;
            await WebApiPeople.deleteBranch(id)
            message.success('Sucursal eliminada')
            getBranches(currentNode?.id)
        } catch (e) {
            console.log(e)
            message.error('Sucursal no eliminada')
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
            title: 'Código',
            dataIndex: 'code',
            key: 'code'
        },
        {
            title: 'Sucursal',
            dataIndex: 'name',
            key: 'name', 
        },
        {
            title: 'Registro patronal',
            dataIndex: ['patronal_registration', 'code'],
            key: ['patronal_registration', 'code']
        },
        {
            title: 'Acciones',
            width: 80,
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
                columns={columns}
                loading={load_branches}
                dataSource={cat_branches}
                pagination={{
                    hideOnSinglePage: true,
                    showSizeChanger: false,
                }}
            />
            <ModalOffices
                visible={openModal}
                close={closeModal}
                itemToEdit={itemToEdit}
                actionForm={isEdit ? actionUpdate : actionCreate}
                textSave={isEdit ? 'Actualizar' : 'Guardar'}
                title={isEdit
                    ? 'Editar sucursal'
                    : 'Agregar sucursal'
                }
            />
            <ListItems
                title='¿Estás seguro de eliminar esta sucursal?'
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
        cat_branches: state.catalogStore.cat_branches,
        load_branches: state.catalogStore.load_branches,
        currentNode: state.userStore.current_node
    };
};

export default connect(
    mapState, {
        getBranches
    }
)(TableOffices);