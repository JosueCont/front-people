import React, { useEffect } from 'react';
import MainLayout from '../../../layout/MainLayout';
import { Breadcrumb } from 'antd';
import DetailsCandidates from './DetailsCandidates';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { getInfoCandidate } from '../../../redux/jobBankDuck';

const AddOrEditCandidates = ({
    action = 'add',
    currentNode,
    getInfoCandidate
}) => {

    const router = useRouter();

    useEffect(()=>{
        if(router.query.id && action == 'edit'){
            getInfoCandidate(router.query.id)
        }
    },[router])

    return (
        <MainLayout currentKey={'jb_candidates'} defaultOpenKeys={['job_bank']}>
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
                    onClick={() => router.push({ pathname: '/jobbank/profiles'})}
                >
                    Candidatos
                </Breadcrumb.Item>
                <Breadcrumb.Item>{action == 'add' ? 'Nuevo' : 'Expediente'}</Breadcrumb.Item>
            </Breadcrumb>
            <div className={'container'}>
                <DetailsCandidates action={action}/>
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
    mapState, { getInfoCandidate }
)(AddOrEditCandidates);