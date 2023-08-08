import React, {
    useState,
    useEffect,
    useMemo
} from 'react';
import { connect } from 'react-redux';
import { getPersonType } from '../../../../redux/catalogCompany';
import SearchCatalogs from '../SearchCatalogs';
import ModalPersons from './ModalPersons';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
    Table,
    Space,
    message
} from 'antd';
import WebApiPeople from '../../../../api/WebApiPeople';
import ListItems from '../../../../common/ListItems';

const TablePersons = ({
    currentNode,
    nameCatalog,
    getPersonType,
    cat_person_type,
    load_person_type
}) => {

    const urlBase = '/person/person-type/';
    const [openModal, setOpenModal] = useState();
    const [itemToEdit, setItemToEdit] = useState({});
    const [itemsSelected, setItemsSelected] = useState([]);
    const [openDelete, setOpenDelete] = useState(false);

    // useEffect(()=>{
    //     if(!currentNode) return;
    //     getPersonType(currentNode?.id)
    // },[currentNode])

    const actionCreate = async (values) => {
        try {
            let body = { ...values, node: currentNode?.id };
            await WebApiPeople.createRegisterCatalogs(urlBase, body);
            message.success('Tipo registrado')
            getPersonType(currentNode?.id)
        } catch (e) {
            console.log(e)
            message.error('Tipo no registrado')
        }
    }

    const actionUpdate = async (values) => {
        try {
            await WebApiPeople.updateRegisterCatalogs(
                `${urlBase}${itemToEdit?.id}/`, values
            )
            message.success('Tipo actualizado')
            getPersonType(currentNode?.id)
        } catch (e) {
            console.log(e)
            message.error('Tipo no actualizado')
        }
    }

    const actionDelete = async () => {
        try {
            let id = itemsSelected?.at(-1).id;
            await WebApiPeople.deleteRegisterCatalogs(`${urlBase}${id}/`)
            message.success('Tipo eliminado')
            getPersonType(currentNode?.id)
        } catch (e) {
            console.log(e)
            message.error('Tipo no eliminado')
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
                loading={load_person_type}
                dataSource={cat_person_type}
                pagination={{
                    hideOnSinglePage: true,
                    showSizeChanger: false,
                }}
            />
            <ModalPersons
                visible={openModal}
                close={closeModal}
                itemToEdit={itemToEdit}
                actionForm={isEdit ? actionUpdate : actionCreate}
                textSave={isEdit ? 'Actualizar' : 'Guardar'}
                title={isEdit
                    ? 'Editar tipo de persona'
                    : 'Agregar tipo de persona'
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
        cat_person_type: state.catalogStore.cat_person_type,
        load_person_type: state.catalogStore.load_person_type,
        currentNode: state.userStore.current_node
    };
};

export default connect(
    mapState, {
        getPersonType
    }
)(TablePersons);