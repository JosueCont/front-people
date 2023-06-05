import React from 'react';
import {
    Form,
    Row,
    Col,
    Button,
    Input
} from 'antd';
import { useSelector } from 'react-redux';
import FileUpload from '../../jobbank/FileUpload';

const InabilityForm = ({
    showModal = () => { },
    showConfirm = () => { },
    infoInability = {}
}) => {

    const {
        incapacity
    } = useSelector(state => state.userStore.permissions);

    return (
        <Row gutter={[24, 0]}>
            <Col xs={24} md={12} lg={12} xl={8}>
                <Form.Item
                    name='status'
                    label='Estatus'
                >
                    <Input size='large' readOnly placeholder='Estatus' />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12} xl={8}>
                <Form.Item
                    name='person'
                    label='Colaborador'
                >
                    <Input size='large' readOnly placeholder='Colaborador' />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12} xl={8}>
                <Form.Item
                    name='invoice'
                    label='Folio'
                >
                    <Input size='large' readOnly placeholder='Folio' />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12} xl={8}>
                <Form.Item
                    name='incapacity_type'
                    label='Tipo de incapacidad'
                >
                    <Input size='large' readOnly placeholder='Tipo de incapacidad' />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12} xl={8}>
                <Form.Item
                    name='imss_classification'
                    label='Clasificación (IMSS)'
                >
                    <Input size='large' readOnly placeholder='Clasificación (IMSS)' />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12} xl={8}>
                <Form.Item
                    name='category'
                    label='Categoría'
                >
                    <Input size='large' readOnly placeholder='Categoría' />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12} xl={8}>
                <Form.Item
                    name='subcategory'
                    label='Subcategoría'
                >
                    <Input size='large' readOnly placeholder='Subcategoría' />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12} xl={8}>
                <Form.Item
                    name='departure_date'
                    label='Fecha inicio'
                >
                    <Input size='large' readOnly placeholder='Fecha inicio' />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12} xl={8}>
                <Form.Item
                    name='return_date'
                    label='Fecha fin'
                >
                    <Input size='large' readOnly placeholder='Fecha fin' />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12} xl={8}>
                <Form.Item
                    name='requested_days'
                    label='Días solicitados'
                >
                    <Input size='large' readOnly placeholder='Días solicitados' />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12} xl={8}>
                <Form.Item
                    name='payroll_apply_date'
                    label='Fecha aplicación en Nómina'
                >
                    <Input size='large' readOnly placeholder='Fecha aplicación en Nómina' />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12} xl={8}>
                <FileUpload
                    sizeInput='large'
                    upload={false}
                    label='Documentación'
                    keyName='document_name_read'
                    urlPreview={infoInability?.document}
                />
            </Col>
            {infoInability?.status == 1 && (
                <Col span={24} className='content-end' style={{ gap: 8 }}>
                    {incapacity.reject_incapacity && (
                        <Button onClick={() => showModal()}>
                            Rechazar
                        </Button>
                    )}
                    {incapacity.approve_incapacity && (
                        <Button onClick={() => showConfirm()}>
                            Aprobar
                        </Button>
                    )}
                </Col>
            )}
        </Row>
    )
}

export default InabilityForm