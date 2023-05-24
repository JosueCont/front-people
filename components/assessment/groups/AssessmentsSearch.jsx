import React, { useState } from 'react';
import {
    Form,
    Row,
    Col,
    Input,
    Button,
    Tooltip,
    Space,
    message
} from 'antd';
import {
    SearchOutlined,
    PlusOutlined,
    SyncOutlined,
    UploadOutlined,
    DownloadOutlined,
    InboxOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import AssessmentsGroup from './AssessmentsGroup';
import { API_URL } from '../../../config/config';
import ModalUploadGroups from './ModalUploadGroups';
import WebApiAssessment from '../../../api/WebApiAssessment';

const AssessmentsSearch = ({
    getListGroups = () => { },
    onFinish = () => { }
}) => {

    const permissions = useSelector(state => state.userStore.permissions.person);
    const { current_node } = useSelector(state => state.userStore)
    const [formSearch] = Form.useForm();
    const [openAdd, setOpenAdd] = useState(false);
    const [openFile, setOpenFile] = useState(false)

    const actionCreate = async (values) => {
        try {
            let body = { ...values, node: current_node?.id };
            await WebApiAssessment.createGroupAssessments(body);
            getListGroups(current_node?.id);
            message.success('Grupo agregado');
        } catch (e) {
            console.log(e)
            // Se devuelve un error para no cerrar el modal
            let txt = e.response?.data?.message;
            if (e.response.status === 400) return txt;
            let msg = txt ? txt : 'Grupo no agregado';
            message.error(msg)
            return 'ERROR';
        }
    }

    const sendFile = async (values) => {
        try {
            let resp = await WebApiAssessment.uploadMassiveGroups(values);
            getListGroups(current_node?.id);
            let text = resp?.data?.message;
            let msg = text ? text : 'Archivo cargado';
            message.success(msg);
            return msg;
        } catch (e) {
            console.log(e);
            message.error('Archivo no cargado');
        }
    }

    const onReset = () => {
        formSearch.resetFields();
        onFinish({ name: null })
    }

    return (
        <>
            <Row gutter={[0, 24]} justify='space-between'>
                <Col xs={24} xl={14} xxl={12}>
                    <Form
                        form={formSearch}
                        layout='vertical'
                        onFinish={onFinish}
                    >
                        <Row gutter={[24, 0]}>
                            <Col style={{ display: 'flex', gap: 24, flex: '1' }}>
                                <Form.Item
                                    name='name'
                                    style={{ flex: '1', marginBottom: 0 }}
                                >
                                    <Input
                                        allowClear
                                        placeholder='Buscar'
                                        style={{ border: '1px solid black' }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col>
                                <Space size={[24, 0]}>
                                    <Button htmlType="submit">
                                        <SearchOutlined />
                                    </Button>
                                    <Button onClick={() => onReset()}>
                                        <SyncOutlined />
                                    </Button>
                                </Space>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col className='content-end'>
                    <Space size={[24, 0]}>
                        <Tooltip title="Descargar layout para carga masiva">
                            <Button
                                href={`${API_URL}/static/plantilla_grupo_assessments.xlsx`}
                                icon={<DownloadOutlined />}
                            />
                        </Tooltip>
                        <Tooltip title="Cargar archivo">
                            <Button
                                onClick={() => setOpenFile(true)}
                                icon={<UploadOutlined />}
                            />
                        </Tooltip>
                        {permissions.create && (
                            <Button
                                icon={<PlusOutlined />}
                                onClick={() => setOpenAdd(true)}
                            >
                                Agregar grupo
                            </Button>
                        )}
                    </Space>
                </Col>
            </Row>
            <AssessmentsGroup
                title='Crear grupo'
                visible={openAdd}
                close={() => setOpenAdd(false)}
                actionForm={actionCreate}
            />
            <ModalUploadGroups
                visible={openFile}
                close={() => setOpenFile(false)}
                sendFile={sendFile}
            />
        </>
    )
}

export default AssessmentsSearch