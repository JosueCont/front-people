import React, { useState, useMemo } from 'react';
import MyModal from '../../../common/MyModal';
import { Button, Row, Col, Form, Select } from 'antd';
import { useSelector } from 'react-redux';
import { optionsStatusPermits } from '../../../utils/constant';
import SelectPeople from '../../people/utils/SelectPeople';

const FiltersPermission = ({
    visible,
    close = () => { },
    onFinish = () => { },
    formSearch
}) => {

    const {
        user_filters_data
    } = useSelector(state => state.userStore);
    const {
        cat_departments
    } = useSelector(state => state.catalogStore)
    const [loading, setLoading] = useState(false);

    const onFinishSearch = (values) => {
        setLoading(true)
        setTimeout(() => {
            close()
            setLoading(false)
            onFinish(values);
        }, 1000)
    }

    const itemPerson = useMemo(()=>{
        if(!visible) return [];
        let person = user_filters_data?.person__id || {};
        if(Object.keys(person).length <=0) return [];
        return [person];
    },[user_filters_data?.person__id, visible])

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
                <Row>
                    <Col span={24}>
                        <SelectPeople
                            name='person__id'
                            label='Colaborador'
                            itemSelected={itemPerson}
                        />
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name='department__id'
                            label='Departamento'
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
                            >
                                {cat_departments.length > 0 && cat_departments.map(item => (
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label='Estatus'
                            name='status'
                        >
                            <Select
                                allowClear
                                placeholder='Seleccionar una opción'
                                options={optionsStatusPermits}
                            />
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

export default FiltersPermission