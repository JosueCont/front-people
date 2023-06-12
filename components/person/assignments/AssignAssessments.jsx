import React, { useState, useEffect } from "react";
import styled from '@emotion/styled';
import { useSelector } from "react-redux";
import axiosApi from "../../../api/axiosApi";
import {
    Form,
    Input,
    Button,
    Modal,
    Row,
    Col,
    Space,
    Select,
    Table,
    Checkbox,
    message,
    Radio,
    Tooltip,
    Tag
} from "antd";
import {
    ClearOutlined,
    SearchOutlined,
    FileTextOutlined,
    PlusCircleOutlined,
    CloseOutlined
} from "@ant-design/icons";
import MyModal from "../../../common/MyModal";
import WebApiAssessment from "../../../api/WebApiAssessment";
import {
    CustomInput,
    ColButtons,
    ButtonTransparent,
    CustomCheck,
    ButtonDanger,
    CompactSelect,
    CompactButton,
} from "../../assessment/groups/Styled";
import { BsCircleFill } from 'react-icons/bs';
import { valueToFilter } from "../../../utils/functions";

const AssignAssessments = ({itemSelected = {}, listAssigned = [],...props}) =>{

    const [formGroup] = Form.useForm();
    const {Option} = Select;
    const currentNode = useSelector(state => state.userStore.current_node)
    const [itemsSelected, setItemsSelected] = useState([]);
    const [groupsKeys, setGroupsKeys] = useState([]);
    const [surveysKeys, setSurveysKeys] = useState([]);
    const [listSurveys, setListSurveys] = useState([]);
    const [loadAdd, setLoadAdd] = useState(false);
    const [isIndividual, setIsIndividual] = useState(true);
    const [loading, setLoading] = useState(false);
    const [listCategories, setListCategories] = useState([]);
    const [isSelectAll, setIsSelectAll] = useState(false);
    const [copyList, setCopyList] = useState([]);
    const [copyKeys, setCopyKeys] = useState([]);
    const [currentAssigned, setCurrentAssigned] = useState([]);
    const [textForSearch, setTextForSearch] = useState('');
    const [surveySelected, setSurveySelected] = useState([]);
    const [loadSelected, setLoadSelected] = useState(false);

    useEffect(()=>{
        if(props.visible){
            if(currentNode?.id){
                getCategories()
                getSurveys(currentNode.id, "&is_active=true")
            }
        }        
    },[props.visible])

    useEffect(()=>{
        if(Object.keys(itemSelected).length > 0 && listAssigned.length == 0){
            getAllAssignments()
        }else if(listAssigned.length > 0){
            setCurrentAssigned(listAssigned)
        }
    },[itemSelected])

    useEffect(()=>{
        if(surveySelected.length > 0){
            getIdsByType()
        }
    },[surveySelected])

    const getAllAssignments = async () => {
        setLoadSelected(true)
        try {
            let { data } = await WebApiAssessment.getAllAssignments({groupPerson_id: itemSelected.id});
            if(data.length > 0){
                let currentList = [];
                data.map(item =>{
                    let valueId = item.assessment ? item.assessment : item.group_assessment?.id;
                    currentList.push({id: valueId})
                })
                setCurrentAssigned(currentList);
            }        
            setLoadSelected(false)
        } catch (e) { 
            console.log(e)
            setLoadSelected(false)
        }
    }

    const getCategories = async () =>{
        try {
            let response = await WebApiAssessment.getCategoriesAssessment();
            setListCategories(response.data)
        } catch (e) {
            setListCategories([])
            console.log(e)
        }
    }

    const getSurveys = async (nodeId, queryParam) => {
        setLoading(true)
        try {
            let response = await WebApiAssessment.getListSurveys(nodeId, queryParam);
            setLoading(false)
            setCopyList(response.data);
            const list = response.data;
            if((textForSearch).trim()){
                let results = list.filter(item => valueToFilter(item.name).includes(valueToFilter(textForSearch)));
                setListSurveys(results)
            }else{
                setListSurveys(list)
            }
        } catch (e) {
            console.log(e);
            setListSurveys([])
            setLoading(false)
        }
    }

    const getGroupsSurveys = async (nodeId, queryParam)=> {
        setLoading(true)
        try {
            let response = await WebApiAssessment.getGroupsAssessments(nodeId, queryParam);
            setListSurveys(response.data)
            setCopyList(response.data)
            setLoading(false)
        } catch (e) {
        console.log(e);
            setListSurveys([])
            setLoading(false)
        }
    }
    
    const addAssessment = (assessment) => {
        let item = {...assessment, is_individual: isIndividual };
        setSurveySelected([...surveySelected, item]);
    };

    const onChangePage = (pagination) => {
        if(!isIndividual){
            if (pagination.current > 1) {
                const offset = (pagination.current - 1) * 10;
                const queryParam = `&limit=10&offset=${offset}`;
                getGroupsSurveys(currentNode.id, queryParam)
            } else if (pagination.current == 1) {
                getGroupsSurveys(currentNode.id, "")
            }
            // setCopyKeys(groupsKeys)
        }
    }

    const filterSurveys = () =>{
        let prevList = getList();
        let newList = [];
        let newCurrent = [...surveySelected, ...currentAssigned];
        prevList.map((item)=>{
          let result = newCurrent.some(record => item.id === record.id);
          if(!result){
            newList.push(item)
          }
        })
        return newList;
    }

    const getIdsByType = () =>{
        let individual = [];
        let group = [];
        surveySelected.map(item =>{
            if(item.is_individual){
                individual.push(item.id)
            }
            if(!item.is_individual){
                group.push(item.group_kuiz_id)
            }
        })
        setGroupsKeys(group)
        setSurveysKeys(individual)
    }

    const getList = () =>{
        let list =
            listSurveys.results ?
            listSurveys.results :
            listSurveys;
        return list;
    }

    const getListCopy = () =>{
        let list =
            copyList.results ?
            copyList.results :
            copyList;
        return list;
    }

    const deleteItem = (index) => {
        let newList = [...surveySelected];
        newList.splice(index, 1);
        setSurveySelected(newList);
    };

    const resetValues = () =>{
        // setCopyKeys([])
        setSurveysKeys([])
        setGroupsKeys([])
        setCurrentAssigned([])
        setSurveySelected([])
        setTextForSearch('')
        // setItemsSelected([])
        // setIsSelectAll(false)
    }

    const onCloseModal = () =>{
        props.close();
        setIsIndividual(true)
        resetValues()
    }

    const createData = (obj) =>{
        let newObj = Object.assign(obj)
        if(newObj.assessments.length <= 0){
            delete newObj.assessments
        }
        if(newObj.groups_assessment.length <= 0){
            delete newObj.groups_assessment
        }
        return newObj;
    }

    const onFinish = (values) =>{
        const data = createData({assessments: surveysKeys, groups_assessment: groupsKeys})
        if(surveySelected.length > 0){
            setLoadAdd(true)
            setTimeout(()=>{
                onCloseModal()
                setLoadAdd(false)
                props.actionForm(data)
            },2000)
        }else{
            message.error("Selecciona al menos un grupo o una encuesta")
        }
    }

    const columnSelected = [
        {
            title: "Evaluaciones",
            render: (item) => {
                return (
                    <div>
                        {item.name}
                    </div>
                );
            },
            
        },
        {
            title: "Tipo",
            width: 30,
            render: (item) =>{
                return(
                    <BsCircleFill className={item.is_individual ? 'item-is-individual' : 'item-not-individual'}/>
                )
            }
        },
        {
            title: "Borrar",
            width: 50,
            render: (item, record, index) => {
                return (
                    <CloseOutlined
                        style={{ cursor: "pointer" }}
                        onClick={() => deleteItem(index)}
                    />
                );
            },
        }
    ]

    const columns = [
        {
            title: "Evaluaciones",
            render: (item) => {
                return (
                    <div>
                        {item.name}
                    </div>
                );
            },
            
        },
        {
            title: "Agregar",
            width: 50,
            render: (item, record, index) => {
                return (
                    <PlusCircleOutlined
                        style={{ cursor: "pointer" }}
                        onClick={() => addAssessment(item)}
                    />
                );
            },
        }
    ]

    const rowSelection = {
        columnWidth: 100,
        selectedRowKeys: isIndividual ? surveysKeys : groupsKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            if(isIndividual){
                setSurveysKeys(selectedRowKeys)
            }else{
                let list = [...copyKeys, ...selectedRowKeys]
                setGroupsKeys(list)
            }
            setItemsSelected(selectedRows)
        }
    }

    const onChangeType = (e) =>{
        if(e.target.value){
            getSurveys(currentNode.id, "&is_active=true")
            setIsIndividual(true)
        }else{
            getGroupsSurveys(currentNode.id, "")
            setIsIndividual(false)
        }
    }

    const onSearchByName = (e) =>{
        setTextForSearch(e.target.value);
        const list = getListCopy();
        if((e.target.value).trim()){
            let results = list.filter(item => valueToFilter(item.name).includes(valueToFilter(e.target.value)));
            setListSurveys(results)
        }else{
            setListSurveys(list)
        }
    }

    const onChangeCategory = (value) =>{
        let category = `&categories=${value}&is_active=true`;
        getSurveys(currentNode.id, value ? category : "&is_active=true")
    }

    const resetFilters = () =>{
        formGroup.resetFields();
        if(isIndividual){
            getSurveys(currentNode.id, "&is_active=true")
        }else if(!isIndividual){
            getGroupsSurveys(currentNode.id, "")
        }
    }

    return(
        <MyModal
            title={props.title}
            visible={props.visible}
            close={onCloseModal}
        >
            <Form
                onFinish={onFinish}
                form={formGroup}
                requiredMark={false}
                layout={'vertical'}
            >
                <Row gutter={[16,16]}>
                    <Col span={isIndividual ? 12 : 24}>
                        <Form.Item name="name" style={{marginBottom: '0px'}}>
                            <CustomInput
                                maxLength={50}
                                allowClear={true}
                                placeholder="Buscar"
                                onChange={onSearchByName}
                                prefix={<SearchOutlined />}
                                value={textForSearch}
                            />
                        </Form.Item>
                    </Col>
                    {isIndividual && (
                        <Col span={12}>
                            <Form.Item name="category" style={{marginBottom: '0px'}}>
                                <Select
                                    onChange={onChangeCategory}
                                    placeholder={'Seleccionar categoría'}
                                    notFoundContent='No se encontraron resultados'
                                    optionFilterProp="children"
                                    defaultValue={""}
                                >
                                    <Option value={""}>Todas</Option>
                                    {listCategories?.map(item =>(
                                        <Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    )}
                    <Col span={12}>
                        <ButtonTransparent
                            onClick={()=>resetFilters()}
                            icon={<ClearOutlined />} 
                            size={"small"}
                        >
                            Borrar filtros
                        </ButtonTransparent>
                    </Col>
                    <ColButtons span={12}>
                        <Radio.Group
                            onChange={onChangeType}
                            buttonStyle={'solid'}
                            size={'small'}
                            value={isIndividual}
                        >
                            <Radio.Button value={true}>Individuales</Radio.Button>
                            <Radio.Button value={false}>Grupales</Radio.Button>
                        </Radio.Group>
                    </ColButtons>
                    <Col span={12}>
                        <Form.Item label={isIndividual
                                ? "Asignar evaluaciones" : "Asignar grupos"
                            }>
                            <Table
                                rowKey={'id'}
                                columns={columns}
                                showHeader={false}
                                dataSource={filterSurveys()}
                                loading={loading}
                                size={'small'}
                                locale={{
                                    emptyText: loading ?
                                    "Cargando..." :
                                    "No se encontraron resultados."
                                }}
                                scroll={{y: 200}}
                                // rowSelection={rowSelection}
                                // onChange={onChangePage}
                                pagination={false}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12} style={{marginBottom: 'auto'}}>
                        <Form.Item label={`Seleccionados (${surveySelected.length})`}>
                            <Table
                                rowKey={'id'}
                                columns={columnSelected}
                                showHeader={false}
                                dataSource={surveySelected}
                                loading={loadSelected}
                                size={'small'}
                                locale={{
                                    emptyText: loadSelected ?
                                    "Cargando..." :
                                    "No se encontraron resultados."
                                }}
                                // rowClassName={(item, index) => {
                                //     if(item.is_individual){
                                //         return "item-is-individual"
                                //     }else{
                                //         return "item-not-individual"
                                //     }
                                // }}
                                className={'table-assignments'}
                                scroll={{y: 200}}
                                pagination={false}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row align={'end'} style={{marginTop: '16px'}}>
                    <Space>
                        <Button key="back" onClick={() => props.close()}>
                            Cancelar
                        </Button>
                        <Button
                            htmlType="submit"
                            loading={loadAdd}
                        >
                            Guardar
                        </Button>
                    </Space>
                </Row>
            </Form>
        </MyModal>
    )
}

export default AssignAssessments