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
import MyModal from "../../common/MyModal";
import WebApiAssessment from "../../api/WebApiAssessment";
import { CustomInput, ColButtons, CustomCheck, CompactSelect, CompactButton } from "../assessment/groups/Styled";

const AssignAssessments = ({...props}) =>{

    const [formGroup] = Form.useForm();
    const {Option} = Select;
    const currenNode = useSelector(state => state.userStore.current_node)
    const [itemsSelected, setItemsSelected] = useState([]);
    const [itemsKeys, setItemsKeys] = useState([]);
    const [listSurveys, setListSurveys] = useState([]);
    // const [loading, setLoading] = useState(false);
    const [loadAdd, setLoadAdd] = useState(false);

    useEffect(()=>{
        if(props.listSurveys){
            setListSurveys(props.listSurveys)
        }
    },[props.listSurveys])

    const onCloseModal = () =>{
        props.close();
        setItemsSelected([])
        setItemsKeys([])
    }

    const getOnlyIds = () => {
        let ids = [];
        itemsSelected.map((item) => {
            ids.push(item.id);
        })
        return ids;
    };

    const onFinish = (values) =>{
        if(itemsSelected.length > 0){
            const ids = getOnlyIds();
            setLoadAdd(true)
            setTimeout(()=>{
                onCloseModal()
                setLoadAdd(false)
                props.actionForm(ids)
            },2000)
        }else{
            message.error("Selecciona al menos una encuesta")
        }
    }

    const colums = [
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
        if(e.target.checked){
            let keys  = [];
            let items = [];
            assessments.map((item)=>{
                keys.push(item.id)
                items.push(item)
            })
            setItemsKeys(keys)
            setItemsSelected(items)
        }else{
            setItemsKeys([])
            setItemsSelected([])
        }
    }

    const onChangeType = (e) =>{
        console.log(e.target.value)
    }

    const onSearchByName = (e) =>{
        if((e.target.value).trim()){
            let results = props.listSurveys?.filter(item => item.name.toLowerCase().includes(e.target.value.toLowerCase()));
            setListSurveys(results)
        }else{
            setListSurveys(props.listSurveys)
        }
    }

    const onChangeCategory = (value) =>{
        let category = `&categories=${value}`;
        props.getSurveys(category)
    }

    const resetFilters = () =>{
        formGroup.resetFields();
        props.getSurveys("")
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
                    <Col span={12}>
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
                                    {props.listCategories?.map(item =>(
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
                    <Col span={12}>
                        <CustomCheck onChange={onSelectAll}>Seleccionar todos</CustomCheck>
                    </Col>
                    <ColButtons span={12}>
                        <Radio.Group
                            onChange={onChangeType}
                            buttonStyle={'solid'}
                            defaultValue={1}
                            size={'small'}
                        >
                            <Radio.Button value={1}>Individuales</Radio.Button>
                            <Radio.Button value={2}>Grupales</Radio.Button>
                        </Radio.Group>
                    </ColButtons>
                    <Col span={24}>
                        <Table
                            rowKey={'id'}
                            columns={colums}
                            dataSource={listSurveys}
                            loading={props.loading}
                            size={'small'}
                            locale={{
                                emptyText: props.loading ?
                                "Cargando..." :
                                "No se encontraron resultados."
                            }}
                            scroll={{y: 200}}
                            rowSelection={rowSelection}
                            pagination={listSurveys.length > 10 ? { position: ['bottomLeft'] }: false}
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