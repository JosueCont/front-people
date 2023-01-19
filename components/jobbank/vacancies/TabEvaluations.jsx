import React, { useState, useEffect } from 'react'
import { Menu, Table, Button, Dropdown, Alert } from 'antd'
import {
  EllipsisOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import ListItems from '../../../common/ListItems';
import ModalVacancies from './ModalVacancies';

const TabEvaluations = ({ evaluationList, setEvaluationList }) => {

  const [openModal, setOpenModal] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [itemToEdit, setItemToEdit] = useState({});
  const [itemsToDelete, setItemsToDelete] = useState([]);

  const actionCreate = (values) => {
    console.log('Values', values)
    let newList = [...evaluationList, values]
    console.log('newList', newList)
    setEvaluationList(newList)
  }

  const actionUpdate = (values) =>{
    const updItem = (item, idx) =>
        itemToEdit.index == idx
            ? {...item, ...values}
            : item;
    let newList = evaluationsList.map(updItem);
    setContactList(newList);
}

const actionDelete = () =>{
  let index = itemsToDelete?.at(-1)?.index;
  let newList = [...evaluationList];
  newList.splice(index, 1);
  setEvaluationList(newList);
}

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
        dataSource={evaluationList}
        locale={{ emptyText: evaluationList.length > 0
          ? 'Cargando...'
          : 'No se encontraron resultados'
        }}
        pagination={{
            total: evaluationList.length,
            hideOnSinglePage: true,
            showSizeChanger: false
        }}
      />
      <ModalVacancies
        title={validateAction() && openModal ? 'Editar evaluación' : 'Agregar evaluación'}
        visible={openModal}
        close={closeModal}
        itemToEdit={itemToEdit}
        actionForm={validateAction() && openModal ? actionUpdate : actionCreate}
        textSave={validateAction() && openModal ? 'Actualizar' : 'Guardar'}
      />
      <ListItems
        title='¿Estás seguro de eliminar esta evaluación?'
        visible={openModalDelete}
        keyTitle='name'
        close={closeModalDelete}
        itemsToList={itemsToDelete}
        actionConfirm={actionDelete}
        timeLoad={1000}
      />
    </>
  )
}

export default TabEvaluations