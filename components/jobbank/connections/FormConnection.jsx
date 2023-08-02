import React from 'react';
import {
    Col,
    Input,
    Form,
    Select,
    Checkbox
} from 'antd';
import {
    ruleRequired,
    ruleWhiteSpace
} from '../../../utils/rules';
import { optionsTypeConnection } from '../../../utils/constant';

const FormConnection = ({showActive=true }) => {
    return (
        <>
                <Col xs={24} md={12} xl={8} xxl={6} style={{display: 'none'}}>
                    <Form.Item name='is_valid' label='¿Es válido?' valuePropName='checked'>
                        <Checkbox/>
                    </Form.Item>
                </Col>
            {showActive && (
                <Col xs={24} md={12} xl={8} xxl={6}>
                    <Form.Item
                        name='is_active'
                        label='¿Activar aplicación?'
                        rules={[ruleRequired]}
                    >
                        <Select
                            allowClear
                            placeholder='Seleccionar una opción'
                        >
                            <Select.Option value={true} key={true}>Sí</Select.Option>
                            <Select.Option value={false} key={false}>No</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
            )}
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='conection_type'
                    label='Tipo de conexión'
                    rules={[ruleRequired]}
                >
                    <Select
                        allowClear
                        showSearch
                        disabled
                        placeholder='Seleccionar una opción'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='label'
                        options={optionsTypeConnection}
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='name'
                    label='Nombre'
                    rules={[ruleRequired, ruleWhiteSpace]}
                >
                    <Input
                        maxLength={20}
                        placeholder='Nombre de la conexión'
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='code'
                    label='Código'
                    rules={[ruleRequired, ruleWhiteSpace]}
                >
                    <Input
                        disabled
                        maxLength={10}
                        placeholder='Código de la conexión'
                    />
                </Form.Item>
            </Col>
        </>
    )
}

export default FormConnection;