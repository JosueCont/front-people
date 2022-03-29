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
import { ClearOutlined, SearchOutlined, FileTextOutlined} from "@ant-design/icons";
import MyModal from "../../../common/MyModal";
import WebApiAssessment from "../../../api/WebApiAssessment";
import {
    CustomInput,
    ColButtons,
    ButtonTransparent,
    CustomCheck,
    ButtonDanger,
    CompactSelect,
    CompactButton
} from "../../assessment/groups/Styled";

const AssignAssessments = ({...props}) =>{

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

    useEffect(()=>{
        if(currentNode?.id){
            getCategories()
            getSurveys(currentNode.id, "")
        }
    },[props.visible])

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
            setListSurveys(response.data)
            setCopyList(response.data)
            setLoading(false)
        } catch (e) {
            console.log(e);
            setListSurveys([])
            setLoading(false)
        }
    }

    const getGroupsSurveys = async (nodeId, queryParam)=> {
        setLoading(true)
        const data = {
            nodeId: nodeId,
            name: "",
            queryParam: queryParam
        }
        try {
            let response = await WebApiAssessment.getGroupsAssessments(data);
            setListSurveys(response.data)
            setCopyList(response.data)
            setLoading(false)
        } catch (e) {
        console.log(e);
            setListSurveys([])
            setLoading(false)
        }
    }    

    const onChangePage = (pagination) => {
        if(!isIndividual){
            if (pagination.current > 1) {
                const offset = (pagination.current - 1) * 10;
                const queryParam = `&limit=10&offset=${offset}`;
                getGroupsSurveys(currentNode.id, queryParam)
            } else if (pagination.current == 1) {
                getGroupsSurveys(currentNode.id, "")
            }
            setCopyKeys(groupsKeys)
        }
    }

    const getListAssigned = () =>{
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

    const resetValues = () =>{
        setCopyKeys([])
        setSurveysKeys([])
        setGroupsKeys([])
        setItemsSelected([])
        setIsSelectAll(false)
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
        console.log("gripos-----",data)
        if(itemsSelected.length > 0){
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

    const columnsInvidual = [
        {
            title: "Encuestas",
            render: (item) => {
                return (
                    <div>
                        {item.name}
                    </div>
                );
            },
            
        },
        {
            title: "Categorías",
            render: (item) => {
                return (
                    <div>
                        {item.category}
                    </div>
                );
            },
        }
    ]

    const columnsGroup = [
        {
            title: "Grupos",
            render: (item) => {
                return (
                    <div>
                        {item.name}
                    </div>
                );
            },
            
        },
        {
            title: "Encuestas",
            render: (item) => {
                return (
                    <Tag
                        icon={<FileTextOutlined style={{color:'#52c41a'}} />}
                        color={'green'}
                        style={{fontSize: '14px'}}
                    >
                        {item.assessments ? item.assessments.length : 0}
                    </Tag>
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

    const onSelectAll = (e) =>{
        const list = getListAssigned();
        if(e.target.checked){
            let keys  = [];
            let items = [];
            list.map((item)=>{
                keys.push(item.id)
                items.push(item)
            })
            if(isIndividual){
                setSurveysKeys(keys)
            }else{
                setGroupsKeys(keys)
            }
            setItemsSelected(items)
            setIsSelectAll(true)
        }else{
            resetValues()
        }
    }

    const onChangeType = (e) =>{
        if(e.target.value){
            getSurveys(currentNode.id, "")
            setIsIndividual(true)
        }else{
            getGroupsSurveys(currentNode.id, "")
            setIsIndividual(false)
        }
    }

    const onSearchByName = (e) =>{
        const list = getListCopy();
        if((e.target.value).trim()){
            let results = list.filter(item => item.name.toLowerCase().includes(e.target.value.toLowerCase()));
            setListSurveys(results)
        }else{
            setListSurveys(list)
        }
    }

    const onChangeCategory = (value) =>{
        let category = `&categories=${value}`;
        getSurveys(currentNode.id, category)
    }

    const resetFilters = () =>{
        formGroup.resetFields();
        if(isIndividual){
            getSurveys(currentNode.id, "")
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
                <Row gutter={[8,16]}>
                    <Col span={isIndividual ? 12 : 24}>
                        <Form.Item name="name" style={{marginBottom: '0px'}}>
                            <CustomInput
                                maxLength={50}
                                allowClear={true}
                                placeholder="Buscar prueba"
                                onChange={onSearchByName}
                                prefix={<SearchOutlined />}
                            />
                        </Form.Item>
                    </Col>
                    {isIndividual && (
                        <Col span={12}>
                            <Form.Item name="category" style={{marginBottom: '0px'}}>
                                <Select
                                    showSearch
                                    onChange={onChangeCategory}
                                    placeholder={'Seleccionar categoría'}
                                    notFoundContent='No se encontraron resultados'
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    filterSort={(optionA, optionB) =>
                                        optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                    }
                                >
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
                        {/* <CustomCheck
                            checked={isSelectAll}
                            onChange={onSelectAll}
                        >
                            Seleccionar todos
                        </CustomCheck>
                        <Tooltip title={'Borrar filtros'} placement={'right'}>
                            <ClearOutlined
                                onClick={()=>resetFilters()}
                            />
                        </Tooltip> */}
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
                    <Col span={24}>
                        <Table
                            rowKey={'id'}
                            columns={
                                isIndividual ?
                                columnsInvidual :
                                columnsGroup
                            }
                            dataSource={getListAssigned()}
                            loading={loading}
                            size={'small'}
                            locale={{
                                emptyText: loading ?
                                "Cargando..." :
                                "No se encontraron resultados."
                            }}
                            scroll={{y: 200}}
                            rowSelection={rowSelection}
                            onChange={onChangePage}
                            pagination={{
                                pageSize: 10,
                                total:
                                    listSurveys.count ?
                                    listSurveys.count :
                                    listSurveys.length,
                                position: ['bottomLeft'],
                                hideOnSinglePage: true,
                                showSizeChanger: false
                            }}
                        />
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