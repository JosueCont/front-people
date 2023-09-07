import {useEffect, useState} from "react";
import {connect, useSelector} from "react-redux";
import moment from "moment";
import {Table, Typography, Row, Col, Tabs, Form, Button, Space, message, Select, DatePicker, Tooltip, Modal} from "antd";
import {movementsTypes} from "../../../utils/constant";
import TableMovements from "./TableMovements";
import {getMovementsIMSS} from "../../../redux/payrollDuck";
import SelectPatronalRegistration from "../../selects/SelectPatronalRegistration";
import {FileZipOutlined, SendOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import ButtonAltaImssImport from "../ImportGenericButton/ButtonAltaImssImport";
import webApiPayroll, {WebApiPayroll} from '../../../api/WebApiPayroll'
import { SearchOutlined } from "@material-ui/icons";
import locale from 'antd/lib/date-picker/locale/es_ES';

const { Title } = Typography;
const { confirm } = Modal;


const MovementsSection=({getMovementsIMSS,regPatronalProps=null,...props})=>{

    const [form] = Form.useForm();
    const regPatronal = Form.useWatch('patronal_registration', form);
    const node = useSelector(state => state.userStore.current_node);
    const [loading, setLoading] = useState(false)
    const [altaRowSelected, setAltaRowSelected] = useState([]) // registros seleccionados de movimientos de Alta
    const [updateRowSelected, setUpdateRowSelected] = useState([]) // registros seleccionados de movimientos de Altaç
    const [deleteRowSelected, setDeleteRowSelected] = useState([]) // registros seleccionados de movimientos de Baja
    const [isFilter, setIsFilter] = useState(false)

    const statusOptions = [
        {label: "Por procesar", value: 1},
        {label: "En proceso", value: 2},
        {label: "Procesado", value: 3}
    ]

    /* useEffect(()=>{
        // if(node?.id){
        //     getMovementsIMSS(node)
        // }
        if(node?.id){
            getMovementsIMSS(node, regPatronal)
        }

    },[node?.id, regPatronal]) */
    

    useEffect(()=>{
        if(regPatronalProps){
           form.setFieldsValue({patronal_registration: regPatronalProps})
        }
    },[regPatronalProps])


    const tabs = [
        {
            key:1,
            tabText: movementsTypes[1]
        },
        {
            key:2,
            tabText: movementsTypes[2]
        },
        {
            key:3,
            tabText: movementsTypes[3]
        }
    ]

    const selectRow=(type,data)=>{
        console.log(type, data)
        switch (type){
            case 1:
                return setAltaRowSelected(data)
                break;
            case 2:
                return setUpdateRowSelected(data)
                break;
            case 3:
                return setDeleteRowSelected(data)
                break;

            default:
                break;
        }
    }

    const sendFilter = (values) => {
        if(!values.patronal_registration){
            form.setFields([
                { name: 'patronal_registration', errors: ["Este campo no puede estar vacío"] },
              ]);
        }else{
            form.setFields([
                { name: 'patronal_registration', errors: [] },
              ]);
        }

        let d = values.date ? moment(values?.date).format("YYYY-MM-DD") : ''
        let vd = values.validity_date ? moment(values?.validity_date).format("YYYY-MM-DD") : ''
        getMovementsIMSS(node, values?.patronal_registration, values?.status, d, vd)
    }

    const thereIsDataSelected=(type)=>{
        switch (type){
            case 1:
                return altaRowSelected.length<=0
                break;
            case 2:
                return updateRowSelected.length<=0
                break;
            case 3:
                return deleteRowSelected.length<=0
                break;
            default:
                break;
        }
    }


    /**
     * Methodo para generar dispmag o enviar a scrapper
     * @param type
     * @param method 1 es para descargar y 2 es para enviar a movimiento de scrapper
     * @returns {Promise<void>}
     */
    const generateFileSend=async (type, method=1)=>{
        switch (method){
            case 1:
                console.log('generateFile',type, altaRowSelected)
                setLoading(true)
                try{
                    const res = await webApiPayroll.generateDispmagORSendMovement(type, regPatronal, type===1?altaRowSelected:type===2?updateRowSelected:deleteRowSelected, method)
                    console.log('generate-file',res)
                    const blob = new Blob([res.data]);
                    const link = document.createElement("a");
                    link.href = window.URL.createObjectURL(blob);
                    link.download = name;
                    link.click();
                }catch (e){
                  console.log(e)
                    message.error('No se pudo generar el archivo solicitado, porfavor intenta nuevamente')
                }finally {
                    setLoading(false)
                }
                break;
            case 2:
                setLoading(true)
                try{
                    const res = await webApiPayroll.generateDispmagORSendMovement(type, regPatronal, type===1?altaRowSelected:type===2?updateRowSelected:deleteRowSelected, method)
                    console.log('send-file',res)
                    message.success('Movimiento generado correctamente, puedes validar el estatus desde la sección de -Consulta de movimientos al IMSS- de esta misma pantalla')
                }catch (e){
                    message.error('No se pudo generar el movimiento solicitado, porfavor intenta nuevamente')
                   console.log(e)
                }finally {
                    setLoading(false)
                }
                //return updateRowSelected.length<=0
                break;
            default:
                break;
        }
    }

    return (
        <Row>
            <Col span={24}>
                <Form
                    layout={'vertical'}
                    form={form}
                    onFinish={sendFilter}
                >
                    <Row gutter={15}>
                        <Col span={6}>
                            <SelectPatronalRegistration/>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Tipo" name={"status"}>
                                <Select mode="multiple" placeholder="Todos" allowClear
                                    options={statusOptions}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={4} >
                            <Form.Item label="Fecha" name={'date'}>
                                <DatePicker locale={locale} style={{ width:'100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="Vigencia" name={'validity_date'}>
                                <DatePicker locale={locale} />
                            </Form.Item>
                        </Col>
                        <Col style={{ display:'flex' }}>
                            <Form.Item label="" style={{ marginTop:'auto' }}>
                                <Tooltip title="Buscar">
                                    <Button htmlType="submit" type="primary" icon={<SearchOutlined/>} />
                                </Tooltip>
                            </Form.Item>
                        </Col>
                        {
                            isFilter &&
                            <Col style={{ display:'flex' }}>
                                <Form.Item label="" style={{ marginTop:'auto' }}>
                                    <Tooltip title="Buscar">
                                        <Button type="primary" icon={<SearchOutlined/>} />
                                    </Tooltip>
                                </Form.Item>
                            </Col>
                        }
                        
                    </Row>
                </Form>
                <Tabs defaultActiveKey="1">
                    {
                        tabs && tabs.map((t)=>{
                            return  <Tabs.TabPane tab={t.tabText} key={t.key}>
                                <Row>
                                    <Col span={24} style={{padding:20}}>
                                        <Space>
                                            <Button loading={loading} type="primary" icon={<FileZipOutlined />} onClick={()=>generateFileSend(t.key, 1)} disabled={thereIsDataSelected(t.key)} >
                                                Generar archivo
                                            </Button>
                                            <Button loading={loading} type="primary" disabled={thereIsDataSelected(t.key)} onClick={()=> {
                                                confirm({
                                                    title: 'Envío de movimientos',
                                                    okText:'Sí, enviar',
                                                    cancelText: 'Cancelar',
                                                    icon: <ExclamationCircleOutlined />,
                                                    content: 'Estas a punto de enviar los elementos seleccionados al servicio del IMSS. ¿Continuar? ',
                                                    onOk() {
                                                        generateFileSend(t.key, 2)
                                                    },
                                                    onCancel() {
                                                        console.log('Cancelar');
                                                    },
                                                });


                                            }} icon={<SendOutlined />} >
                                                Enviar movimientos seleccionados
                                            </Button>
                                            {
                                                t.key===1 && <ButtonAltaImssImport onFinish={()=> getMovementsIMSS(node, regPatronal) }  node={node} regPatronal={regPatronal}/>
                                            }
                                        </Space>
                                    </Col>
                                </Row>
                                <TableMovements onSelectRow={(data)=>selectRow(t.key, data)} movementType={t.key} />
                            </Tabs.TabPane>
                        })
                    }
                </Tabs>
            </Col>

        </Row>
    )
}


const mapState = (state) => {
    return {
        config: state.userStore.general_config,
        permissions: state.userStore.permissions.person,
    };
};


export default connect(mapState, {getMovementsIMSS})(MovementsSection);