import React, {useEffect, useState} from "react";
import {FormattedMessage} from 'react-intl'
import MainLayout from "../../../layout/MainLayout";
import FormGroup from '../../../components/intranet/FormGroup'
import {
    Row,
    Col,
    Table,
    Breadcrumb,
    Button,
    Form,
    Modal,
    Input,
    Select,
    Tooltip,
    Popconfirm, message
} from "antd";
import {
    EditOutlined,
    EyeOutlined,
    DeleteOutlined,
    QuestionCircleOutlined, UserOutlined,
} from "@ant-design/icons";
import axiosApi from "../../../libs/axiosApi";
import Axios from 'axios'
import {API_URL} from "../../../config/config";
import DetailGroup from "../../../components/intranet/DetailGroup";
import {useRouter} from "next/router";
import {withAuthSync} from "../../../libs/auth";
import AddPeopleGroup from "../../../components/intranet/AddPeopleGroup";


const GroupView = ({...props}) => {
    const router = useRouter();

    const {Column} = Table;
    const [groups, setGroups] = useState(null)
    const [loading, setLoading] = useState(false)

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [edit, setEdit] = useState(false);
    const [group, setGroup] = useState({})
    const [isDetail, setIsDetail] = useState(false);

    const [modalAddVisible, setModalAddVisible] = useState(false);
    const [companyId, setCompanyId] = useState(null);


    useEffect(()=>{
        setCompanyId(localStorage.getItem('company'))
    },[companyId])

    useEffect(()=>{
       getGroups();
    },[companyId])

    const showModal = () => {
        setEdit(false)
        setIsModalVisible(true);
    };


    const handleCancel = () => {
        setIsModalVisible(false);
        getGroups()
    };



    const goToDetails = (group) => {
        console.log('detail', group)
        setGroup(group)
        setIsDetail(true)
    }

    const goToAddUpdatePerson = (group) => {
        setGroup(group)
        setModalAddVisible(true)
    }
    const handleCancelAddUpdatePerson = () => {
        setModalAddVisible(false);
        getGroups()
    };

    const goToEdit = (group) => {
        setEdit(true)
        setGroup(group)
        setIsModalVisible(true)
        console.log('edit', group)
    }

    function confirmDelete(group) {
        Axios.delete(API_URL + `/intranet/group/${group.id}/`).then(res => {
            getGroups()
            message.success('' + group.name + " fue eliminado");
        }).catch(e => {

        })
    }

    const getGroups = async () => {
        setLoading(true)
        setGroups([])
        try {
            const url = API_URL + `/intranet/group/?node=${companyId}`;
            console.log(url)
            const res = await Axios.get(url);
            if (res.data.count > 0) {
                setGroups(res.data.results);
            }
            setLoading(false)
        } catch (e) {
            setLoading(false)
            console.log(e)
        }

    }

    return <MainLayout currentKey="11.1">
        <Breadcrumb className={"mainBreadcrumb"} key="mainBreadcrumb">
            <Breadcrumb.Item
                className={"pointer"}
                onClick={() => router.push({pathname: "/home"})}
            >
                <FormattedMessage defaultMessage="Inicio" id="web.init"/>
            </Breadcrumb.Item>
            <Breadcrumb.Item><FormattedMessage defaultMessage="Grupos" id="header.groups"/></Breadcrumb.Item>
        </Breadcrumb>
        <div className="container" style={{width: "100%"}}>
            <Button type="primary" onClick={showModal}>
                + Agregar nuevo
            </Button>

            {
                isModalVisible &&
                <FormGroup isEdit={edit} group={group} companyId={companyId} visible={isModalVisible} close={handleCancel}/>
            }
            {
                isDetail &&
                <DetailGroup group={group} visible={isDetail} close={setIsDetail}/>
            }

            {
                modalAddVisible &&
                <AddPeopleGroup group={group} visible={modalAddVisible} setVisible={handleCancelAddUpdatePerson}/>
            }

            <Table
                dataSource={groups}
                key="table_groups"
                loading={loading}
                locale={{emptyText: loading ? "Cargando..." : "No se encontraron resultados."}}
            >
                <Column
                    title="Imagen"
                    dataIndex="image"
                    key="image"
                    render={(image) =>
                        image ? <img src={image} style={{width: 100}}/> : 'N/A'
                    }
                />
                <Column
                    title="Nombre"
                    dataIndex="name"
                    key="name"
                />
                <Column
                    title="Descripción"
                    dataIndex="description"
                    key="description"
                />
                <Column
                    title="Acciones"
                    key="actions"
                    render={(text, record) => (
                        <>

                            <UserOutlined
                                className="icon_actions"
                                onClick={() => goToAddUpdatePerson(record)}
                                key={"goAddPersons_" + record.id}
                            />

                            <EyeOutlined
                                className="icon_actions"
                                onClick={() => goToDetails(record)}
                                key={"goDetails_" + record.id}
                            />
                            <EditOutlined
                                className="icon_actions"
                                onClick={() => goToEdit(record)}
                                key={"edit_" + record.id}
                            />


                            <Popconfirm title={"¿Deseas eliminar " + record.name + "?"}
                                        okText="Aceptar"
                                        cancelText="Cancelar"
                                        onConfirm={() => confirmDelete(record)}
                                        icon={<QuestionCircleOutlined style={{color: 'red'}}/>}>
                                <DeleteOutlined
                                    className="icon_actions"
                                    key={"delete_" + record.id}
                                />
                            </Popconfirm>


                        </>
                    )}
                />
            </Table>
        </div>
    </MainLayout>
}
export default withAuthSync(GroupView);
