import React, { useState, useEffect } from 'react';
import MyModal from '../../../common/MyModal';
import { Button, Input, Row, Col, Form, Select, Checkbox } from 'antd';
import { useSelector } from 'react-redux';
import { onlyNumeric, ruleWhiteSpace } from '../../../utils/rules';
import { optionsStatusSelection } from '../../../utils/constant';

const FiltersSelection = ({
    visible,
    close = () =>{},
    onFinish = ()=>{},
    formSearch
}) => {

    const {
        list_vacancies_options,
        load_vacancies_options,
    } = useSelector(state => state.jobBankStore);
    const [loading, setLoading] = useState(false);

    const onFinishSearch = (values) =>{
        setLoading(true)
        setTimeout(()=>{
            close()
            setLoading(false)
            onFinish(values);
        },1000)
    }

    const setValue = (key, val) => formSearch.setFieldsValue({[key]: val});

    return (
        <MyModal
            title='Configurar filtros'
            visible={visible}
            close={close}
            closable={!loading}
            widthModal={700}
        >
            <Form
                onFinish={onFinishSearch}
                form={formSearch}
                layout='vertical'
                initialValues={{is_other: false}}
            >
                <Row gutter={[16,0]}>
                    <Col span={12}>
                        <Form.Item
                            label='Nombre'
                            name='name'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input placeholder='Buscar por nombre'/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Apellidos'
                            name='lastname'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input placeholder='Buscar por apellidos'/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Correo'
                            name='email'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input placeholder='Buscar por correo'/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Teléfono'
                            name='phone'
                            rules={[onlyNumeric]}
                        >
                            <Input placeholder='Buscar por teléfono'/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Estatus'
                            name='status'
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder='Seleccionar una opción'
                                options={optionsStatusSelection}
                                optionFilterProp='label'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='vacant'
                            label='Vacante'
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                disabled={load_vacancies_options}
                                loading={load_vacancies_options}
                                optionFilterProp='children'
                            >
                                {list_vacancies_options?.length > 0 && list_vacancies_options.map(item => (
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.job_position}
                                    </Select.Option>
                                ))}
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

export default FiltersSelection