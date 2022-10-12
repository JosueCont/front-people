import React, { useState } from 'react';
import {
  Table,
  Button,
  Menu,
  Dropdown,
  message,
  Switch
} from 'antd';
import {
  ClearOutlined,
  SearchOutlined,
  FileTextOutlined,
  PlusCircleOutlined,
  CloseOutlined,
  EllipsisOutlined,
  DeleteOutlined,
  SyncOutlined,
  EditOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { getVacancies } from '../../../redux/jobBankDuck';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { useRouter } from 'next/router';

const TableVacancies = ({
  load_jobbank,
  list_vacancies,
  getVacancies
}) => {

  const router = useRouter();

  const menuTable = () => {
    return (
      <Menu>
        <Menu.Item
          key={1}
          icon={<DeleteOutlined/>}
          onClick={()=>openModalManyDelete()}
        >
          Eliminar
        </Menu.Item>
      </Menu>
    );
  };

  const menuItem = (item) => {
    return (
      <Menu>
        <Menu.Item
          key={1}
          icon={<EditOutlined/>}
          onClick={()=> router.push({
            pathname: `/jobbank/vacancies/edit`,
            query:{ id: item.id }
          })}
        >
          Editar
        </Menu.Item>
        <Menu.Item
          key={2}
          icon={<DeleteOutlined/>}
          // onClick={()=> openModalRemove(item)}
        >
          Eliminar
        </Menu.Item>
      </Menu>
    );
  };

  const columns = [
    {
      title: 'Nombre',
      render: ({job_position})=>{
        return(
          <span>{job_position}</span>
        )
      }
    },
    {
      title: 'Descripción',
      render: ({description}) =>{
        return(
          <span>{description}</span>
        )
      }
    },
    {
      title: ()=> {
        return(
          <Dropdown overlay={menuTable}>
            <Button size={'small'}>
              <EllipsisOutlined />
            </Button>
          </Dropdown>
        )
      },
      render: (item) =>{
        return (
          <Dropdown overlay={()=> menuItem(item)}>
            <Button size={'small'}>
              <EllipsisOutlined />
            </Button>
          </Dropdown>
        )
      }
    }
  ]

  return (
    <Table
      columns={columns}
      loading={load_jobbank}
      dataSource={list_vacancies.results}
      locale={{ emptyText: load_jobbank
        ? 'Cargando...'
        : 'No se encontraron resultados'
      }}
    />
  )
}

const mapState = (state) =>{
  return{
    list_vacancies: state.jobBankStore.list_vacancies,
    load_jobbank: state.jobBankStore.load_jobbank
  }
}

export default connect(
  mapState, {
    getVacancies
  }
)(TableVacancies);