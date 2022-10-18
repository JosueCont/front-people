import React, { useRef, useState, useEffect } from 'react';
import { Row, Col, Form, Input, Select, Button} from 'antd';
import {
    ruleRequired,
    ruleWhiteSpace,
    ruleURL
} from '../../../utils/rules';
import { useSelector } from 'react-redux';

const TabClient = () =>{

    const list_sectors = useSelector(state => state.jobBankStore.list_sectors);
    const [optionsSectors, setOptionsSectors] = useState([]);

    useEffect(()=>{
        getOptionsSectors()
    },[])

    const getOptionsSectors = () =>{
        if(Object.keys(list_sectors).length <= 0 ) return false;
        if(list_sectors.results.length <= 0) return false;
        let options = list_sectors.results.map(item=>{
            return{
                value: item.id,
                key: item.id,
                label: item.name
            }
        })
        setOptionsSectors(options)
    }

    return (
        <Row gutter={[24,0]} style={{margin: '24px 12px'}}>
            <Col span={12}>
                <Form.Item
                    name={'name'}
                    rules={[ruleRequired, ruleWhiteSpace]}
                >
                    <Input maxLength={50} placeholder={'Escriba un nombre'}/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    name={'description'}
                    rules={[ruleWhiteSpace]}
                >
                    <Input maxLength={50} placeholder={'Escriba una descripción'}/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item name={'sector'}>
                    <Select
                        placeholder={'Seleccione un sector'}
                        notFoundContent={'No se encontraron resultados'}
                        options={optionsSectors}
                    />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item 
                    name={'website'}
                    rules={[ruleURL]}
                >
                    <Input placeholder={'Escriba la url de su sitio'}/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    name={'business_name'}
                    rules={[ruleWhiteSpace]}
                    // style={{marginBottom: 0}}
                >
                    <Input maxLength={50} placeholder={'Razón social'}/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    name={'comments'}
                    rules={[ruleWhiteSpace]}
                    // style={{marginBottom: 0}}
                >
                    <Input placeholder={'Comentarios'}/>
                </Form.Item>
            </Col>
        </Row>
    )
}

export default TabClient;