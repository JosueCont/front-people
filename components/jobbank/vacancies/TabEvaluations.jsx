import React, { useState, useEffect } from 'react'
import { Menu, Table, Button, Dropdown, Switch, Alert } from 'antd'
import {
  EllipsisOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import ListItems from '../../../common/ListItems';
import ModalVacancies from './ModalVacancies';
import { EditorState, convertFromHTML, ContentState } from 'draft-js';

const TabEvaluations = ({ 
  evaluationList, 
  setEvaluationList, 
  idVacant, 
  addEvaluationVacant,
  updateEvaluation,
  deleteEvaluation,
  changeEvaluationstatus
}) => {

  const [openModal, setOpenModal] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [itemToEdit, setItemToEdit] = useState({});
  const [itemToDelete, setItemToDelete] = useState({});
  const [msgHTML, setMsgHTML] = useState("<p></p>");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const actionCreate = async (values) => {
    values.instructions = msgHTML
    addEvaluationVacant(values)
  }

  const actionUpdate = (values) =>{
    if(Object.keys(itemToEdit).length > 0){
      values.instructions = msgHTML
      updateEvaluation(itemToEdit.id, values)
    }
}

const actionDelete = () =>{
  if(Object.keys(itemToDelete).length > 0){
    deleteEvaluation(itemToDelete.id)
  }
}


const openModalRemove = (item) =>{
    setItemToDelete(item)
    setOpenModalDelete(true)
}

const openModalEdit = (item)=>{
    setItemToEdit(item)
    if(!item.instructions) return;
    setMsgHTML(item.instructions);
    let convert = convertFromHTML(item.instructions);
    let htmlMsg = ContentState.createFromBlockArray(convert);
    let template = EditorState.createWithContent(htmlMsg);
    setEditorState(template);
    setOpenModal(true)
}

const closeModal = () =>{
    setOpenModal(false)
    setMsgHTML('<p></p>');
    setItemToEdit({})
    setEditorState(EditorState.createEmpty())
}

const closeModalDelete = () =>{
    setOpenModalDelete(false)
    setItemToDelete({})
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
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Tipo',
      dataIndex: 'source',
      key: 'source',
      render: (source) => source === 1? 'Khor' : 'Cliente'
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url'
    },
    {
      title: 'Estatus',
      render: (record) => (
        <Switch 
          checked = { record.is_active? true : false }
          checkedChildren="Activo" 
          unCheckedChildren="Inactivo"
          onChange={(e) => changeEvaluationstatus(record.id, e)}
        />
      )
    },
    {
      title: ()=> (
          <Button disabled={ idVacant? false : true } size='small' onClick={()=> setOpenModal(true)}>
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
      {
        !idVacant && 

        <Alert
        message={`Para agregar evaluaciones, primero deberás guardar la vacante`}
        type="warning"
        showIcon
        style={{marginBottom: 16}}
    />
      }
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
        setMsgHTML = { setMsgHTML }
        setEditorState = {setEditorState}
        editorState = { editorState }
      />
      <ListItems
        title='¿Estás seguro de eliminar esta evaluación?'
        visible={openModalDelete}
        keyTitle='name'
        close={closeModalDelete}
        itemsToList={[itemToDelete]}
        actionConfirm={actionDelete}
        timeLoad={1000}
      />
    </>
  )
}

export default TabEvaluations