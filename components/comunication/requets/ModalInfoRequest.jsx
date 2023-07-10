import React, { useState } from 'react';
import styled from '@emotion/styled';
import MyModal from '../../../common/MyModal';
import { Row, Col, Input, Form, Button } from 'antd';
import { useSelector } from 'react-redux';
import { getFullName, getValueFilter } from '../../../utils/functions';
import moment from 'moment';
import { ActionTypes } from 'redux-devtools';

const ContentFields = styled.div`
    background-color: #ffff;
    border-radius: 10px;
    padding: 8px;
    display: flex;
    flex-direction: column;
`;

const FormField = styled.div`
    display: flex;
    flex-direction: row;
    gap: 8px;
    :not(:last-child){
        padding-bottom: 4px;
        border-bottom: 1px solid #f0f0f0;
    }
    :not(:first-child){
        padding-top: 4px;
    }
`;

const Field = styled.div`
    display: flex;
    align-items: center;
    flex: 1;
    gap: 8px;
    & p{
        margin-bottom: 0px;
        font-weight: 700;
    }
`;

const ModalInfoRequest = ({
    visible = true,
    close = () => { },
    actionForm = () => { },
    itemRequest = {},
    actionType = '1'
}) => {

    const {
        vacation
    } = useSelector(state => state.userStore.permissions);

    const [formAction] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const [action, setAction] = useState("");
    const [showAction, setShowAction] = useState(false);

    const formatStart = 'YYYY-MM-DD';
    const formatEnd = 'DD/MM/YYYY';

    const openAction = (type) => {
        setShowAction(true)
        setAction(type)
    }

    const closeAction = () => {
        setShowAction(false)
        setAction("")
    }

    const onFinish = (values = {}) =>{
        setLoading(true);
        setTimeout(()=>{
            setLoading(false)
            actionForm[action](values,actionType)
            onClose()
        },2000)
    }

    const onClose = () =>{
        close()
        closeAction()
        formAction.resetFields()
    }

    const titleAction = {
        cancel: 'Cancelar solicitud de vacaciones',
        reject: 'Rechazar solicitud de vacaciones',
        approve: '¿Estás seguro aprobar la siguiente solicitud de vacaciones?'
    }

    const textAction = {
        cancel: 'Cancelar',
        reject: 'Rechazar y notificar',
        approve: 'Aprobar y notificar'
    }

    return (
        <MyModal
            title='Detalle solicitud'
            visible={visible}
            widthModal={500}
            close={onClose}
            closable={!loading}
        >
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <ContentFields>
                        <FormField>
                            <Field>
                                <p>Colaborador:</p>
                                <span>{itemRequest?.collaborator
                                    ? getFullName(itemRequest?.collaborator)
                                    : null
                                }</span>
                            </Field>
                        </FormField>
                        <FormField>
                            <Field>
                                <p>Jefe inmediato:</p>
                                <span>{itemRequest?.immediate_supervisor
                                    ? getFullName(itemRequest?.immediate_supervisor)
                                    : null
                                }</span>
                            </Field>
                        </FormField>
                        <FormField>
                            <Field>
                                <p>Periodo:</p>
                                <span>{itemRequest?.period} - {itemRequest?.period + 1}</span>
                            </Field>
                            <Field>
                                <p>Días solicitados:</p>
                                <span>{itemRequest?.days_requested}</span>
                            </Field>
                        </FormField>
                        <FormField>
                            <Field>
                                <p>Fecha inicio:</p>
                                <span>{itemRequest?.departure_date
                                    ? moment(itemRequest?.departure_date, formatStart).format(formatEnd)
                                    : null
                                }</span>
                            </Field>
                            <Field>
                                <p>Fecha fin:</p>
                                <span>{itemRequest?.return_date
                                    ? moment(itemRequest?.return_date, formatStart).format(formatEnd)
                                    : null
                                }</span>
                            </Field>
                        </FormField>
                    </ContentFields>
                </Col>
                {showAction ? (
                    <Col span={24}>
                        <ContentFields>
                            <span style={{ fontWeight: 700 }}>
                                {titleAction[action]}
                            </span>
                            {action !== 'approve' ? (
                                <Form onFinish={onFinish} layout='vertical'>
                                    <Form.Item
                                        label='Comentarios'
                                        name='comment'
                                        style={{ marginBottom: 4 }}
                                    >
                                        <Input.TextArea
                                            placeholder='Especificar motivo'
                                            autoSize={{ minRows: 4, maxRows: 4 }}
                                        />
                                    </Form.Item>
                                    <div className='content-end' style={{ marginTop: 8, gap: 8 }}>
                                        <Button disabled={loading} onClick={() => closeAction()}>
                                            Cerrar
                                        </Button>
                                        <Button loading={loading} htmlType='submit'>
                                            {textAction[action]}
                                        </Button>
                                    </div>
                                </Form>
                            ) : (
                                <div className='content-end' style={{ marginTop: 8, gap: 8 }}>
                                    <Button disabled={loading} onClick={() => closeAction()}>
                                        Cerrar
                                    </Button>
                                    <Button loading={loading} onClick={()=> onFinish()}>
                                        {textAction[action]}
                                    </Button>
                                </div>
                            )}
                        </ContentFields>
                    </Col>
                ) : (
                    <Col span={24} className='content-end' style={{ gap: 8 }}>
                        {vacation?.reject_vacation && (
                            <>
                                <Button onClick={() => openAction('cancel')}>Cancelar</Button>
                                {actionType == '2' && (
                                    <Button onClick={() => openAction('reject')}>Rechazar</Button>
                                )}
                            </>
                        )}
                        {vacation?.approve_vacation && actionType == '2' && (
                            <Button onClick={() => openAction('approve')}>Aprobar</Button>
                        )}
                    </Col>
                )}
            </Row>
        </MyModal>
    )
}

export default ModalInfoRequest