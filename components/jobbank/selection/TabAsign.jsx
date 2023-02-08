import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import { 
  Row, 
  Col , 
  Form, 
  Input, 
  Select, 
  Button, 
  Table, 
  message, 
  Dropdown, 
  Menu } 
  from 'antd'
  import {
    ruleRequired,
    ruleWhiteSpace,
    ruleEmail,
    rulePhone
} from '../../../utils/rules';
import { SearchOutlined, EllipsisOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ModalAsignament from './ModalAsignment';
import { EditorState, convertFromHTML, ContentState } from 'draft-js';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { optionsStatusAsignament, optionsSourceType } from "../../../utils/constant";
import ListItems from '../../../common/ListItems';

const TabAsign = ({ loading, setLoading, assesments, processSelection, asignaments, getAssesmets }) => {

  const [openModal, setOpenModal] = useState(false);
  const [visibleDeleteModal, setVisibleDeleteModal ] = useState(false)
  const [itemToEdit, setItemToEdit] = useState({})
  const [itemsToDelete, setItemsToDelete ] = useState ({})
  const [msgHTML, setMsgHTML] = useState("<p></p>");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [ searchAsignaments, setSearchAsignaments ] = useState([])

  let dataSource = searchAsignaments.length > 0? searchAsignaments : asignaments
  let validateAction = Object.keys(itemToEdit).length > 0

  const closeModal = () =>{
    setOpenModal(false)
    setItemToEdit({})
    setMsgHTML("<p></p>")
  }

  const actionCreate = async(values) => {
    setLoading(true)
    values.candidate_vacancy = processSelection
    values.additional_information = msgHTML
    try {
      let response = await WebApiJobBank.addVacancyAssesmentCandidateVacancy(values)
      message.success('Evaluación Asignada')
      console.log('Response', response)
      getAssesmets(processSelection)
    } catch (error) {
      console.log('Error', error)
      message.error('Error al asignar evaluación')
    } finally {
      setLoading(false)
    }
  }

  const actionEdit = async (values) => {
    setLoading(true)
    let id = itemToEdit.id
    values.additional_information = msgHTML
    try {
      let response = await WebApiJobBank.editVacancyAssesmentCandidateVacancy(id, values)
      message.success('Evaluación Actualizada')
      console.log('Response', response)
      getAssesmets(processSelection)
    } catch (error) {
      console.log('Error', error)
      message.error('Error al actualizar evaluación')
    } finally {
      setLoading(false)
    }
  }

  const openEditModal = (item) => {
    setOpenModal(true)
    setItemToEdit(item)
    if(!item.additional_information) return;
    setMsgHTML(item.additional_information);
    let convert = convertFromHTML(item.additional_information);
    let htmlMsg = ContentState.createFromBlockArray(convert);
    let template = EditorState.createWithContent(htmlMsg);
    setEditorState(template);
  }

  const openDeleteModal = (item) => {
    setVisibleDeleteModal(true)
    setItemsToDelete(item)
  }

  
  const closeModalDelete = () => {
    setVisibleDeleteModal(false)
    setItemsToDelete({})
    setMsgHTML("<p></p>")
  }



  const menuItem = (item) => {
    return (
            <Menu>
                <Menu.Item
                    key='1'
                    icon={<EditOutlined/>}
                    onClick={()=> openEditModal(item)}
                >
                    Editar
                </Menu.Item>
                <Menu.Item
                    key='2'
                    icon={<DeleteOutlined/>}
                    onClick={()=> openDeleteModal(item)}
                >
                    Eliminar
                </Menu.Item>
              </Menu>
    )
  }

  const actionDelete = async () =>{
    setLoading(true)
    try {
      await WebApiJobBank.deleteVacancyAssesmentCandidateVacancy(itemsToDelete.id);
      message.success('Evaluación eliminada');
      getAssesmets(processSelection);
    } catch (e) {
      console.log(e)
      message.error('Evaluación no eliminada');
    } finally{
      setLoading(false)
    }
  }

  const columns = [
    {
      title: 'Nombre de evaluacón',
      render: (item) => item.vacant_assessment? item.vacant_assessment.name : ""
    },
    {
      title: 'Usuario',
      dataIndex: 'user'
    },
    {
      title: 'Estatus',
      dataIndex: 'status',
      render: (status) => {
        let labelStatus = optionsStatusAsignament.find((item) => item.value === status)?.label || ""

        return labelStatus
      }
    },
    {
      title: 'Tipo',
      render: (item) => {
        let labelSource = optionsSourceType.find((op) => op.value == item.vacant_assessment.source)?.label || ""
        return labelSource
      }
    },
    {
      render: (item) => {
        return( 
          <Dropdown overlay={ () => menuItem(item)}>
              <Button size={'small'}>
                  <EllipsisOutlined />
              </Button>
          </Dropdown>
      )}
    }
  ]

  return (
    <>
      <Row gutter={[24,0]} className='tab-client'>
        <Col span={24} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <Col span={12}mstyle={{ textAlign: 'left' }}>
            <Input
              placeholder='Buscar...'
              suffix={<SearchOutlined />}
              onChange = { ({target}) => {
                let searchTerm = target.value.trim().toLocaleLowerCase()
                let results = asignaments.filter((item) => 
                  item.vacant_assessment.name.trim().toLocaleLowerCase().includes(searchTerm)
                )
                setSearchAsignaments(results)
               } 
              }
            />
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Button onClick={ () => setOpenModal(true)}>
              Agregar
            </Button>
          </Col>
        </Col>
        <Col span={24}>
          <Table 
            key='id'
            columns={ columns }
            loading = { loading }
            dataSource = { dataSource }
            pagination = {{
              hideOnSinglePage: true,
              showSizeChanger: false
            }}
          />
        </Col>
      </Row>
      <ModalAsignament 
        title= { validateAction? 'Editar evaluación' : 'Asignar evaluación' }
        visible = { openModal }
        close = { closeModal }
        textSave = { validateAction? 'Actualizar' : 'Asignar' }
        assesments = { assesments }
        actionForm = { validateAction? actionEdit : actionCreate }
        itemToEdit = { itemToEdit }
        setMsgHTML = { setMsgHTML }
        setEditorState = {setEditorState}
        editorState = { editorState }
      />
      <ListItems
        title={'¿Estás seguro de eliminar este asignación?'}
        visible={visibleDeleteModal}
        keyTitle='vacant_assessment, name'
        close={closeModalDelete}
        itemsToList={[itemsToDelete]}
        actionConfirm={actionDelete}
      />
    </>
  )
}

export default TabAsign