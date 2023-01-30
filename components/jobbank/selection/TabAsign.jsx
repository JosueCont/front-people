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
import ListItems from '../../../common/ListItems';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { optionsStatusAsignament, optionsSourceType } from "../../../utils/constant";

const TabAsign = ({ loading, setLoading, assesments, processSelection, asignaments, getAssesmets }) => {

  const router = useRouter()
  const [openModal, setOpenModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState({})
  const [search, setSearch] = useState('')
  const [ searchAsignaments, setSearchAsignaments ] = useState([])

  let dataSource = searchAsignaments.length > 0? searchAsignaments : asignaments

  const closeModal = () =>{
    setOpenModal(false)
  }

  const actionCreate = async(values) => {
    setLoading(true)
    values.candidate_vacancy = processSelection
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

  const menuItem = (item) => {
    return (
            <Menu>
                <Menu.Item
                    key='1'
                    icon={<EditOutlined/>}
                    // onClick={()=> router.push({
                    //     pathname: `/jobbank/vacancies/edit`,
                    //     query: {...router.query, id: item.id }
                    // })}
                >
                    Editar
                </Menu.Item>
                <Menu.Item
                    key='2'
                    icon={<DeleteOutlined/>}
                    // onClick={()=> openModalRemove(item)}
                >
                    Eliminar
                </Menu.Item>
              </Menu>
    )
  }

  // const actionDelete = async (id) =>{
  //   try {
  //     await WebApiJobBank.deleteVacancyAssesmentCandidateVacancy(id);
  //     getAssesmets();
  //     message.success('Evaluación eliminada');
  //   } catch (e) {
  //     console.log(e)
  //     message.error('Evaluación no eliminada');
  //   }
  // }

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
      title: 'Contraseña',
      dataIndex: 'password'
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
        title='Asignar evaluación'
        visible = { openModal }
        close = { closeModal }
        textSave = 'Asignar'
        assesments = { assesments }
        actionForm = {actionCreate}
      />
    </>
  )
}

export default TabAsign