import React, { useEffect } from 'react';
import MainLayout from '../../../layout/MainLayout';
import { Breadcrumb } from 'antd';
import TableVacancies from '../../../components/jobbank/vacancies/TableVacancies';
import SearchVacancies from '../../../components/jobbank/vacancies/SearchVacancies';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../libs/auth';
import { useRouter } from 'next/router';
import {
    getVacancies,
    getClientsOptions
} from '../../../redux/jobBankDuck';
import { getPersonsCompany } from '../../../redux/UserDuck';

const index = ({
    getVacancies,
    currentNode,
    getClientsOptions,
    getPersonsCompany
}) => {

    const router = useRouter();

    useEffect(()=>{
        if(currentNode){
            getVacancies(currentNode.id);
            getClientsOptions(currentNode.id);
            getPersonsCompany(currentNode.id);
        }
    },[currentNode])

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
                <Breadcrumb.Item>Vacantes</Breadcrumb.Item>
            </Breadcrumb>
            <div
                className={'container'}
                style={{
                    display: 'flex',
                    gap: 24,
                    flexDirection: 'column',
                }}>
                <SearchVacancies/>
                <TableVacancies/>
            </div>
        </MainLayout>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node,
    }
}

export default connect(
    mapState,{
        getVacancies,
        getClientsOptions,
        getPersonsCompany
    }
)(withAuthSync(index));