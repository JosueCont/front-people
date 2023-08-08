import React, {
    useState,
    useEffect,
    useMemo
} from 'react';
import { connect } from 'react-redux';
import { getTags } from '../../../../redux/catalogCompany';
import SearchCatalogs from '../SearchCatalogs';
import ModalTags from './ModalTags';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
    Table,
    Space,
    message
} from 'antd';
import WebApiPeople from '../../../../api/WebApiPeople';
import ListItems from '../../../../common/ListItems';

const TableTags = ({
    currentNode,
    nameCatalog,
    getTags,
    cat_tags,
    load_tags
}) => {

    const urlBase = '/business/tag/';
    const [openModal, setOpenModal] = useState();
    const [itemToEdit, setItemToEdit] = useState({});
    const [itemsSelected, setItemsSelected] = useState([]);
    const [openDelete, setOpenDelete] = useState(false);

    const actionCreate = async (values) => {
        try {
            let body = { ...values, node: currentNode?.id };
            await WebApiPeople.createRegisterCatalogs(urlBase, body);
            message.success('Etiqueta registrada')
            getTags(currentNode?.id)
        } catch (e) {
            console.log(e)
            message.error('Etiqueta no registrada')
        }
    }

    const actionUpdate = async (values) => {
        try {
            let body = {...values, node: currentNode?.id};
            await WebApiPeople.updateRegisterCatalogs(
                `${urlBase}${itemToEdit?.id}/`, body
            )
            message.success('Etiqueta actualizada')
            getTags(currentNode?.id)
        } catch (e) {
            console.log(e)
            message.error('Etiqueta no actualizada')
        }
    }

    const actionDelete = async () => {
        try {
            let id = itemsSelected?.at(-1).id;
            await WebApiPeople.deleteRegisterCatalogs(`${urlBase}${id}/`)
            message.success('Etiqueta eliminada')
            getTags(currentNode?.id)
        } catch (e) {
            console.log(e)
            message.error('Etiqueta no eliminada')
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
            title: 'Descripción',
            dataIndex: 'description',
            key: 'description'
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
                loading={load_tags}
                dataSource={cat_tags}
                pagination={{
                    hideOnSinglePage: true,
                    showSizeChanger: false,
                }}
            />
            <ModalTags
                visible={openModal}
                close={closeModal}
                itemToEdit={itemToEdit}
                actionForm={isEdit ? actionUpdate : actionCreate}
                textSave={isEdit ? 'Actualizar' : 'Guardar'}
                title={isEdit
                    ? 'Editar etiqueta'
                    : 'Agregar etiqueta'
                }
            />
            <ListItems
                title='¿Estás seguro de eliminar esta etiqueta?'
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
        cat_tags: state.catalogStore.cat_tags,
        load_tags: state.catalogStore.load_tags,
        currentNode: state.userStore.current_node
    };
};

export default connect(
    mapState, {
        getTags
    }
)(TableTags);