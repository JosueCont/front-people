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

const SalaryByAnniversary = ({ currentNode, user }) => {
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

    const UpdateSalary = async (values) => {
      setLoading(true)        
      if(!values.patronal_registration){
          message.error("Selecciona un registro patronal")
          return
      }

      values.modified_by = user?.id;
      setFilters(values)        

      try {
          if(values.download){
              downLoadFileBlob(
                  `${getDomain(API_URL_TENANT)}/payroll/update-salary-by-anniversary`,
                  "Actualizar_salarios_aniversario.xlsx",
                  "POST",
                  values,
                  "Intente nuevamente"
              )
          }else{
              let response = await WebApiPayroll.updateSalaryByAnniversary(values);
              if (response){
                  message.success(response?.data?.message)
              }
          }

      } catch (error) {
          if (error?.response?.data?.message){
              message.error(error?.response?.data?.message)
          }else{
              message.error("Hubo un error al descargar, intenta nuevamente.")
          }
      }finally{
          setLoading(false);            
      }
    }
   
    return (
        <>
        
            <Form
                layout="vertical"
                form={formFilters}
                onFinish={UpdateSalary}
                >
                  <Row gutter={[10,0]}>                     
                    {/* <Col span={6}>
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
                    </Col>                    */}
                    <Col span={6}>
                      <SelectPatronalRegistration onChange={(value) => setPatronalSelected(value)}/>
                    </Col>                    
                </Row>
                <Row gutter={[10,0]}>
                    <Col span={6}>
                      <Form.Item  name='change_sdi' label="¿Modificar salario diario por anivesario?" initialValue={false} valuePropName="checked">
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
                      <Button htmlType="submit" loading={loading}  disabled = { patronalSelected?  false : true }>
                        Enviar    
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

export default connect(mapState)(SalaryByAnniversary); 