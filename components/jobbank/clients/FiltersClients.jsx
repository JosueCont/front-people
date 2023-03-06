import React, { useState } from 'react';
import MyModal from '../../../common/MyModal';
import { Button, Input, Row, Col, Form, Select } from 'antd';
import { ruleWhiteSpace } from '../../../utils/rules';

const FiltersClients = ({
    visible,
    close = () =>{},
    onFinish = ()=>{},
    formSearch
}) => {

    const [loading, setLoading] = useState(false);

    const onFinishSearch = (values) =>{
        setLoading(true)
        setTimeout(()=>{
            close()
            setLoading(false)
            onFinish(values);
        },1000)
    }

    return (
        <MyModal
            title='Configurar filtros'
            visible={visible}
            close={close}
            closable={!loading}
            widthModal={500}
        >
            <Form
                onFinish={onFinishSearch}
                form={formSearch}
                layout='vertical'
            >
                <Row gutter={[16,0]}>
                    <Col span={24}>
                        <Form.Item
                            label='Nombre'
                            name='name__unaccent__icontains'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input
                                allowClear
                                className='input-with-clear'
                                maxLength={200}
                                placeholder='Buscar por nombre'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label='Estatus'
                            name='is_active'
                        >
                            <Select
                                allowClear
                                placeholder='Selecciona una opción'
                                notFoundContent='No se encontraron resultados'
                            >
                                <Select.Option value='true' key='true'>Activo</Select.Option>
                                <Select.Option value='false' key='false'>Inactivo</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24} className='content-end' style={{gap: 8}}>
                        <Button onClick={()=> close()}>
                            Cancelar
                        </Button>
                        <Button
                            loading={loading} 
                            htmlType='submit'
                        >
                            Aplicar
                        </Button>
                    </Col>
                </Row>
            </Form>
        </MyModal>
    )
}

export default FiltersClients