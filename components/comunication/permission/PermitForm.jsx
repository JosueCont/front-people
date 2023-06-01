import React from 'react';
import {
    Form,
    Row,
    Col,
    Button,
    Input
} from 'antd';
import { useSelector } from 'react-redux';

const PermitForm = ({
    showModal = () => { },
    showConfirm = () => { },
    infoPermit = {}
}) => {

    const {
        permit
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
                    name='departure_date'
                    label='Fecha inicio'
                >
                    <Input size='large' readOnly placeholder='Fecha de salida' />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12} xl={8}>
                <Form.Item
                    name='return_date'
                    label='Fecha fin'
                >
                    <Input size='large' readOnly placeholder='Fecha de regreso' />
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
            <Col span={24}>
                <Form.Item
                    name='reason'
                    label='Motivo'
                >
                    <Input.TextArea
                        showCount
                        maxLength={200}
                        placeholder='Motivo'
                        readOnly
                        autoSize={{ minRows: 4, maxRows: 4 }}
                    />
                </Form.Item>
            </Col>
            {infoPermit?.status == 1 && (
                <Col span={24} className='content-end' style={{ gap: 8 }}>
                    {permit.reject_permit && (
                        <Button onClick={() => showModal()}>
                            Rechazar
                        </Button>
                    )}
                    {permit.approve_permit && (
                        <Button onClick={() => showConfirm()}>
                            Aprobar
                        </Button>
                    )}
                </Col>
            )}
        </Row>
    )
}

export default PermitForm