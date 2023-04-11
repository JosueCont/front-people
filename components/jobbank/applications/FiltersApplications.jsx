import React, { useState, useEffect, useMemo } from 'react';
import MyModal from '../../../common/MyModal';
import { Button, Input, Row, Col, Form, Select, InputNumber, DatePicker } from 'antd';
import { useSelector } from 'react-redux';
import { onlyNumeric, ruleWhiteSpace } from '../../../utils/rules';
import RangeAge from '../RangeAge';
import { optionsStatusApplications } from '../../../utils/constant';

const FiltersApplications = ({
    visible,
    close = () =>{},
    onFinish = ()=>{},
    formSearch
}) => {

    const {
        list_applications_candidates,
        load_applications_candidates,
        list_vacancies_options,
        load_vacancies_options,
        list_clients_options,
        load_clients_options
    } = useSelector(state => state.jobBankStore);
    const [loading, setLoading] = useState(false);
    const client = Form.useWatch('vacant__customer', formSearch);

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
        if(!client) return [];
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
                            label='Cliente'
                            name='vacant__customer'
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
                                disabled={optionsVacant.length <= 0}
                                loading={load_vacancies_options}
                                placeholder='Selecionar una opción'
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
                            name='candidate'
                            label='Candidato'
                        >
                            <Select
                                allowClear
                                showSearch
                                disabled={load_applications_candidates}
                                loading={load_applications_candidates}
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
                            >
                                {list_applications_candidates.length > 0 &&
                                    list_applications_candidates.map(item => (
                                    <Select.Option value={item.id+""} key={item.id+""}>
                                        {item.first_name} {item.last_name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Estatus'
                            name='status'
                        >
                            <Select
                                allowClear
                                placeholder='Seleccionar una opción'
                                options={optionsStatusApplications}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Fecha'
                            name='date'
                            tooltip={`
                                En caso de no seleccionar un rango de fechas,
                                de manera interna se filtra por el mes actual.
                            `}
                        >
                             <DatePicker.RangePicker
                                style={{width: '100%'}}
                                format='DD-MM-YYYY'
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

export default FiltersApplications