import React, { useState, useEffect, useMemo } from 'react';
import MyModal from '../../../common/MyModal';
import {
    Form,
    Row,
    Col,
    Select,
    Button,
    Space,
    Input
} from 'antd';
import { getFullName } from '../../../utils/functions';

const ModalPassword = ({
    visible = false,
    close = () => { },
    actionForm = async () => { },
    itemPerson = {}
}) => {

    const [formPass] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = (values) => {
        setLoading(true)
        setTimeout(() => {
            actionForm(values)
            setLoading(false)
            onClose()
        }, 2000)
    }

    const onClose = () => {
        close()
        formPass.resetFields()
    }

    const rulePass = () => ({
        validator(_, value){
            if(!value) return Promise.reject('Este campo es requerido');
            if(value.includes(' ')) return Promise.reject('No están permitidos los espacios');
            if(value?.length < 6) return Promise.reject('La contraseña debe de tener mínimo 6 carácteres')
            return Promise.resolve()
        }
    })

    const ruleConfirm = ({getFieldValue}) =>({
        validator(_, value) {
            if(!value) return Promise.reject('Este campo es requerido');
            if(value.includes(' ')) return Promise.reject('No están permitidos los espacios');
            if(value?.length < 6) return Promise.reject('La contraseña debe de tener mínimo 6 carácteres');
            
            let one = getFieldValue('passwordOne');
            if(one !== value) return Promise.reject('Las contraseñas no coinciden');
            return Promise.resolve()
        }
    })

    const title = useMemo(()=>{
        let txt = 'Reestablecer contraseña';
        if(Object.keys(itemPerson).length <=0) return txt;
        return `${txt} a ${getFullName(itemPerson)}`;
    },[itemPerson])

    return (
        <MyModal
            title={title}
            visible={visible}
            close={onClose}
            widthModal={450}
            closable={!loading}
        >
            <Form
                form={formPass}
                layout='vertical'
                onFinish={onFinish}
            >
                <Row>
                    <Col span={24}>
                        <Form.Item
                            name='passwordOne'
                            label='Contraseña nueva'
                            rules={[rulePass]}
                        >
                            <Input.Password
                                placeholder='Contraseña nueva'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name='passwordTwo'
                            label='Confirmar contraseña'
                            dependencies={['passwordOne']}
                            rules={[ruleConfirm]}
                        >
                            <Input.Password placeholder='Confirmar contraseña'/>
                        </Form.Item>
                    </Col>
                    <Col span={24} className='content-end' style={{ gap: 8 }}>
                        <Button disabled={loading} onClick={() => onClose()}>
                            Cancelar
                        </Button>
                        <Button
                            loading={loading}
                            htmlType='submit'
                        >
                            Confirmar
                        </Button>
                    </Col>
                </Row>
            </Form>
        </MyModal>
    )
}

export default ModalPassword