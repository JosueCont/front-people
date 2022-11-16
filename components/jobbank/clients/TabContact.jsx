import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Input, List, Button } from 'antd';
import {
    ruleWhiteSpace,
    ruleEmail,
    rulePhone
} from '../../../utils/rules';
import { validateNum } from '../../../utils/functions';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';

const TabContact = ({
    contactList,
    setContactList,
    formClients
}) => {

    const [infoContact, setInfoContact] = useState({});

    const addContact = () =>{
        let check = [
            'name_contact',
            'contact_job',
            'contact_email',
            'contact_phone'
        ]
        let errors = formClients.getFieldsError();
        const _some = item => check.includes(item.name[0]) && item.errors.length > 0;
        let exist = errors.some(_some)
        if(exist) return;
        let newList = [...contactList, infoContact];
        setContactList(newList);
        setInfoContact({})
        const reset = item => formClients.setFieldsValue({[item]: null});
        check.forEach(reset);
    }

    const onChangeContact = ({ target }) =>{
        let { name, value } = target;
        setInfoContact({...infoContact, [name]: value})
    }

    const deleteItem = (idx) =>{
        let newList = [...contactList];
        newList.splice(idx, 1);
        setContactList(newList)
    }

    return (
        <Row gutter={[24,24]} className='tab-contact'>
            <Col xs={24} xl={14} xxl={16}>
                <Row gutter={[24,0]}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name='name_contact'
                            label='Nombre del contacto'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input
                                name='name'
                                maxLength={50}
                                placeholder='Nombre del contacto'
                                onChange={onChangeContact}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name='contact_job'
                            label='Ocupación del contacto'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input
                                name='job_position'
                                maxLength={100}
                                placeholder='Ocupación del contacto'
                                onChange={onChangeContact}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name='contact_email'
                            label='Correo del contacto'
                            rules={[ruleEmail]}
                        >
                            <Input
                                name='email'
                                maxLength={50}
                                placeholder='Correo del contacto'
                                onChange={onChangeContact}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name='contact_phone'
                            label='Teléfono del contacto'
                            rules={[rulePhone]}
                        >
                            <Input
                                name='phone'
                                placeholder='Teléfono del contacto'
                                maxLength={10}
                                onKeyPress={validateNum}
                                onChange={onChangeContact}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Button onClick={()=> addContact()}>Agregar</Button>
                    </Col>
                </Row>
            </Col>
            <Col xs={24} xl={10} xxl={8} className='list_interviewers'>
                <List
                    header='Contactos'
                    itemLayout='horizontal'
                    dataSource={contactList}
                    locale={{emptyText: 'No se encontraron resultados'}}
                    size='small'
                    renderItem={(item, idx) => (
                        <List.Item
                            key={`item_${idx}`}
                            actions={[<CloseOutlined onClick={()=> deleteItem(idx)}/>]}
                        >
                            <List.Item.Meta
                                title={`${item.name ?? ''} - ${item.job_position ?? ''}`}
                                description={`${item.email ?? ''} / ${item.phone ?? ''}`}
                            />
                        </List.Item>
                    )}
                />
            </Col>
        </Row>
    )
}

export default TabContact