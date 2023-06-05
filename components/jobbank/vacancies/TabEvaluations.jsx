import React, { useState, useEffect } from 'react'
import { Menu, Table, Button, Dropdown, Switch, Alert } from 'antd'
import {
  EllipsisOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import WebApiAssessment from '../../../api/WebApiAssessment';
import ListItems from '../../../common/ListItems';
import ModalVacancies from './ModalVacancies';
import { EditorState, convertFromHTML, ContentState } from 'draft-js';
import ViewAssessments from './ViewAssessments';

const TabEvaluations = ({ 
  evaluationList, 
  setEvaluationList, 
  idVacant, 
  addEvaluationVacant,
  updateEvaluation,
  deleteEvaluation,
  changeEvaluationstatus,
  currentNodeId
}) => {

  const [openModal, setOpenModal] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [showModalSurveys, setShowModalSurveys] = useState(false);
  const [itemToEdit, setItemToEdit] = useState({});
  const [itemToDelete, setItemToDelete] = useState({});
  const [msgHTML, setMsgHTML] = useState("<p></p>");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [evaluationsGroup, setEvaluationsGroup] = useState([])
  const [itemGroup, setItemGroup] = useState([]);

  useEffect(() => {
    if(currentNodeId){
      getNodeEvaluationsGroup(currentNodeId)
    }
  },[currentNodeId])

  const getNodeEvaluationsGroup = async (id) => {
    let stringId = id.toString()
    try {
      let response = await WebApiAssessment.getOnlyGroupAssessmentByNode(stringId);
      setEvaluationsGroup(response.data)
    } catch (e) {
      console.log(e)
      return e.response;
    }
  }

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

const openViewModal = (item) => {
  let ids = item?.group_assessment.map((item) => item.id)
  let result = evaluationsGroup.filter(item => ids.includes(item.id));
  setShowModalSurveys(true)
  setItemGroup(result)
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
      render: (source) => source === 1? 'KHOR+' : 'Cliente'
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      render: (url) => url || '----------'
    },
    {
      title: 'Grupos de evaluaciones',
      render: (item) => (
        item.group_assessment.length > 0 && (

          <Button 
            icon={<EyeOutlined />}
            disabled = { item.group_assessment.length > 0 ? false : true }
            onClick ={() => openViewModal(item)}
          />

        )

      )
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
        evaluationsGroup = { evaluationsGroup }
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
        {showModalSurveys && (
          <ViewAssessments
            title={'Lista de evaluaciones'}
            visible={showModalSurveys}
            setVisible={setShowModalSurveys}
            item={itemGroup.length > 0 && itemGroup}
          />
        )}
    </>
  )
}

export default TabEvaluations