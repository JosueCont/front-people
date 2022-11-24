import {useEffect, useState} from "react";
import {connect, useSelector} from "react-redux";
import moment from "moment";
import {Table, Typography, Row, Col, Tabs, Form, Button, Space} from "antd";
import {movementsTypes} from "../../../utils/constant";
import TableMovements from "./TableMovements";
import {getMovementsIMSS} from "../../../redux/payrollDuck";
import SelectPatronalRegistration from "../../selects/SelectPatronalRegistration";
import {FileZipOutlined, SendOutlined} from "@ant-design/icons";
import ButtonAltaImssImport from "../ImportGenericButton/ButtonAltaImssImport";

const { Title } = Typography;


const MovementsSection=({getMovementsIMSS,...props})=>{

    const [form] = Form.useForm();
    const regPatronal = Form.useWatch('patronal_registration', form);
    const node = useSelector(state => state.userStore.current_node);
    const [altaRowSelected, setAltaRowSelected] = useState([]) // registros seleccionados de movimientos de Alta
    const [updateRowSelected, setUpdateRowSelected] = useState([]) // registros seleccionados de movimientos de Altaç
    const patronal_registration = Form.useWatch('patronal_registration', form);

    useEffect(()=>{
        if(node?.id){
            getMovementsIMSS(node)
        }

    },[node?.id])


    useEffect(()=>{
        if(regPatronal)
        console.log(regPatronal)
    },[regPatronal])

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
        switch (type){
            case 1:
                return setAltaRowSelected(data)
                break;
            case 2:
                return setUpdateRowSelected(data)
                break;
            default:
                break;
        }
    }


    const thereIsDataSelected=(type)=>{
        switch (type){
            case 1:
                return altaRowSelected.length<=0
                break;
            case 2:
                return updateRowSelected.length<=0
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
                >
                    <Row>
                        <Col span={6}>
                            <SelectPatronalRegistration/>
                        </Col>
                    </Row>
                </Form>
                <Tabs defaultActiveKey="1">
                    {
                        tabs && tabs.map((t)=>{
                            return  <Tabs.TabPane tab={t.tabText} key={t.key}>
                                <Row>
                                    <Col span={24} style={{padding:20}}>
                                        <Space>
                                            <Button type="primary" icon={<FileZipOutlined />} disabled={thereIsDataSelected(t.key)} >
                                                Generar archivo
                                            </Button>
                                            <Button type="primary" disabled={thereIsDataSelected(t.key)} icon={<SendOutlined />} >
                                                Enviar movimientos seleccionados
                                            </Button>
                                            {
                                                t.key===1 && <ButtonAltaImssImport node={node} regPatronal={patronal_registration}/>
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