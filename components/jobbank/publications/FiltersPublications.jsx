import React, { useState, useEffect, useMemo } from 'react';
import MyModal from '../../../common/MyModal';
import { Button, Row, Col, Form, Select } from 'antd';
import { useSelector } from 'react-redux';
import { optionsStatusVacant } from '../../../utils/constant';

const FiltersPublications = ({
    visible,
    close = () =>{},
    onFinish = ()=>{},
    formSearch
}) => {

    const {
        list_connections_options,
        load_connections_options,
        list_vacancies_options,
        load_vacancies_options,
        list_profiles_options,
        load_profiles_options
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
                            label='Cuenta'
                            name='account_to_share'
                        >
                            <Select
                                allowClear
                                mode='multiple'
                                maxTagCount={1}
                                disabled={load_connections_options}
                                loading={load_connections_options}
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
                            >
                                {list_connections_options.length > 0 && list_connections_options.map(item=> (
                                    <Select.Option disabled={!item.is_active} value={item.code} key={item.code}>
                                        {item.name} {item.is_active ? '':' / No disponible'}
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
                                {list_vacancies_options.length > 0 && list_vacancies_options.map(item => (
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
                                placeholder='Seleccionar una opción'
                                options={optionsStatusVacant}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Template'
                            name='profile'
                        >
                            <Select
                                allowClear
                                showSearch
                                disabled={load_profiles_options}
                                loading={load_profiles_options}
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
                            >
                                <Select.Option value='open_fields' key='open_fields'>
                                    Personalizado
                                </Select.Option>
                                {list_profiles_options.length > 0 && list_profiles_options.map(item=> (
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Estatus'
                            name='is_published'
                        >
                            <Select
                                allowClear
                                placeholder='Seleccionar una opción'
                            >
                                <Select.Option value='true' key='true'>Publicado</Select.Option>
                                <Select.Option value='false' key='false'>En borrador</Select.Option>
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

export default FiltersPublications