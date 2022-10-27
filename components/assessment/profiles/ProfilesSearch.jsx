import React, {useState, useEffect} from 'react';
import {
  Row,
  Col,
  Button,
  Input,
  message
} from 'antd';
import {
    PlusOutlined,
    SearchOutlined,
    SyncOutlined,
} from "@ant-design/icons";
import CreateProfile from './CreateProfile';
import { connect } from 'react-redux';
import { addProfile, getProfiles } from '../../../redux/assessmentDuck';
import WebApiAssessment from '../../../api/WebApiAssessment';

const PerfilesSearch = ({
    currentNode,
    addProfile,
    getProfiles,
    ...props
}) => {

    const [openModal, setOpenModal] = useState(false);
    const [nameToSearch, setNameToSearch] = useState('');

    const onFinishAdd = async (values) =>{
        let data = {
            ...values,
            description: values.name,
            node_id: currentNode.id
        };
        let resp = await addProfile(data);
        if(resp){
            message.success("Perfil agregado")
        }else if(!resp){
            message.error("Perfil no agregado")
        }
    }

    const onFinishSearch = () =>{
        let query = '';
        if(nameToSearch.trim()){
            query = `&name=${nameToSearch.trim()}`
        }else{
            query = '';
            setNameToSearch('')
        }
        getProfiles(currentNode.id, query)
    }

    const deleteFilter = () =>{
        setNameToSearch('')
        getProfiles(currentNode.id, '')
    }

    return (
        <>
            <Row gutter={[24,24]}>
                <Col span={12} style={{display:'flex', gap: '16px'}}>
                    <Input
                        placeholder={'Buscar por nombre del perfil'}
                        onChange={({target})=> setNameToSearch(target.value)}
                        value={nameToSearch}
                    />
                    <Button icon={<SearchOutlined />} onClick={()=> onFinishSearch()}/>
                    <Button icon={<SyncOutlined />} onClick={()=> deleteFilter()} />
                </Col>
                <Col span={12} style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Button onClick={()=>setOpenModal(true)}><PlusOutlined /> Agregar perfil</Button>
                </Col>
            </Row>
            <CreateProfile
                title={'Crear perfil'}
                visible={openModal}
                close={()=>setOpenModal(false)}
                actionForm={onFinishAdd}
            />
        </>
    )
}

const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node,
    };
};
  
export default connect(
    mapState, {
        addProfile,
        getProfiles
    }
)(PerfilesSearch);