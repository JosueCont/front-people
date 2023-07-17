import React, { useState } from 'react';
import MyModal from '../../../common/MyModal';
import { Button, Input, Row, Col, Form, Select } from 'antd';
import { useSelector } from 'react-redux';
import { ruleWhiteSpace } from '../../../utils/rules';
import { optionsStatusVacant } from '../../../utils/constant';
import SelectPeople from '../../people/utils/SelectPeople';

const FiltersVacancies = ({
    visible,
    close = () =>{},
    onFinish = ()=>{},
    formSearch
}) => {

    const {
        list_clients_options,
        load_clients_options,
        jobbank_filters_data
    } = useSelector(state => state.jobBankStore);
    const [loading, setLoading] = useState(false);

    const recruiter = 'strategy__recruiter_id';

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
                            name='job_position__unaccent__icontains'
                            label='Nombre'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input
                                allowClear
                                className='input-with-clear'
                                placeholder='Buscar por nombre'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='status'
                            label='Estatus'
                        >
                            <Select
                                allowClear
                                placeholder='Estatus'
                                options={optionsStatusVacant}
                            />
                        </Form.Item>
                    </Col>
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
                        <SelectPeople
                            name={recruiter}
                            label='Reclutador'
                            itemSelected={jobbank_filters_data[recruiter]
                                ? [jobbank_filters_data[recruiter]] : []
                            }
                        />
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

export default FiltersVacancies