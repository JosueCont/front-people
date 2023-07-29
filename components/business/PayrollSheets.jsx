import { ClearOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, Modal, Row, Select, Space, Spin, Table, message } from 'antd'
import React, { useEffect, useState } from 'react'
import WebApiPayroll from '../../api/WebApiPayroll'
import {onlyNumeric} from '../../utils/rules'

const PayrollSheets = ({ node_id, ...props }) => {
    const [formFilter] = Form.useForm()
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [dataList, setDataList] = useState([])
    const [totalRows, settotalRows] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [showModalDelete, setShowModalDelete] = useState(false)
    const [idEdit, setIdEdit] = useState(null)
    const [forDelete, setForDelete] = useState(null)
    const [filterActive, setFilterActive] = useState(false)
    const [typesAvailables, setTypesAvailables] = useState([])

    const invoices_type_options = [
        {
            label: 'Pago extraordinario',
            value: 'CE'
        },
        {
            label: 'Comprobante de nómina',
            value: 'CN'
        },
        {
            label: 'Comprobante de nómina asimilado',
            value: 'CA'
        }
    ]

    const columns = [
        {
            title: "Tipo de factura",
            dataIndex: "invoice_type",
            key: "invoice_type",
            render: (type) => (
                <>
                    {type  === "CE" ? "Pago extraordinario" : type  === "CN" ? "Comprobante de nómina" :  type  === "CA" && "Comprobante de nómina asimilado"}
                </>
            )
        },
        {
            title: "Serie",
            dataIndex: "serie",
            key: "serie"
        },
        {
            title: "Folio inicial",
            dataIndex: "initial_folio",
            key: "initial_folio"
        },
        {
            title: "Folio final",
            dataIndex: "final_folio",
            key: "final_folio"
        },
        {
            title: "Acciones",
            key: "actions",
            render: (record) =><>
                <Space size={20}>
                    <EditOutlined  onClick={() => editRecord(record) } />
                    <DeleteOutlined onClick={() => deleteRecord(record)} />
                </Space>
            </>
        }
    ]

    const getSelectOptions = (removeOption = false) => {
        let newOptions = [...invoices_type_options]
        if(removeOption){
            dataList.map(item => {
                newOptions = newOptions.filter(option => item.invoice_type !== option.value)
            })
        }
        return newOptions
    }

    const getPayrollSheets = async (filters=null) => {
        try {
            setLoading(true)
            let resp = await WebApiPayroll.getPayrollSheets(filters)
            if(resp.status === 200){
                console.log('resp?.data?.results', resp?.data?.results)
                setDataList(resp?.data?.results)
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            setDataList([])
            console.log('error', error)
        }
    }

    const deleteRecord = (record) =>{
        setForDelete(record)
        setShowModalDelete(true)
    }

    const editRecord = (record) => {
        console.log('record', record)
        setIdEdit(record.id)
        form.setFieldsValue(
            {
               'invoice_type': record?.invoice_type,
                'serie': record?.serie,
                'initial_folio': record?.initial_folio,
                'actual_folio': record?.actual_folio,
                'final_folio': record?.final_folio
            }
        )
        setShowModal(true)
    }

    const onSearch = (values) => {
        let filters = `&node=${node_id}`
        if(values['invoice_type']){
            filters += `&invoice_type=${values['invoice_type']}`
        }
        if(values['serie']){
            filters += `&serie=${values['serie']}`
        }
        if(values['initial_folio']){
            filters += `&initial_folio=${values['initial_folio']}`
        }
        if(values['actual_folio']){
            filters += `&actual_folio=${values['actual_folio']}`
        }
        if(values['final_folio']){
            filters += `&final_folio=${values['final_folio']}`
        }
        getPayrollSheets(filters)
    }

    const onAdd = () =>{
        setIdEdit(null)
        form.resetFields()
        setShowModal(true)
    }

    const closeModal = () => {
        form.resetFields()
        setShowModal(false)
        setIdEdit(null)
    }

    const updData = async (data) => {
        setLoading(true)
        try {
            data['node'] = node_id
            let resp = await WebApiPayroll.updPayrollSheets(idEdit, data)
            if( resp.status === 200 ){
                message.success("Folio actualizado correctamente")
            }
            closeModal()
            formFilter.submit()
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log('error', error)
        }   
    }

    const updAvailables = (dataSuccess) => {
        
        let tempList = [...typesAvailables]

        let list = tempList.filter(item => item.value !== dataSuccess.invoice_type)
        setTypesAvailables(list)
    }

    const addData = async (data) => {
        try {
            setLoading(true)
            data['actual_folio'] = data['initial_folio']
            data['node'] = node_id
            let resp = await WebApiPayroll.addPayrollSheets(data)
            if( resp.status === 201 ){
                message.success("Folio agregado correctamente")
                updAvailables(resp?.data)
            }
            closeModal()
            setLoading(false)
            formFilter.submit()
        } catch (error) {
            setLoading(false)
            console.log('error', error)
        }
    }

    const clearFilter = () => {
        formFilter.resetFields()
        getPayrollSheets(`&node=${node_id}`)
        setFilterActive(false)
    }
    
    const onFinishForm = (values) => {
        if(idEdit){
            updData(values)
        }else{
            addData(values)
        }
    }

    const cancelDelete = () => {
        setForDelete(null)
        setShowModalDelete(false)
    }

    const deleteFolio = async () => {
        console.log('forDelete', forDelete)
        try {
            let resp = await WebApiPayroll.delPayrollSheets(forDelete.id)
            if(resp.status === 204){
                message.success("Folio eliminado correctamente")
                setForDelete(null)
                formFilter.submit()
                setShowModalDelete(false)
                updAvailables()
                
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    useEffect(() => {
        setTypesAvailables(invoices_type_options)
        if(node_id){
            getPayrollSheets(`node=${node_id}`)
        }
    }, [node_id])
    
    

  return (
    <>
        <Row>
            <Col span={20}>
                <Form form={formFilter} layout="vertical" scrollToFirstError onFinish={onSearch}>
                    <Row gutter={10}>
                        <Col span={8}>
                            <Form.Item label="Tipo de factura" name={'invoice_type'} style={{ marginBottom:10 }}>
                                <Select allowClear
                                    options={invoices_type_options}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Serie" name={'serie'} style={{ marginBottom:10 }}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item  label="Folio inicial" name={'initial_folio'} style={{ marginBottom:10 }} >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Folio actual" name={'actual_folio'} style={{ marginBottom:10 }} >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Folio final" name={'final_folio'} style={{ marginBottom:10 }} >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item style={{ marginBottom:10, marginTop:28 }}  >
                                <Space>
                                    <Button onClick={() => setFilterActive(true)} htmlType="submit" icon={<SearchOutlined/>} disabled={loading} loading={loading}  />
                                    {
                                        filterActive &&
                                        <Button htmlType="button" icon={<ClearOutlined/>} disabled={loading} onClick={clearFilter}  />
                                    }
                                </Space>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Col>
            <Col span={4} style={{ textAlign:'end' }}>
                <Button style={{ marginTop:28 }} disabled={loading} onClick={onAdd}>
                    Agregar
                </Button>
            </Col>
            <Col span={24}>
                <Spin spinning={loading}>
                    <Table
                        columns={columns}
                        dataSource={dataList}
                    />
                </Spin>
            </Col>
        </Row>
        <Modal visible={showModal} 
            onOk={form.submit}
            onCancel={closeModal}
            width={600}
            destroyOnClose
        >
            <Spin spinning={loading}>
                <Form form={form} onFinish={onFinishForm} layout="vertical" >
                    <Row gutter={10}>
                        <Col span={12}>
                            <Form.Item label="Tipo de factura" name={'invoice_type'} style={{ marginBottom:10 }}>
                                <Select disabled={idEdit}
                                    options={idEdit !== null ? invoices_type_options : typesAvailables}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Serie" name={'serie'} style={{ marginBottom:10 }}>
                                <Input  />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item rules={[onlyNumeric]} label="Folio inicial" name={'initial_folio'} style={{ marginBottom:10 }} >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Folio actual" name={'actual_folio'} style={{ marginBottom:10 }} >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item rules={[onlyNumeric]} label="Folio final" name={'final_folio'} style={{ marginBottom:10 }} >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Spin>
        </Modal>
        <Modal visible={showModalDelete} title={`Eliminar folio`} onCancel={cancelDelete} onOk={deleteFolio}>
            ¿Desea eliminar el folio con para el tipo de factura 
            "{forDelete?.invoice_type  === "CE" ? "Pago extraordinario" : forDelete?.invoice_type  === "CN" ? "Comprobante de nómina" :  forDelete?.invoice_type  === "CA" && "Comprobante de nómina asimilado"}"
            con serie "{forDelete?.serie}"?
        </Modal>
    </>
  )
}

export default PayrollSheets