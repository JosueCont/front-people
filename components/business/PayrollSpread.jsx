import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined, SyncOutlined } from '@ant-design/icons';
import { PlusOneOutlined } from '@material-ui/icons';
import { Button, Col, ConfigProvider, DatePicker, Divider, Form, Input, Modal, Row, Select, Space, Spin, Table, Tooltip, message } from 'antd'
import esES from "antd/lib/locale/es_ES";
import WebApiPayroll from "../../api/WebApiPayroll";
import React, { useEffect, useState } from 'react'

const PayrollSpread = ({ node_id = null, ...props }) => {
const [form] = Form.useForm()
const [formFilter] = Form.useForm()
const [dataList, setDataList] = useState([])
const [showModal, setShowModal] = useState(false)
const [selectedItem, setSelectedItem] = useState(null)
const [bankList, setBankList] = useState([])
const ruleRequired = {required:true, message:'Este campo es requerido'}
const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
const [loadingData, setLoadingData] = useState(false)
const [saving, setSaving] = useState(false)
const [filterName, setFilterName] = useState(null)
  
  const getBanks = async () => {
    try {
        let response = await WebApiPayroll.getBanks()
        if(response.status === 200){
            let list = response.data.results.map(item => {
                return {value: item.id, label: item.name}
            })
            setBankList(list)
        }
        console.log('response', response)
    } catch (error) {
        console.log('error', error.data)
    }
  }

  const getInfo = async (name="") => {
    setLoadingData(true)
    try {
      let filters = `?node__id=${node_id}&name__icontains=${name}`
      let response = await WebApiPayroll.getPayrollSpred(filters)
      if(response.status === 200){
        setDataList(response?.data?.results)
      }
      setLoadingData(false)
    } catch (error) {
      console.log('error', error)
      setLoadingData(false)
    }
  }

  const onEdit = (item) =>{
    setSelectedItem(item)
    form.setFields([
        {
            name:'name',
            value: item.name
        },
        {
            name:'bank',
            value: item.bank.id
        },
        {
            name:'bank_account',
            value: item.bank_account
        },
        {
            name: 'branch_number',
            value: item.branch_number
        },
        {
            name: 'commercial_zone_number',
            value: item.commercial_zone_number
        }
    ])
    setShowModal(true)
  }

  const onAdd = () => {
    form.resetFields()
    setShowModal(true)
  }

  const onSearch = (values) => {
    setFilterName(values.filter_name)
    getInfo(values.filter_name)
  }

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    form.resetFields();
  }

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Banco',
      dataIndex: ['bank','name'],
      key: 'bank',
    },
    {
      title: 'Cuenta emisora',
      dataIndex: 'bank_account',
      key: 'emisor_bank',
    },
    {
      title: 'Núm. Sucursal Bancaria',
      dataIndex: 'branch_number',
      key: 'branch_office',
    },
    {
        title: 'Núm. de Plaza',
        dataIndex: 'commercial_zone_number',
        key: 'no_work_title',
    },
    {
        title: "Acciones",
        align: "center",
        key: "actions",
        render: (item) => {
            return (
                    <Space size={"large"}>
                        <Tooltip title="Editar">
                            <EditOutlined onClick={() => onEdit(item)} />
                        </Tooltip>
                        <Tooltip title="Eliminar">
                            <DeleteOutlined
                                onClick={() => onDelete(item)}
                            />
                        </Tooltip>
                    </Space>
            )
        }
    }
  ]

  useEffect(() => {
    getBanks();
    getInfo()
  }, [])

  const updData = async (data) =>{
    try {
        setSaving(true)
        let response = await WebApiPayroll.updPayrollSpred(data, selectedItem)
        if(response.status === 201){
            message.success("Dispersión actualizada")
            closeModal()
            getInfo(filterName?filterName:"")
        }
        setSaving(false)
      } catch (error) {
        setSaving(false)
        if(error?.response?.data?.message){
            if(Array.isArray(error?.response?.data?.message)){
                let errors = []
                Object.entries(error?.response?.data?.message).map(([key, value]) => {
                    let err = {
                        name:key,
                        errors: value
                    }
                    errors.push(err)
                })
                form.setFields(errors)
            }else{
                message.error(error?.response?.data?.message)
            }
        }else{
            message("Dispersión no actualizada")
        }
      }
  }

  const saveData = async (data) =>{
    try {
        setSaving(true)
        let response = await WebApiPayroll.savePayrollSpred(data)
        if(response.status === 201){
            message.success("Dispersión creada")
            closeModal()
            getInfo(filterName?filterName:"")
        }
        setSaving(false)
      } catch (error) {
        setSaving(false)
        console.log('err0r',error.response.data.message)
            if(error?.response?.data?.message){
                let errors = []
                if(Array.isArray(error?.response?.data?.message)){
                    Object.entries(error?.response?.data?.message).map(([key, value]) => {
                        let err = {
                            name:key,
                            errors: value
                        }
                        errors.push(err)
                    })
                    form.setFields(errors)
                }else{
                    message.error(error?.response?.data?.message)
                }
            }else{
                message("Dispersión no guardada")
            }   
      }
  }

  const onDeleteConfirm = async () => {
    try {
        setSaving(true)
        let response = await WebApiPayroll.deletePayrollSpred(selectedItem)
        if(response.status === 200){
            message.success("Dispersión eliminada")
        }else{
            message.error("Dispersión no eliminada")
        }
        setModalDeleteVisible(false)
        setSelectedItem(null)
        setSaving(false)
        getInfo(filterName?filterName:"")
    } catch (error) {
        setSaving(false)
        message.error("Ocurrio un error al eliminar la dispersión")
    }
  }

  const onDelete = (item) =>{
    setSelectedItem(item)
    setModalDeleteVisible(true)
}

  const onFinish = (values) =>{
    values['node'] = node_id
    if(selectedItem){
        updData(values)
    }else{
        saveData(values)
    }  
  }

  const onSearchReset = () => {
    formFilter.resetFields()
    setFilterName(null)
    getInfo()
  }
  
  return (
    <>
      {/* BÚSQUEDA */}
      <Row>
            <Col span={18}>
                <ConfigProvider locale={esES}>
                    <Form form={formFilter} scrollToFirstError onFinish={onSearch}>
                        <div style={{display: "flex", justifyContent:'flex-start', gap:8, flexWrap:'wrap'}}>
                            <Form.Item  label="Filtrar" name={'filter_name'}>
                                <Input />
                            </Form.Item>
                            <div style={{ float: "left", marginLeft: "5px" }}>
                                <Form.Item>
                                    <Button htmlType="submit">
                                        <SearchOutlined />
                                    </Button>
                                </Form.Item>
                            </div>
                            <div style={{ float: "left", marginLeft: "5px" }}>
                                <Form.Item>
                                    <Button onClick={()=>onSearchReset()}>
                                        <SyncOutlined />
                                    </Button>
                                </Form.Item>
                            </div>
                        </div>
                    </Form>
                </ConfigProvider>
            </Col>

            <Col span={6} style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button onClick={onAdd} >
                        <PlusOutlined /> Agregar
                    </Button>
            </Col>
        </Row>
        <Divider style={{ marginTop: "2px" }} />
        <Table
            loading={loadingData}
            columns={columns}
            dataSource={dataList}
            pagination={false}
        />
        <Modal onOk={() => form.submit()} title={selectedItem?'Editar dispersión' : 'Crear dispersión'} visible={showModal} onCancel={closeModal}>
        <Form
            onFinish={onFinish}
            
            form={form}
            layout={"vertical"}
        >
            <Spin spinning={saving}>
                <Form.Item rules={[ruleRequired]} label="Nombre de la cuenta bancaria" name={'name'} >
                    <Input />
                </Form.Item>
                <Form.Item rules={[ruleRequired]} label="Banco" name={'bank'} >
                    <Select options={bankList} />
                </Form.Item>
                <Form.Item rules={[ruleRequired,{max:11, message:'Ingresa maximo 11 digitos'}]} label="Cuenta bancaria emisora" name={'bank_account'} >
                    <Input />
                </Form.Item>
                <Form.Item rules={[ruleRequired]} label="Número de sucursal bancaria" name={'branch_number'} >
                    <Input />
                </Form.Item>
                <Form.Item rules={[ruleRequired]} label="Número de plaza" name={'commercial_zone_number'} >
                    <Input />
                </Form.Item>
            </Spin>
        </Form>
        </Modal>
        {selectedItem && modalDeleteVisible &&
            <Modal
                title="Eliminar día inhábil"
                visible={modalDeleteVisible}
                onOk={onDeleteConfirm}
                okButtonProps={{ loading: saving }}
                onCancel={() => {
                    setModalDeleteVisible(false)
                    setSelectedItem(null)
                }}
                cancelButtonProps={{ disabled: saving }}
                okText="Sí, Eliminar"
                cancelText="Cancelar"
            >
                <Spin spinning={saving}>
                    ¿Desea eliminar "{selectedItem.name}"?
                </Spin>
            </Modal>
        }
    </>
  )
}

export default PayrollSpread