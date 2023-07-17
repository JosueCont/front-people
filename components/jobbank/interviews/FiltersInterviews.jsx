import React, { useState, useMemo } from 'react';
import MyModal from '../../../common/MyModal';
import { Button, Row, Col, Form, Select } from 'antd';
import { useSelector } from 'react-redux';
import { getFullName } from '../../../utils/functions';
import SelectPeople from '../../people/utils/SelectPeople';

const FiltersInterviews = ({
    visible,
    close = () => { },
    onFinish = () => { },
    formSearch
}) => {

    const {
        load_candidates_options,
        list_candidates_options,
        list_vacancies_options,
        load_vacancies_options,
        list_clients_options,
        load_clients_options,
        jobbank_filters_data
    } = useSelector(state => state.jobBankStore);
    const {
        load_persons,
        persons_company
    } = useSelector(state => state.userStore);
    const [loading, setLoading] = useState(false);
    const customer = Form.useWatch('customer', formSearch);

    const onFinishSearch = (values) => {
        setLoading(true)
        setTimeout(() => {
            close()
            setLoading(false)
            onFinish(values);
        }, 1000)
    }

    const optionsVacant = useMemo(() => {
        if (!customer) return list_vacancies_options;
        const filter_ = item => item.customer?.id == customer;
        return list_vacancies_options.filter(filter_);
    }, [customer, list_vacancies_options])

    const onChangeCustomer = (value) => {
        formSearch.setFieldsValue({ vacant: null })
    }

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
                <Row gutter={[16, 0]}>
                    <Col span={12}>
                        <Form.Item
                            name='customer'
                            label='Cliente'
                        >
                            <Select
                                allowClear
                                showSearch
                                disabled={load_clients_options}
                                loading={load_clients_options}
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
                                onChange={onChangeCustomer}
                            >
                                {list_clients_options.length > 0 && list_clients_options.map(item => (
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
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
                                disabled={optionsVacant.length <= 0}
                                loading={load_vacancies_options}
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
                            >
                                {optionsVacant.length > 0 && optionsVacant.map(item => (
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.job_position}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <SelectPeople
                            name='recruiter'
                            label='Reclutador'
                            itemSelected={jobbank_filters_data?.recruiter
                                ? [jobbank_filters_data?.recruiter] : []
                            }
                        />
                        {/* <Form.Item
                            name='recruiter'
                            label='Reclutador'
                        >
                            <Select
                                allowClear
                                showSearch
                                disabled={load_persons}
                                loading={load_persons}
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
                            >
                                {persons_company.length > 0 && persons_company.map(item => (
                                    <Select.Option value={item.id} key={item.id}>
                                        {getFullName(item)}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item> */}
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='candidate'
                            label='Candidato'
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                disabled={load_candidates_options}
                                loading={load_candidates_options}
                                optionFilterProp='children'
                            >
                                {list_candidates_options?.length > 0 && list_candidates_options.map(item => (
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.first_name} {item.last_name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24} className='content-end' style={{ gap: 8 }}>
                        <Button onClick={() => close()}>
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

export default FiltersInterviews