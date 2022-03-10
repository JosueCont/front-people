import React, { useState, useEffect } from "react";
import styled from '@emotion/styled';
import { useSelector } from "react-redux";
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
    Tooltip
} from "antd";
import { ClearOutlined, SearchOutlined} from "@ant-design/icons";
import MyModal from "../../../common/MyModal";
import WebApiAssessment from "../../../api/WebApiAssessment";
import {
    CustomInput,
    ColButtons,
    CustomCheck,
    CompactSelect,
    CompactButton
} from "../../assessment/groups/Styled";

const AssignAssessments = ({...props}) =>{

    const [formGroup] = Form.useForm();
    const {Option} = Select;
    const currentNode = useSelector(state => state.userStore.current_node)
    const [itemsSelected, setItemsSelected] = useState([]);
    const [itemsKeys, setItemsKeys] = useState([]);
    const [listSurveys, setListSurveys] = useState([]);
    const [loadAdd, setLoadAdd] = useState(false);
    const [isIndividual, setIsIndividual] = useState(true);
    const [loading, setLoading] = useState(false);
    const [listCategories, setListCategories] = useState([]);
    const [isSelectAll, setIsSelectAll] = useState(false);

    useEffect(()=>{
        if(currentNode?.id){
            getCategories()
            getSurveys(currentNode.id, "")
        }
    },[props.visible])


    const getCategories = async () =>{
        try {
            let response = await WebApiAssessment.getCategoriesAssessment();
            setListCategories(response.data?.results)
        } catch (e) {
            setListCategories([])
            console.log(e)
        }
    }

    const getSurveys = async (nodeId, queryParam) => {
        setLoading(true)
        try {
            let response = await WebApiAssessment.getListSurveys(nodeId, queryParam);
            setListSurveys(response.data);
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
            setLoading(false)
        } catch (e) {
        console.log(e);
            setListSurveys([])
            setLoading(false)
        }
    }

    const getListAssigned = () =>{
        let copyList =
            listSurveys.results ?
            listSurveys.results :
            listSurveys;
        return copyList;
    }

    const resetValues = () =>{
        setItemsKeys([])
        setItemsSelected([])
        setIsSelectAll(false)
    }

    const onCloseModal = () =>{
        props.close();
        setIsIndividual(true)
        resetValues()
    }

    const onFinish = (values) =>{
        if(itemsSelected.length > 0){
            setLoadAdd(true)
            setTimeout(()=>{
                onCloseModal()
                setLoadAdd(false)
                props.actionForm(itemsKeys)
            },2000)
        }else{
            message.error("Selecciona al menos una encuesta")
        }
    }

    const columns = [
        {
            title: "Encuesta",
            render: (item) => {
                return (
                    <div>
                        {item.name}
                    </div>
                );
            },
            
        },
        {
            title: "Categoría",
            render: (item) => {
                return (
                    <div>
                        {item.category}
                    </div>
                );
            },
        }
    ]

    const rowSelection = {
        columnTitle: 'Seleccionar',
        columnWidth: 100,
        selectedRowKeys: itemsKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setItemsKeys(selectedRowKeys)
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
            setItemsKeys(keys)
            setItemsSelected(items)
            setIsSelectAll(true)
        }else{
            resetValues()
        }
    }

    const onChangeType = (e) =>{
        resetValues()
        if(e.target.value){
            getSurveys(currentNode.id, "")
            setIsIndividual(true)
        }else{
            getGroupsSurveys(currentNode.id, "")
            setIsIndividual(false)
        }
    }

    const onSearchByName = (e) =>{
        const list = getListAssigned();
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
        getSurveys(currentNode.id, "")
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
                                <Input.Group compact style={{width: '100%'}}>
                                    <CompactSelect
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
                                        {listCategories.map(item =>(
                                            <Option key={item.id} value={item.id}>
                                                {item.name}
                                            </Option>
                                        ))}
                                    </CompactSelect>
                                    <Tooltip title={'Borrar filtros'}>
                                        <CompactButton
                                            icon={
                                                <ClearOutlined onClick={()=>resetFilters()}/>
                                            }
                                        />
                                    </Tooltip>
                                </Input.Group>
                            </Form.Item>
                        </Col>
                    )}
                    <Col span={12}>
                        <CustomCheck
                            checked={isSelectAll}
                            onChange={onSelectAll}
                        >
                            Seleccionar todos
                        </CustomCheck>
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
                            columns={columns}
                            showHeader={false}
                            dataSource={
                                listSurveys.results ?
                                listSurveys.results :
                                listSurveys
                            }
                            loading={loading}
                            size={'small'}
                            locale={{
                                emptyText: loading ?
                                "Cargando..." :
                                "No se encontraron resultados."
                            }}
                            scroll={{y: 200}}
                            rowSelection={rowSelection}
                            pagination={{
                                pageSize: 10,
                                total:
                                    listSurveys.count ?
                                    listSurveys.count :
                                    listSurveys.length,
                                position: ['bottomLeft'],
                                hideOnSinglePage: true
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