import React from 'react';
import MainLayout from '../../../layout/MainLayout';
import { Breadcrumb } from 'antd';
import { useRouter } from 'next/router';
import DetailsVacancies from './DetailsVacancies';

const AddOrEditVacancies = ({
  action = 'add'
}) => {

  const router = useRouter();

  return (
    <MainLayout currentKey={'jb_vacancies'} defaultOpenKeys={['job_bank']}>
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
          onClick={() => router.push({ pathname: '/jobbank/vacancies'})}
        >
          Vacantes
        </Breadcrumb.Item>
        <Breadcrumb.Item>{action == 'add' ? 'Nueva' : 'Expediente'}</Breadcrumb.Item>
      </Breadcrumb>
      <div className={'container'}>
        <DetailsVacancies action={action}/>
      </div>
    </MainLayout>
  )
}

export default AddOrEditVacancies;