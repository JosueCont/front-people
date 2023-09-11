import React, { useState, useMemo } from 'react';
import MyModal from '../../../common/MyModal';
import { Button, Row, Col, Form, Select } from 'antd';
import { useSelector } from 'react-redux';
import SelectPeople from '../../people/utils/SelectPeople';
import SelectCandidates from '../candidates/SelectCandidates';

const FiltersInterviews = ({
    visible,
    listData = {},
    close = () => { },
    onFinish = () => { },
    formSearch
}) => {

    const {
        list_vacancies_options,
        load_vacancies_options,
        list_clients_options,
        load_clients_options
    } = useSelector(state => state.jobBankStore);
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

    const itemRecruiter = useMemo(()=>{
        if(!visible) return [];
        let recruiter = listData?.recruiter || {};
        if(Object.keys(recruiter).length <=0) return [];
        return [recruiter];
    },[listData?.recruiter, visible])

    const itemCandidate = useMemo(()=>{
        if(!visible) return [];
        let candidate = listData?.candidate || {};
        if(Object.keys(candidate).length <=0) return [];
        return [candidate];
    },[listData?.candidate, visible])

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
                            itemSelected={itemRecruiter}
                        />
                    </Col>
                    <Col span={12}>
                        <SelectCandidates
                            name='candidate'
                            label='Candidato'
                            itemSelected={itemCandidate}
                        />
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