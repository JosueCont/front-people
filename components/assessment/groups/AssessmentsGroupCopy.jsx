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
import { assessmentLoadAction } from '../../../redux/assessmentDuck';
import { valueToFilter } from '../../../utils/functions';
import {
    DeleteOutlined,
    SearchOutlined,
    PlusOutlined,
    PlusCircleOutlined,
    CloseOutlined,
} from '@ant-design/icons';

const AssessmentsGroup = ({
    title = '',
    itemGroup = {},
    visible = false,
    close = () => { },
    actionForm = async () => { }
}) => {

    const dispatch = useDispatch();

    const {
        categories_assessment,
        fetching,
        assessments,
    } = useSelector(state => state.assessmentStore);
    const { current_node } = useSelector(state => state.userStore);

    const [formGroup] = Form.useForm();
    const [listCurrent, setListCurrent] = useState(assessments);
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
        setListCurrent(assessments)
    }, [assessments, visible])

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
        const map_ = item => item.id;
        let assessments = listSelected.map(map_);
        setLoading(true)
        setTimeout(async () => {
            let resp = await actionForm({ ...values, assessments });
            // Se valida si se cierra el modal para mostrar el error
            if (resp) formGroup.setFields([{ name: 'name', errors: [resp] }]);
            else closeModal();
            setLoading(false)
        }, 2000)
    }

    const closeModal = () => {
        formGroup.resetFields()
        setNameSearch(null)
        close()
    }

    const onChangeCategory = (value) => {
        let query = value
            ? `&is_active=true&categories=${value}` : '&is_active=true';
        dispatch(assessmentLoadAction(current_node?.id, query))
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
        let results = target.value?.trim() ? assessments.filter(filter_) : assessments;
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
                                disabled={fetching}
                                loading={fetching}
                                placeholder="Seleccionar una opción"
                                onChange={onChangeCategory}
                                notFoundContent="No se encontraron resultados"
                                optionFilterProp="children"
                                defaultValue=""
                            >
                                <Select.Option value="">Todas</Select.Option>
                                {categories_assessment?.length > 0 && categories_assessment?.map((item) => (
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
                                style={{border: '1px solid black'}}
                            />
                        </div>
                        <Table
                            rowKey='id'
                            size='small'
                            bordered
                            columns={columnsAssessment}
                            dataSource={listSurvey}
                            loading={fetching}
                            pagination={false}
                            showHeader={false}
                            scroll={{ y: 200 }}
                            locale={{
                                emptyText: fetching
                                    ? "Cargando..."
                                    : "No se encontraron resultados.",
                            }}
                        />
                    </Col>
                    <Col span={12}>
                        <label style={{
                            display: 'block',
                            padding: '0px 0px 4px'
                        }}>Evaluaciones seleccionadas</label>
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
                                emptyText: fetching
                                    ? "Cargando..."
                                    : "No se encontraron resultados.",
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