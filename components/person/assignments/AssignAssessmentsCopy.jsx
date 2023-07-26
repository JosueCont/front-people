import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Input,
    Button,
    Row,
    Col,
    Space,
    Select,
    Table,
    Radio,
    Typography
} from "antd";
import {
    ClearOutlined,
    SearchOutlined,
    PlusCircleOutlined,
    CloseOutlined
} from "@ant-design/icons";
import MyModal from "../../../common/MyModal";
import { ColButtons } from "../../assessment/groups/Styled";
import { BsCircleFill } from 'react-icons/bs';
import { valueToFilter } from "../../../utils/functions";
import { getListAssets } from "../../../redux/assessmentDuck";

const AssignAssessments = ({
    title = '',
    visible = false,
    close = () => { },
    actionForm = () => { },
    assigned = []
}) => {

    const {
        categories_assessment,
        fetching,
        list_assessments,
        load_assessments,
        load_group_assessments,
        list_group_assessments
    } = useSelector(state => state.assessmentStore);
    const {
        current_node
    } = useSelector(state => state.userStore)

    const dispatch = useDispatch();
    const [category, setCategory] = useState("");
    const [showError, setShowError] = useState(false);
    const [listSurveys, setListSurveys] = useState([]);
    const [isIndividual, setIsIndividual] = useState(true);
    const [loading, setLoading] = useState(false);
    const [textForSearch, setTextForSearch] = useState('');
    const [surveySelected, setSurveySelected] = useState([]);

    useEffect(() => {
        if (!visible) return;
        setListSurveys(list_assessments)
    }, [list_assessments, visible])
    
    const list_test = useMemo(() => {
        if (surveySelected?.length <= 0) return listSurveys;
        let ids = surveySelected.map(item => item.id);
        const filter_ = item => ids?.length > 0 && !ids.includes(item.id)
            || assigned?.length > 0 && !assigned.includes(item.id);
        return listSurveys.filter(filter_);
    }, [listSurveys, surveySelected, assigned])

    const addAssessment = (record) => {
        let item = { ...record, is_individual: isIndividual };
        setSurveySelected([...surveySelected, item]);
    }

    const deleteItem = (index) => {
        let newList = [...surveySelected];
        newList.splice(index, 1);
        setSurveySelected(newList);
    }

    const onCloseModal = () => {
        close();
        setIsIndividual(true)
        setCategory("")
        setShowError(false)
        setSurveySelected([])
        setTextForSearch("")
        setListSurveys([])
    }

    const createData = () => {
        return surveySelected.reduce((acc, current) => {
            let assess = acc['assessments'] ?? [];
            let group = acc['groups_assessment'] ?? [];
            if (current?.is_individual) return { ...acc, assessments: [...assess, current?.id] };
            return { ...acc, groups_assessment: [...group, current?.id] }
        }, {})
    }

    const onFinish = () => {
        setShowError(false)
        if (surveySelected?.length <= 0) {
            setShowError(true)
            return;
        }
        setLoading(true)
        let body = createData();
        setTimeout(() => {
            actionForm(body)
            setLoading(false)
            onCloseModal()
        }, 2000)
    }

    const onChangeType = ({ target }) => {
        setIsIndividual(target.value)
        setTextForSearch("")
        let list = target?.value ? list_assessments : list_group_assessments;
        setListSurveys(list)
    }

    const onSearchByName = ({ target }) => {
        setTextForSearch(target.value);
        let list = isIndividual ? list_assessments : list_group_assessments;
        const filter_ = item => valueToFilter(item.name).includes(valueToFilter(target.value));
        let results = target.value?.trim() ? list.filter(filter_) : list;
        setListSurveys(results)
    }

    const onChangeCategory = (value) => {
        setCategory(value)
        let query = value ? `&is_active=true&categories=${value}` : '&is_active=true';
        dispatch(getListAssets(current_node?.id, query))
    }

    const resetFilters = () => {
        setTextForSearch(null)
        if (isIndividual && category !== "") {
            setCategory("")
            dispatch(getListAssets(current_node?.id, '&is_active=true'))
            return;
        }
        if (isIndividual && category == "") {
            setListSurveys(list_assessments)
            return;
        }
        setListSurveys(list_group_assessments)
    }

    const columnSelected = [
        {
            title: "Evaluaciones",
            dataIndex: "name",
            key: "name"
        },
        {
            width: 30,
            render: (item) => (
                <BsCircleFill className={item.is_individual
                    ? 'item-is-individual' : 'item-not-individual'} />
            )
        },
        {
            width: 50,
            render: (item, record, index) => {
                return (
                    <CloseOutlined
                        onClick={() => deleteItem(index)}
                    />
                );
            },
        }
    ]

    const columns = [
        {
            dataIndex: "name",
            key: "name"
        },
        {
            width: 50,
            render: (item, record, index) => {
                return (
                    <PlusCircleOutlined
                        onClick={() => addAssessment(item)}
                    />
                );
            },
        }
    ]

    return (
        <MyModal
            title={title}
            visible={visible}
            close={onCloseModal}
            closable={!loading}
            widthModal={650}
        >
            <Row gutter={[16, 16]}>
                <Col span={isIndividual ? 12 : 24}>
                    <Input
                        maxLength={50}
                        allowClear={true}
                        placeholder="Buscar"
                        onChange={onSearchByName}
                        prefix={<SearchOutlined />}
                        value={textForSearch}
                        style={{ border: '1px solid black' }}
                    />
                </Col>
                {isIndividual && (
                    <Col span={12}>
                        <Select
                            disabled={fetching}
                            loading={fetching}
                            onChange={onChangeCategory}
                            placeholder='Seleccionar categoría'
                            notFoundContent='No se encontraron resultados'
                            optionFilterProp="children"
                            value={category}
                            style={{ width: '100%' }}
                        >
                            <Select.Option value="">Todas</Select.Option>
                            {categories_assessment?.map(item => (
                                <Select.Option key={item.id} value={item.id}>
                                    {item.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                )}
                <Col span={12}>
                    <Button
                        onClick={() => resetFilters()}
                        icon={<ClearOutlined />}
                        size="small"
                    >
                        Borrar filtros
                    </Button>
                </Col>
                <ColButtons span={12}>
                    <Radio.Group
                        onChange={onChangeType}
                        buttonStyle='solid'
                        size='small'
                        value={isIndividual}
                    >
                        <Radio.Button value={true}>Individuales</Radio.Button>
                        <Radio.Button value={false}>Grupales</Radio.Button>
                    </Radio.Group>
                </ColButtons>
                <Col span={12}>
                    <label style={{
                        display: 'block',
                        padding: '0px 0px 8px'
                    }}>
                        {isIndividual
                            ? 'Asignar evaluaciones'
                            : 'Asignar grupos'
                        } ({list_test?.length})
                    </label>
                    <Table
                        rowKey='id'
                        columns={columns}
                        showHeader={false}
                        dataSource={list_test}
                        loading={load_assessments || load_group_assessments}
                        size='small'
                        locale={{ emptyText: 'No se encontraron resultados' }}
                        scroll={{ y: 200 }}
                        className='table-assignments'
                        pagination={false}
                    />
                </Col>
                <Col span={12}>
                    <label style={{
                        display: 'block',
                        padding: '0px 0px 8px'
                    }} className="custom-required">
                        Seleccionados ({surveySelected?.length})
                    </label>
                    <Table
                        rowKey='id'
                        columns={columnSelected}
                        showHeader={false}
                        dataSource={surveySelected}
                        size='small'
                        locale={{ emptyText: "No se encontraron resultados" }}
                        className='table-assignments'
                        scroll={{ y: 200 }}
                        pagination={false}
                    />
                    {showError && surveySelected?.length <= 0 && (
                        <Typography.Text type='danger'>
                            Seleccionar grupo o evaluación
                        </Typography.Text>
                    )}
                </Col>
                <Col span={24} className="content-end">
                    <Space>
                        <Button disabled={loading} onClick={() => onCloseModal()}>
                            Cancelar
                        </Button>
                        <Button
                            loading={loading}
                            htmlType="submit"
                            onClick={() => onFinish()}
                        >
                            Guardar
                        </Button>
                    </Space>
                </Col>
            </Row>
        </MyModal>
    )
}

export default AssignAssessments