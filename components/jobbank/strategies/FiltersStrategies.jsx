import React, { useState, useEffect, useMemo } from 'react';
import MyModal from '../../../common/MyModal';
import { Button, Input, Row, Col, Form, Select, Checkbox } from 'antd';
import { useSelector } from 'react-redux';
import { onlyNumeric, ruleWhiteSpace } from '../../../utils/rules';
import { optionsStatusVacant } from '../../../utils/constant';

const FiltersStrategies = ({
    visible,
    close = () =>{},
    onFinish = ()=>{},
    formSearch
}) => {

    const {
        list_vacancies_options,
        load_vacancies_options,
        list_clients_options,
        load_clients_options
    } = useSelector(state => state.jobBankStore);
    const [loading, setLoading] = useState(false);
    const client = Form.useWatch('customer', formSearch);

    const onFinishSearch = (values) =>{
        setLoading(true)
        setTimeout(()=>{
            close()
            setLoading(false)
            onFinish(values);
        },1000)
    }

    const onChangeClient = (value) =>{
        formSearch.setFieldsValue({vacant: null});
    }

    const optionsVacant = useMemo(() =>{
        if(!client) return list_vacancies_options;
        const options = item => item.customer?.id === client;
        return list_vacancies_options.filter(options);
    }, [client, list_vacancies_options])

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
            >
                <Row gutter={[16,0]}>
                    <Col span={12}>
                        <Form.Item
                            label='Producto'
                            name='product__unaccent__icontains'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input
                                allowClear
                                className='input-with-clear'
                                placeholder='Buscar por producto'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Cliente'
                            name='customer'
                        >
                            <Select
                                allowClear
                                showSearch
                                disabled={load_clients_options}
                                loading={load_clients_options}
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
                                onChange={onChangeClient}
                            >
                                {list_clients_options.length > 0 && list_clients_options.map(item=> (
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Vacante'
                            name='vacant'
                        >
                            <Select
                                allowClear
                                showSearch
                                disabled={load_vacancies_options}
                                loading={load_vacancies_options}
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
                            >
                                {optionsVacant.map(item=> (
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.job_position}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Estatus vacante'
                            name='vacant__status'
                        >
                            <Select
                                allowClear
                                placeholder='Estatus vacante'
                                options={optionsStatusVacant}
                            />
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

export default FiltersStrategies