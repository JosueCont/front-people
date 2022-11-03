import React, { useEffect } from 'react';
import MainLayout from '../../../layout/MainLayout';
import { Breadcrumb } from 'antd';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import { getPersonsCompany } from '../../../redux/UserDuck';
import { getInfoStrategy } from '../../../redux/jobBankDuck';
import DetailsStrategies from './DetailsStrategies';

const AddOrEditStrategies = ({
  action = 'add',
  currentNode,
  getPersonsCompany,
  getInfoStrategy
}) => {

  const router = useRouter();

  useEffect(()=>{
    if(currentNode) getPersonsCompany(currentNode.id);
  },[currentNode])

  useEffect(()=>{
    if(router.query.id && action == 'edit'){
      getInfoStrategy(router.query.id)
    }
  },[router])

  return (
    <MainLayout currentKey={'jb_strategies'} defaultOpenKeys={['job_bank']}>
      <Breadcrumb>
        <Breadcrumb.Item
          className={'pointer'}
          onClick={() => router.push({ pathname: '/home/persons/'})}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item>Bolsa de trabajo</Breadcrumb.Item>
        <Breadcrumb.Item
          className={'pointer'}
          onClick={() => router.push({ pathname: '/jobbank/strategies'})}
        >
          Estrategias
        </Breadcrumb.Item>
        <Breadcrumb.Item>{action == 'add' ? 'Nueva' : 'Expediente'}</Breadcrumb.Item>
      </Breadcrumb>
      <div className={'container'}>
        <DetailsStrategies action={action}/>
      </div>
    </MainLayout>
  )
}

const mapState = (state) =>{
  return{
    currentNode: state.userStore.current_node
  }
}

export default connect(
  mapState,{
    getPersonsCompany,
    getInfoStrategy
  }
)(AddOrEditStrategies);