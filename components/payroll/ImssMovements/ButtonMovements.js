import {connect} from "react-redux";
import {UnorderedListOutlined, FileZipOutlined, SendOutlined } from "@ant-design/icons";
import {Button, Modal, Form, Input, DatePicker, Alert, Table, Row, Col} from "antd";
import {downLoadFileBlob, getDomain} from "../../../utils/functions";
import {API_URL_TENANT} from "../../../config/config";
import {useEffect, useState} from "react";
import { useSelector } from 'react-redux';
import {fourDecimal, onlyNumeric, ruleRequired} from "../../../utils/rules";
import locale from "antd/lib/date-picker/locale/es_ES";
import moment from 'moment'
import WebApiPayroll from "../../../api/WebApiPayroll";


const ButtonMovements=({person, node, payrollPerson,...props})=>{
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [form] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [movements, setMovements] = useState([]);
    //const regPatronal = useSelector(state => state.catalogStore.cat_patronal_registration);

    useEffect(()=>{
        if(showModal){
            getMovements()
        }

    },[showModal])

    const getMovements=async ()=>{
        setLoading(true)
        try{
            const res = await WebApiPayroll.getMovementsIMSSLog(node?.id);
            console.log(res)
            setMovements(res.data)

        }catch (e){

        }finally {
            setLoading(false)
        }
    }

    const onFinish=(values)=>{
        console.log(values)
    }

    const columns = [
        {
            title: 'Descripción',
            dataIndex: 'description',
            key:'dataIndex'
        },
        {
            title: 'Fecha',
            dataIndex: 'date',
            key:'date'
        },
        {
            title: 'Vigencia',
            dataIndex: 'validity_date',
            key:'validity_date'
        }
    ];


    const start = () => {
        setLoading(true);
        // ajax request after empty completing
        setTimeout(() => {
            setSelectedRowKeys([]);
            setLoading(false);
        }, 1000);
    };


    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };


    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;


    useEffect(()=>{
        if(payrollPerson?.daily_salary){
            form.setFieldsValue({
                amount:payrollPerson?.daily_salary,
                date_updated: moment()
            })
        }
    },[payrollPerson])

    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current >= moment().endOf('day');
    };



    return (
        <>
            <Button
                style={{ marginBottom: "10px", marginRight:20 }}
                loading={loading}
                icon={<UnorderedListOutlined />}
                type="link"
                onClick={()=> setShowModal(true)}
            >
                Movimientos Imss
            </Button>

            <Modal
                title="Movimientos IMSS"
                visible={showModal}
                width={1000}
                onOk={()=> form.submit()}
                onCancel={()=>setShowModal(false)}
                okText="Aceptar"
                cancelText="Cancelar"
            >
                <div
                    style={{
                        marginBottom: 16,
                    }}
                >
                    <Row gutter={36} style={{marginBottom:30}}>
                        <Col>
                            <Button type="primary" icon={<FileZipOutlined />}  onClick={start} disabled={!hasSelected} loading={loading}>
                                Generar archivo
                            </Button>
                        </Col>

                        <Col>
                            <Button type="primary" icon={<SendOutlined />} onClick={start} disabled={!hasSelected} loading={loading}>
                                Enviar movimientos
                            </Button>
                        </Col>
                        <Col span={24}>
                            <span
                                style={{
                                    marginLeft: 8,
                                }}
                            >
                              {hasSelected ? `Seleccionados ${selectedRowKeys.length} movimientos` : ''}
                            </span>
                        </Col>
                    </Row>




                    <Table rowSelection={rowSelection} columns={columns} dataSource={movements} />
                </div>

            </Modal>

        </>

    )
}


export default ButtonMovements;
