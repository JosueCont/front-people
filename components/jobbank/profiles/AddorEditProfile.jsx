import React, { useEffect } from 'react';
import MainLayout from '../../../layout/MainLayout';
import { Breadcrumb } from 'antd';
import DetailsProfiles from './DetailsProfiles';
import { connect } from 'react-redux';
import {
    getProfilesTypes,
    getVacantFields,
    getClientsOptions
} from '../../../redux/jobBankDuck';
import { useRouter } from 'next/router';

const AddorEditProfile = ({
    action = 'add',
    currentNode,
    getProfilesTypes,
    getVacantFields,
    getClientsOptions
}) => {

    const router = useRouter();

    useEffect(()=>{
        if(currentNode){
            getProfilesTypes(currentNode.id)
            getVacantFields(currentNode.id)
            getClientsOptions(currentNode.id)
        };
    },[currentNode])

    return (
        <MainLayout currentKey={'jb_profiles'} defaultOpenKeys={["recruitmentSelection",'job_bank']}>
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
                    Template de vacante
                </Breadcrumb.Item>
                <Breadcrumb.Item>{action == 'add' ? 'Nuevo' : 'Expediente'}</Breadcrumb.Item>
            </Breadcrumb>
            <div className={'container'}>
                <DetailsProfiles action={action}/>
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
        getProfilesTypes,
        getVacantFields,
        getClientsOptions
    }
)(AddorEditProfile);