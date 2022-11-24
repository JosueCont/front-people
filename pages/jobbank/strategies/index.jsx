import React, { useEffect } from 'react';
import MainLayout from '../../../layout/MainLayout';
import { Breadcrumb } from 'antd';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../libs/auth';
import { useRouter } from 'next/router';
import {
    getStrategies,
    getClientsOptions,
    getVacanciesOptions
} from '../../../redux/jobBankDuck';
import TableStrategies from '../../../components/jobbank/strategies/TableStrategies';
import SearchStrategies from '../../../components/jobbank/strategies/SearchStrategies';

const index = ({
    currentNode,
    getStrategies,
    getClientsOptions,
    getVacanciesOptions
}) => {

    const router = useRouter();

    useEffect(()=>{
        if(currentNode){
            getStrategies(currentNode.id);
            getClientsOptions(currentNode.id);
            getVacanciesOptions(currentNode.id);
        }
    },[currentNode])

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
                <Breadcrumb.Item>Estrategias</Breadcrumb.Item>
            </Breadcrumb>
            <div
                className={'container'}
                style={{
                    display: 'flex',
                    gap: 24,
                    flexDirection: 'column',
                }}>
                <SearchStrategies/>
                <TableStrategies/>
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
        getStrategies,
        getClientsOptions,
        getVacanciesOptions
    }
)(withAuthSync(index));