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
import { DeleteOutlined, SearchOutlined, PlusOutlined} from "@ant-design/icons";
import MyModal from "../../../common/MyModal";
import { ruleRequired } from "../../../utils/rules";
import { CustomInput, ButtonDanger, CompactSelect, CompactButton } from "../../assessment/groups/Styled";

const PersonsGroup = ({...props}) =>{

    const [formGroup] = Form.useForm();
    const { Option } = Select;
    const [itemsSelected, setItemsSelected] = useState();
    const [membersSelect, setMembersSelect] = useState([]);
    const [membersTable, setMembersTable] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadAdd, setLoadAdd] = useState(false);

    useEffect(() => {
        if(props.personList && props.loadData.persons){
            formGroup.setFieldsValue({name: props.loadData.name})
            filterMembers(props.loadData.persons)
        }else if(props.personList){
            setMembersSelect(props.personList)
        }
    },[]);

    const orderElements = (array)=>{
        const order =(x, y) =>{
            return x.first_name.localeCompare(y.first_name);
        }
        let ordered = array.sort(order);
        return ordered;
    }

    const filterMembers = (dataTable) =>{
        let select = [];
        let table = [];       
        props.personList.map((a)=>{
            let result = dataTable.some(b => a.id === b.id);
            if(result){
                table.push(a)
            }else{
                select.push(a)
            }
        })
        let orderedSelect = orderElements(select)
        let orderedTable = orderElements(table)
        setMembersSelect(orderedSelect)
        setMembersTable(orderedTable)
    }

    const onCloseModal = () =>{
        props.close();
        setMembersTable([])
        setMembersSelect([])
    }

    const getOnlyIds = () => {
        let ids = [];
        membersTable.map((item) => {
            ids.push(item.id);
        })
        return ids;
    };

    const onFinish = (values) =>{
        if(membersTable.length > 1){
            const ids = getOnlyIds();
            setLoadAdd(true)
            setTimeout(()=>{
                onCloseModal()
                setLoadAdd(false)
                props.actionForm({name: values.name, persons: ids})
            },2000)
        }else{
            message.error("Selecciona al menos dos personas")
        }
    }

    const colums = [
        {
            title: "Nombre",
            render: (item) => {
                return (
                    <div>
                        {item.first_name} {item.flast_name} {item.mlast_name}
                    </div>
                );
            },
            
        },
        {
            title: "Acciones",
            width: 50,
            render: (item, record, index) => {
                return (
                    <DeleteOutlined
                        onClick={()=>deleteItem(index)}
                    />
                )
            },
        }
    ]

    const onChangePerson = async (value) =>{
        let result = props.personList.filter(item => item.id === value)
        let newList = [...membersTable, result.at(-1)]
        filterMembers(newList)
        formGroup.setFieldsValue({person:null})
    }

    const deleteItem = (index) =>{
        let newList = [...membersTable];
        newList.splice(index, 1);
        filterMembers(newList);
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
                        <Form.Item
                            name={'name'}
                            label={'Nombre del grupo'}
                            style={{marginBottom: '0px'}}
                            rules={[ruleRequired]}
                        >
                            <CustomInput
                                maxLength={50}
                                allowClear={true}
                                placeholder="Ingresa un nombre"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name={'person'} label={'Seleccionar persona'} style={{marginBottom: '0px'}}>
                            <Select
                                showSearch
                                placeholder="Seleccionar persona"
                                onChange={onChangePerson}
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                filterSort={(optionA, optionB) =>
                                    optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                }
                            >
                                {membersSelect.length > 0 && membersSelect.map((item) => (
                                    <Option key={item.id} value={item.id}>
                                        {`${item.first_name} ${item.flast_name} ${item.mlast_name}`}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label={'Personas seleccionadas'}>
                            <Table
                                rowKey={'id'}
                                columns={colums}
                                showHeader={false}
                                dataSource={membersTable}
                                loading={loading}
                                size={'small'}
                                locale={{
                                    emptyText: loading ?
                                    "Cargando..." :
                                    "No se encontraron resultados."
                                }}
                                scroll={{y: 200}}
                                pagination={{ position: ['bottomLeft'], hideOnSinglePage: true }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row align={'end'}>
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

export default PersonsGroup