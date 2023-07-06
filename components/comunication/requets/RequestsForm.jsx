import React from 'react';
import { useSelector } from 'react-redux';
import {
    Form,
    Row,
    Col,
    Button,
    Input
} from 'antd';

const RequestsForm = ({
    showModal = () =>{},
    showConfirm = ()=>{},
    infoRequest = {},
    isAdmin
}) => {

    const {
        vacation
    } = useSelector(state =>  state.userStore.permissions);

    return (
        <Row gutter={[24, 0]}>
            <Col xs={24} md={12} xl={8}>
                <Form.Item
                    name='status'
                    label='Estatus'
                >
                    <Input size='large' readOnly placeholder='Estatus'/>
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8}>
                <Form.Item
                    name='person'
                    label='Colaborador'
                >
                    <Input size='large' readOnly placeholder='Colaborador'/>
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8}>
                <Form.Item
                    name='period'
                    label='Periodo'
                >
                    <Input size='large' readOnly placeholder='Periodo'/>
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8}>
                <Form.Item
                    name='departure_date'
                    label='Fecha inicio'
                >
                    <Input size='large' readOnly placeholder='Fecha de inicio'/>
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8}>
                <Form.Item
                    name='return_date'
                    label='Fecha fin'
                >
                    <Input size='large' readOnly placeholder='Fecha fin'/>
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8}>
                <Form.Item
                    name='days_requested'
                    label='Días solicitados'
                >
                    <Input size='large' readOnly placeholder='Días solicitados'/>
                </Form.Item>
            </Col>
            {/* <Col xs={24} md={12} xl={8}>
                <Form.Item
                    name='availableDays'
                    label='Días disponibles'
                >
                    <Input size='large' readOnly placeholder='Días disponibles'/>
                </Form.Item>
            </Col> */}
            <Col xs={24} md={12} xl={8}>
                <Form.Item
                    name='immediate_supervisor'
                    label='Jefe inmediato'
                >
                    <Input size='large' readOnly placeholder='Jefe inmediato'/>
                </Form.Item>
            </Col>
            <Col span={24} className='content-end' style={{gap: 8}}>
                {vacation?.reject_vacation && [1,5].includes(infoRequest?.status) && (
                    <Button onClick={()=> showModal('cancel')}>
                        Cancelar solicitud
                    </Button>
                )}
                {vacation?.reject_vacation && infoRequest?.status == 1 && isAdmin && (
                    <Button onClick={()=> showModal('reject')}>
                        Rechazar solicitud
                    </Button>
                )}
                {vacation?.approve_vacation && infoRequest?.status == 1 && isAdmin && (
                    <Button onClick={()=> showConfirm('approve')}>
                        Aprobar solicitud
                    </Button>
                )}
                {infoRequest?.status == 2 && isAdmin && (
                    <Button onClick={()=> showConfirm('reopen')}>
                        Reabrir solicitud
                    </Button>
                )}
            </Col>
        </Row>
    )
}

export default RequestsForm