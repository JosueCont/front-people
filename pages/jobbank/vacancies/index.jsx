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
import { getFiltersJB } from '../../../utils/functions';

const index = ({
    getVacancies,
    currentNode,
    getClientsOptions,
    getPersonsCompany
}) => {

    const router = useRouter();

    useEffect(()=>{
        if(currentNode){
            getClientsOptions(currentNode.id);
            getPersonsCompany(currentNode.id);
        }
    },[currentNode])

    useEffect(()=>{
        if(currentNode){
            let page = router.query.page ? parseInt(router.query.page) : 1;
            let filters = getFiltersJB(router.query);
            getVacancies(currentNode.id, filters, page);
        }
    },[currentNode, router])

    return (
        <MainLayout currentKey='jb_vacancies' defaultOpenKeys={['job_bank']}>
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