import React, {useState, useEffect} from 'react';
import {
  Row,
  Col,
  Button,
  Table,
  Input,
  Modal,
  Tag,
  Form,
  Space,
  Dropdown,
  Menu,
  message,
  Tooltip
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
} from "@ant-design/icons";
import CreateProfile from './CreateProfile';
import DeleteProfile from './DeleteProfile';
import { connect } from 'react-redux';
import { editProfile, deleteProfile} from '../../../redux/assessmentDuck';

const PerfilesTable = ({
    profiles,
    load_profiles,
    currentNode,
    editProfile,
    deleteProfile,
    ...props
}) => {

    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [profilesSelected, setProfilesSelected] = useState([]);
    const [itemProfile, setItemProfile] = useState({});
    const [profileKeys, setProfileKeys] = useState([]);
    const [viewList, setViewList] = useState(false);

    const viewModalEdit = (item) =>{
        setItemProfile(item)
        setOpenModalEdit(true)
    }

    const hideModalEdit = () =>{
        setOpenModalEdit(false)
        setItemProfile({})
    }

    const viewModalDelete = (item) =>{
        setViewList(false)
        setProfilesSelected([item])
        setOpenModalDelete(true)
    }

    const hideModalDelete = () =>{
        setOpenModalDelete(false)
        setProfilesSelected([])
        setProfileKeys([])
    }

    const viewModalList = (item) =>{
        setViewList(true)
        setProfilesSelected(item.competences)
        setOpenModalDelete(true)
    }

    const viewModalManyDelete = () =>{
        setViewList(false)
        if(profilesSelected.length > 1){
            setOpenModalDelete(true)
        }else{
            setOpenModalDelete(false)
            message.error("Selecciona al menos dos perfiles")
        }
    }

    const onFinishEdit = async (values) =>{
        let data = {
            ...values,
            description: values.name,
            node_id: currentNode.id
        };
        let resp = await editProfile(itemProfile.id, data);
        if(resp){
            message.success("Perfil actualizado")
        }else if(!resp){
            message.error("Perfil no actualizado")
        }
    }

    const onFinishDelete = async (ids) =>{
        hideModalDelete()
        let resp = await deleteProfile({profiles_id: ids}, currentNode.id)
        if(resp){
            if(ids.length > 1){
                message.success("Perfiles eliminados")
            }else{
                message.success("Perfil eliminado")
            }
        }else if(!reps){
            if(ids.length > 1){
                message.error("Perfiles no eliminados")
            }else{
                message.error("Perfil no eliminado")
            }
        }
    }

    const menuTable = () => {
        return (
            <Menu>
                <Menu.Item
                    key={1}
                    icon={<DeleteOutlined/>}
                    onClick={()=>viewModalManyDelete()}
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
                    onClick={()=> viewModalEdit(item)}
                >
                    Editar
                </Menu.Item>
                <Menu.Item
                    key={2}
                    icon={<DeleteOutlined/>}
                    onClick={()=> viewModalDelete(item)}
                >
                    Eliminar
                </Menu.Item>
            </Menu>
        );
    };

    const rowSelection = {
        selectedRowKeys: profileKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setProfileKeys(selectedRowKeys)
            setProfilesSelected(selectedRows)
        }
    }

    const columns_perfiles= [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Competencias',
            render: (item) =>{
                return (
                    <Space>
                        {item.competences?.length > 0 ? (
                            <Tooltip title='Ver competencias'>
                                <EyeOutlined
                                    style={{cursor: 'pointer'}}
                                    onClick={()=>viewModalList(item)}
                                />
                            </Tooltip>
                        ):(
                            <EyeInvisibleOutlined />
                        )}
                        <Tag
                            icon={<FileTextOutlined style={{color:'#52c41a'}} />}
                            color={'green'}
                            style={{fontSize: '14px'}}
                        >
                            {item.competences ? item.competences.length : 0}
                        </Tag>
                    </Space>
                )
                
            }
        },
        {
            title: ()=> {
                return(
                    <Dropdown overlay={menuTable}>
                        <Button size="small">
                            <EllipsisOutlined />
                        </Button>
                    </Dropdown>
                )
            },
            render: (item) =>{
                return (
                    <Dropdown overlay={()=> menuItem(item)}>
                        <Button size="small">
                            <EllipsisOutlined />
                        </Button>
                    </Dropdown>
                )
            }
        }
    ]

    return (
        <>
            <Row gutter={[24,24]} style={{marginTop: '24px'}}>
                <Col span={24}>
                    <Table
                        size={'small'}
                        rowKey={'id'}
                        columns={columns_perfiles}
                        loading={load_profiles}
                        dataSource={profiles?.results}
                        rowSelection={rowSelection}
                        locale={{
                            emptyText: load_profiles
                                ? "Cargando..."
                                : "No se encontraron resultados.",
                        }}
                    />
                </Col>
            </Row>
            <CreateProfile
                title={'Editar perfil'}
                visible={openModalEdit}
                close={()=>hideModalEdit()}
                actionForm={onFinishEdit}
                recordProfile={itemProfile}
            />
            <DeleteProfile
                visible={openModalDelete}
                close={()=> hideModalDelete()}
                profilesSelected={profilesSelected}
                actionDelete={onFinishDelete}
                viewlist={viewList}
            />
        </>
    )
}

const mapState = (state) => {
    return {
        profiles: state.assessmentStore.profiles,
        load_profiles: state.assessmentStore.load_profiles,
        currentNode: state.userStore.current_node,
    };
};

export default connect(
    mapState,{
        editProfile,
        deleteProfile
    }
)(PerfilesTable);