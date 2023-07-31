import React, { useEffect, useMemo, useState } from 'react';
import MyModal from '../../../common/MyModal';
import { useSelector, useDispatch } from 'react-redux';
import {
    Form,
    Select,
    Button,
    Row,
    Col,
    Input,
    Table,
    message
} from 'antd';
import { ruleRequired } from '../../../utils/rules';
import { getAssessmentsOptions } from '../../../redux/kuizDuck';
import { valueToFilter } from '../../../utils/functions';
import {
    PlusCircleOutlined,
    CloseOutlined,
} from '@ant-design/icons';

const AssessmentsGroup = ({
    title = '',
    itemGroup = {},
    visible = false,
    close = () => { },
    actionForm = async () => { },
    showOptions = true
}) => {

    const dispatch = useDispatch();

    const {
        list_categories,
        load_categories,
        list_assessments_options,
        load_assessments_options,
    } = useSelector(state => state.kuizStore);
    const { current_node } = useSelector(state => state.userStore);

    const [formGroup] = Form.useForm();
    const [listCurrent, setListCurrent] = useState([]);
    const [listSelected, setListSelected] = useState([]);
    const [loading, setLoading] = useState(false);
    const [nameSearch, setNameSearch] = useState(null);

    useEffect(() => {
        if (Object.keys(itemGroup).length <= 0) return;
        formGroup.setFieldsValue({ name: itemGroup?.name })
        setListSelected(itemGroup?.assessments)
    }, [itemGroup])

    useEffect(() => {
        if (!visible) return;
        setListCurrent(list_assessments_options)
    }, [list_assessments_options, visible])

    const listSurvey = useMemo(() => {
        if (listSelected?.length <= 0) return listCurrent;
        let ids = listSelected.map(item => item.id);
        return listCurrent?.filter(item => !ids.includes(item.id));
    }, [listSelected, listCurrent])

    const onFinish = (values) => {
        if (listSelected?.length <= 0) {
            message.error('Selecciona al menos dos evaluaciones')
            return;
        }
        let assessments = listSelected.map(item => item.id);
        setLoading(true)
        setTimeout(async () => {
            let resp = await actionForm({ ...values, assessments });
            // Se valida si se cierra el modal para mostrar el error
            if (resp && resp != 'ERROR') formGroup.setFields([{ name: 'name', errors: [resp] }]);
            else if (!resp) closeModal();
            setLoading(false)
        }, 2000)
    }

    const closeModal = () => {
        formGroup.resetFields()
        setNameSearch(null)
        setListSelected([])
        close()
    }

    const onChangeCategory = (value) => {
        let query = value ? `&categories=${value}` : '';
        dispatch(getAssessmentsOptions(current_node?.id, query))
    }

    const addAssessment = (item) => {
        setListSelected([...listSelected, item]);
    }

    const deleteItem = (index) => {
        let newList = [...listSelected];
        newList.splice(index, 1);
        setListSelected(newList);
    }

    const onFilter = ({ target }) => {
        setNameSearch(target?.value)
        const filter_ = item => valueToFilter(item.name).includes(valueToFilter(target.value));
        let results = target.value?.trim() ? list_assessments_options.filter(filter_) : list_assessments_options;
        setListCurrent(results)
    }

    const columnsAssessment = [
        {
            dataIndex: 'name',
            key: 'name',
        },
        {
            width: 50,
            render: (item) => (
                <PlusCircleOutlined
                    onClick={() => addAssessment(item)}
                />
            )
        },
    ]

    const columns = [
        {
            dataIndex: 'name',
            key: 'name',
        },
        {
            width: 50,
            render: (item, record, index) => (
                <CloseOutlined onClick={() => deleteItem(index)} />
            )
        },
    ]

    return (
        <MyModal
            visible={visible}
            close={closeModal}
            title={title}
            widthModal={800}
            closable={!loading}
        >
            <Form
                layout='vertical'
                form={formGroup}
                onFinish={onFinish}
            >
                <Row gutter={[24, 0]}>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Nombre del grupo"
                            rules={[ruleRequired]}
                        >
                            <Input
                                maxLength={50}
                                allowClear={true}
                                placeholder="Ingresa un nombre"
                                style={{ border: '1px solid black' }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Categoría">
                            <Select
                                showSearch
                                disabled={load_categories || load_assessments_options}
                                loading={load_categories || load_assessments_options}
                                placeholder="Seleccionar una opción"
                                onChange={onChangeCategory}
                                notFoundContent="No se encontraron resultados"
                                optionFilterProp="children"
                                defaultValue=""
                            >
                                <Select.Option value="">Todas</Select.Option>
                                {list_categories?.length > 0 && list_categories?.map((item) => (
                                    <Select.Option key={item.id} value={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <div style={{ marginBottom: 8 }}>
                            <label style={{
                                display: 'block',
                                padding: '0px 0px 4px'
                            }}>Seleccionar evaluaciones</label>
                            <Input
                                allowClear
                                value={nameSearch}
                                onChange={onFilter}
                                placeholder='Buscar'
                                style={{ border: '1px solid black' }}
                            />
                        </div>
                        <Table
                            rowKey='id'
                            size='small'
                            bordered
                            columns={columnsAssessment}
                            dataSource={listSurvey}
                            loading={load_assessments_options}
                            pagination={false}
                            showHeader={false}
                            scroll={{ y: 200 }}
                            locale={{
                                emptyText: load_assessments_options
                                    ? "Cargando..."
                                    : "No se encontraron resultados.",
                            }}
                        />
                    </Col>
                    <Col span={12}>
                        <label style={{
                            display: 'block',
                            padding: '0px 0px 4px'
                        }}>Evaluaciones seleccionadas ({listSelected?.length})</label>
                        <Table
                            rowKey='id'
                            size='small'
                            bordered
                            columns={columns}
                            dataSource={listSelected}
                            pagination={false}
                            showHeader={false}
                            scroll={{ y: 240 }}
                            locale={{
                                emptyText: "No se encontraron resultados.",
                            }}
                        />
                    </Col>
                    <Col span={24} className='content-end' style={{ marginTop: 24, gap: 8 }}>
                        <Button
                            disabled={loading}
                            onClick={() => closeModal()}
                        >
                            Cerrar
                        </Button>
                        <Button
                            htmlType='submit'
                            loading={loading}
                        >
                            Guardar
                        </Button>
                    </Col>
                </Row>
            </Form>
        </MyModal>
    )
}

export default AssessmentsGroup