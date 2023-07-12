import { useEffect, useState } from "react";
import {UploadOutlined, DownloadOutlined, SyncOutlined, CheckOutlined, CloseOutlined} from '@ant-design/icons';
import { API_URL_TENANT, API_URL } from "../../../config/config";
import { downLoadFileBlob, getDomain } from "../../../utils/functions";
import { Table, Button, Upload, Row, Col, message, Modal, Form, Select, DatePicker, Switch } from 'antd';
import WebApiPayroll from "../../../api/WebApiPayroll";
import WebApiPeople from "../../../api/WebApiPeople";
import SelectPatronalRegistration from "../../selects/SelectPatronalRegistration";
import UploadFile from "../../UploadFile";
import { connect } from "react-redux";
import moment, { locale } from 'moment'
import { ruleRequired } from "../../../utils/rules";

const Variability = ({ currentNode, user }) => {
    const [formFilters] = Form.useForm()
    const [ loading, setLoading ] = useState(false)
    const [patronalSelected, setPatronalSelected] = useState(null);
    const [ filters, setFilters ] = useState(null)
    const [year, setYear] = useState(null)



    const bimesters = [
        {label: "1 - (Enero - Febrero)", value: 1},
        {label: "2 - (Marzo - Abril)", value: 2},
        {label: "3 - (Mayo - Junio)", value: 3},
        {label: "4 - (Julio - Agosto)", value: 4},
        {label: "5 - (Septiembre - Octubre)", value: 5},
        {label: "6 - (Noviembre - Diciembre)", value: 6},
    ]

    const getMonths = (bimester) => {
        switch (bimester) {
            case 1:
                return [1, 2]               
            case 2:
                return [3, 4]                 
            case 3:
                return [5, 6]                
            case 4:
                return [7, 8]                
            case 5:
                return [9, 10]                
            case 6:
                return [11, 12]                
            default:
                break;
        }
    }

    const changeYear = (date, dateString) => {
        setYear(parseInt(dateString));      
    }

    const generateVariability = async (values) => {
        if(!values.patronal_registration){
            message.error("Selecciona un registro patronal")
            return
        }

        if (year){
            values.year = year
        }
        else {
            message.error("Selecciona un registro patronal") 
            return
        }

        if(values.bimester){
            let months = getMonths(values.bimester)
            values.start_month = parseInt(months[0])
            values.end_month = parseInt(months[1])   
        }

        values.modified_by = user?.id;
        setFilters(values)        

        setLoading(true)
        try {
            let response = await WebApiPayroll.generateVariability(values);            
            if (response){
                if (values.download){
                    const blob = new Blob([response.data]);
                    const link = document.createElement("a");
                    link.href = window.URL.createObjectURL(blob);
                    link.download = "Reporte_de_variabiliadad.xlsx";
                    link.click();                      
                }
                else message.success(response.data.message)            
            }
        } catch (error) {
            if (error?.data?.message){
                message.error(error.data.message)
            }            
        }finally{
            setLoading(false);
        }
    }
   
    return (
        <>
            <h4>Variabilidad</h4>
            <Form
                layout="vertical"
                form={formFilters}
                onFinish={generateVariability}
                >
                  <Row gutter={[10,0]}>                     
                    <Col span={6}>
                      <Form.Item rules={[ruleRequired]} name="year" label="Año">
                      <DatePicker 
                        style={{ width:'100%' }} 
                        picker="year"
                        format={'YYYY'}
                        onChange={changeYear}
                        moment={"YYYY"}
                        locale={locale}  
                        />   
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item  name='bimester' label="Bimestre" rules={[ruleRequired]}>
                        <Select placeholder={"Bimestre"} options={bimesters}/>
                      </Form.Item>
                    </Col>                   
                    <Col span={6}>
                      <SelectPatronalRegistration onChange={(value) => setPatronalSelected(value)}/>
                    </Col>                    
                </Row>
                <Row gutter={[10,0]}>
                    <Col span={6}>
                      <Form.Item  name='change_sdi' label="¿Modificar Salario diario integrado?" initialValue={false} valuePropName="checked">
                        <Switch
                         checkedChildren={<CheckOutlined />}
                         unCheckedChildren={<CloseOutlined />}                        
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item  name='generate_movement' label="¿Generar movimiento IMSS?" initialValue={false} valuePropName="checked">
                        <Switch
                         checkedChildren={<CheckOutlined />}
                         unCheckedChildren={<CloseOutlined />}                        
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item  name='download' label="¿Descargar reporte?" initialValue={true} valuePropName="checked">
                        <Switch
                         checkedChildren={<CheckOutlined />}
                         unCheckedChildren={<CloseOutlined />}                        
                        />
                      </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[10,0]}>
                    <Col span={24}>   
                      <Button htmlType="submit"  disabled = { patronalSelected?  false : true }>
                        Generar variabilidad    
                      </Button>
                    </Col>
                </Row>
                </Form>

            {/* <Row justify={'space-between'} style={{ marginTop: '20px' }}>
               
                
            </Row> */}

            {/* <Table 
              style={{width:'100%'}} 
              columns={columns} 
              dataSource={[]} 
              size="middle"
              loading = { loading }
              scroll={{ x: true }}
              locale={{
                emptyText: loading ? "Cargando..." : "No se encontraron datos.",
              }}
              
            />            */}
        </>
    )
}


const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node,
        user: state.userStore.user,
    };
};

export default connect(mapState)(Variability); 