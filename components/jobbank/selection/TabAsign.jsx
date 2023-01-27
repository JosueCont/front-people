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
import { SearchOutlined } from '@ant-design/icons';
import ModalAsignament from './ModalAsignment';
import ListItems from '../../../common/ListItems';
import WebApiJobBank from '../../../api/WebApiJobBank';

const TabAsign = ({ loading }) => {

  const router = useRouter()
  const [openModal, setOpenModal] = useState(false);

  const closeModal = () =>{
    setOpenModal(false)
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
      dataIndex: 'name'
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
      dataIndex: 'status_process'
    },
    {
      title: 'Tipo',
      dataIndex: 'type'
    },
  ]

  return (
    <>
      <Row gutter={[24,0]} className='tab-client'>
        <Col span={24} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <Col span={12}mstyle={{ textAlign: 'left' }}>
            <Input
              placeholder='Buscar...'
              suffix={<SearchOutlined />}
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
          />
        </Col>
      </Row>
      <ModalAsignament 
        title='Asignar evaluación'
        visible = { openModal }
        close = { closeModal }
        textSave = 'Asignar'
      />
    </>
  )
}

export default TabAsign