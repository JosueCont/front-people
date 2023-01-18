import React, { useState, useEffect } from 'react'
import { Row, Col, Input, Select, Form, Table, Button, Dropdown, Alert } from 'antd'
import {
  EllipsisOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import ListItems from '../../../common/ListItems';
import ModalVacancies from './ModalVacancies';

const TabEvaluations = ({ evaluationsList }) => {

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [itemToEdit, setItemToEdit] = useState({});
  const [itemsToDelete, setItemsToDelete] = useState([]);

  const openModalRemove = (item) =>{
    setItemsToDelete([item])
    setOpenModalDelete(true)
}

const openModalEdit = (item)=>{
    setItemToEdit(item)
    setOpenModal(true)
}

const closeModal = () =>{
    setOpenModal(false)
    setItemToEdit({})
}

const closeModalDelete = () =>{
    setOpenModalDelete(false)
    setItemsToDelete([])
}

const validateAction = () => Object.keys(itemToEdit).length > 0;

    const menuItem = (item) => {
        return (
            <Menu>
                <Menu.Item
                    key='1'
                    icon={<EditOutlined/>}
                    onClick={()=> openModalEdit(item)}
                >
                    Editar
                </Menu.Item>
                <Menu.Item
                    key='2'
                    icon={<DeleteOutlined/>}
                    onClick={()=> openModalRemove(item)}
                >
                    Eliminar
                </Menu.Item>
            </Menu>
        );
    };

  const listColumns = [
    {
      title: 'Usuario',
      dataIndex: 'user',
      key: 'user'
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: 'Url',
      dataIndex: 'url',
      key: 'url'
    },
    {
      title: ()=> (
          <Button size='small' onClick={()=> setOpenModal(true)}>
              Agregar
          </Button>
      ),
      width: 85,
      align: 'center',
      render: (item, record, index)=> (
          <Dropdown overlay={()=> menuItem({...item, index})}>
              <Button size='small'>
                  <EllipsisOutlined />
              </Button>
          </Dropdown>
      )
  }
  ]

  return (
    <>
      <Alert
        message={`Al modificar, eliminar o agregar una nueva evaluación
                es necesario "Guardar/Actualizar" para almacenar los cambios realizados, de lo
                contrario estos se perderán.`}
        type="warning"
        showIcon
        style={{marginBottom: 16}}
      />
      <Table
        className='table-custom'
        size='small'
        rowKey={(item, idx)=> idx}
        columns={listColumns}
        locale={{ emptyText: evaluationsList.length > 0
          ? 'Cargando...'
          : 'No se encontraron resultados'
        }}
        pagination={{
            total: evaluationsList.length,
            hideOnSinglePage: true,
            showSizeChanger: false
        }}
      />
      <ModalVacancies
        title={validateAction() && openModal ? 'Editar evaluación' : 'Agregar evaluación'}
        visible={openModal}
        close={closeModal}
        itemToEdit={itemToEdit}
        // actionForm={validateAction() && openModal ? actionUpdate : actionCreate}
        textSave={validateAction() && openModal ? 'Actualizar' : 'Guardar'}
      />
    </>
  )
}

export default TabEvaluations