import { Button, Col, Form, Modal, Row, Statistic, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import SelectFixedConcept from '../selects/SelectFixedConcept'
import WebApiPayroll from '../../api/WebApiPayroll'
import moment from 'moment'
import { EyeOutlined } from '@ant-design/icons'

const Payment = () => {
    const [form] = Form.useForm()
    const fixed_concept = Form.useWatch('fixed_concept', form);

    const [conceptList, setConceptList] = useState([])
    const [openModal, setOpenModal] = useState(false)
    const [conceptSelected, setConceptSelected] = useState(null)

    const viewDetails = (data) => {
        setOpenModal(true)
        setConceptSelected(data.fixed_concept)
        
    }

    const columns = [
        {
            title: 'Fecha',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (date) => <>
                {moment(date).format("DD/MM/YYYY")}
            </>
        },
        {
            title: 'Concepto',
            dataIndex: ['fixed_concept', 'name'],
            key: 'fixed_concept',
        },
        {
            title: 'Nombre',
            dataIndex: ['payroll_person','person'],
            key: 'id',
            render: (person) => <>
                { person.first_name } { person.flast_name } { person.mlast_name }
            </>  
        },
        {
            title: 'Monto',
            dataIndex: ['fixed_concept','datum'],
            key: 'amount',
            render: (datum) => <>
                {Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(datum)}
            </>
        },
        {
            title: 'Saldo',
            dataIndex: 'balance',
            key: 'balance',
            render: (balance) => <>
                {Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(balance)}
            </>
        },
        {
            title: 'Pagos pendientes',
            dataIndex: 'remaining_payments',
            key: 'remaining_payments'
        },
        {
            title: 'Ver detalles',
            key: 'details',
            render: (item) => <>
                <EyeOutlined onClick={() => viewDetails(item) } />
            </>
        }
    ]

    const get_deferred_fixed_concept = async (values) => {
        let filters = "&remaining_payments__gte=1"
        filters += values.fixed_concept ? `&fixed_concept=${fixed_concept}` : ''
        
        try {
            let resp = await WebApiPayroll.deferredFixedConceptList(filters)
            const data = resp?.data?.results
            console.log('data',data)
            setConceptList(data)
        } catch (error) {
            console.log('error', error)
        }
    }

    useEffect(() => {
        get_deferred_fixed_concept({fixed_concept})
    }, [fixed_concept])


    const closeModal = () => {
        setOpenModal(false)
        setConceptSelected(null)
    }
    
  return (
    <>
        <Form layout='vertical' form={form}>
            <Row>
                <Col span={5}>
                    <SelectFixedConcept multiple={false} />
                </Col>
            </Row>
            
        </Form>
        <Table 
            columns={columns}
            dataSource={conceptList}
        />
        <Modal 
            visible={openModal} 
            okText="Aceptar"
            footer={
                <Button onClick={() => closeModal()}>Cerrar</Button>
            }
            onCancel={() => closeModal()}   
        >
            <Row gutter={[10,20]}>
                <Col span={12}>
                    <Statistic title="Codigo" value={conceptSelected?.code} />
                </Col>
                <Col span={12}>
                    <Statistic title="Nombre" value={conceptSelected?.name} />
                </Col>
                <Col span={12}>
                    <Statistic title="Tipo de dato" value={conceptSelected?.data_type === 1 ? 'Monto' : conceptSelected?.data_type === 2 ? 'Porcentaje' : conceptSelected?.data_type === 3 && 'Veces salario'} />
                </Col>
                <Col span={12}>
                    <Statistic title={conceptSelected?.perception ? "Percepción" : conceptSelected?.deduction ? 'Deducción' : conceptSelected?.other_payment && 'Otro pago'} value={conceptSelected?.perception ? conceptSelected?.perception?.description : conceptSelected?.deduction ? conceptSelected?.deduction?.description : conceptSelected?.other_payment && conceptSelected?.other_payment.description} />
                </Col>
            </Row>
        </Modal>
    </>
  )
}

export default Payment