import React, { useEffect } from 'react';
import MainLayout from '../../../layout/MainLayout';
import { Breadcrumb } from 'antd';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../libs/auth';
import { useRouter } from 'next/router';
import SearchCandidates from '../../../components/jobbank/candidates/SearchCandidates';
import TableCandidates from '../../../components/jobbank/candidates/TableCandidates';
import { getCandidates } from '../../../redux/jobBankDuck';

const index = ({
    currentNode,
    getCandidates
}) => {

    const router = useRouter();

    useEffect(()=>{
        if(currentNode) getCandidates(currentNode.id);
    },[currentNode])

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
                <Breadcrumb.Item>Candidatos</Breadcrumb.Item>
            </Breadcrumb>
            <div
                className={'container'}
                style={{
                    display: 'flex',
                    gap: 24,
                    flexDirection: 'column',
                }}>
                <SearchCandidates/>
                <TableCandidates/>
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
    mapState,{ getCandidates }
)(withAuthSync(index));