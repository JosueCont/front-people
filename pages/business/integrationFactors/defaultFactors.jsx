import React, { useState, useEffect } from "react";
import MainLayout from '../../../layout/MainInter'
import {
  Button,
  Col,
  Row,
  Table,
  Spin,
  DatePicker,
  Switch,
  Form,
  message
} from "antd";
import WebApiFiscal from '../../../api/WebApiFiscal';
import { Breadcrumb } from 'antd';
import { useRouter } from "next/router";
import { locale } from "moment";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { connect } from 'react-redux';
import WebApiPeople from "../../../api/WebApiPeople";

const defaultFactors = ({currentNode}) => {

  
  const route = useRouter()
  const query = route.query? route.query : {}
  const [loading, setLoading] = useState(false)
  const [detailFactor, setDetailFactor] = useState([])
  const [filtersYears, setFiltersYears] = useState()  
  const [formNode] = Form.useForm();

  useEffect(() => {
    let current_year = new Date().getFullYear()
    getDetails(current_year)
    if(currentNode){      
      getBenefitsNdeConfig(currentNode.id)
    }
  },[])

  const getBenefitsNdeConfig = async (node_id) =>{    
    setLoading(true);   
    try {
      let response = await WebApiPeople.getBenefitsNodeConfig(node_id)
      if (response){           
        formNode.setFieldsValue({
          distribute_benefits_with_previous_law: response.data.distribute_benefits
        })     
        setLoading(false);
      }
    } catch (error) {
      console.log('Error', error)      
    } finally {      
      setLoading(false)
    }
  }



  const getDetails = async (year) => {    
    setLoading(true)
    try {
      let response = await WebApiFiscal.defaultIntegratorFactor(year)
      if(response.data) {
        let filtersYearList = []
        
        response.data.map(dataitem => {
          let idx = filtersYearList.findIndex(item => item.value === dataitem.year)
          if(idx < 0){
            filtersYearList.push({
              text:dataitem.year,
              value: dataitem.year
            })
          }
        })
        
        setFiltersYears(filtersYearList)
        setDetailFactor(response.data)
      }
    } catch (error) {
      console.log('Error', error)
      setDetailFactor([])
    } finally {      
      setLoading(false)
    }
  }

  const onChange = (date, dateString) => {    
    if (dateString) {
     getDetails(dateString)
    } 
  }

  const updateConfig = async (data) =>{
    setLoading(true);   
    try {
      let response = await WebApiPeople.UpdateProportionalBenefits(data)
      if (response){        
        setLoading(false);
        message.success("Se ha modificado la configuración para esta empresa");
      }
    } catch (error) {
      message.error("Ocurrió un error");
      console.log('Error', error)      
    } finally {      
      setLoading(false)
    }
  }

  const changeChecked = (value) => {
    let data = {
      id: currentNode.id,
       distribute_benefits: value
      }
      updateConfig(data);
  }

  const columns = [
    {
      title: 'Periodo',
      dataIndex: 'year',
      key: 'year',
      filters: filtersYears,
      onFilter: (value, record) => record.year === value,
      // specify the condition of filtering result
      // here is that finding the name started with `value`
      /* onFilter: (value: string, record) => record.name.indexOf(value) === 0, */
      sorter: (a, b) => a.year - b.year,
    },
    {
      title: 'Años de servicio',
      dataIndex: 'service_years',
      key: 'service_year'
    },
    {
      title: 'Días de aguinaldo',
      dataIndex: 'bonus_days',
      key: 'bonus_days'
    },
    {
      title: 'Días de vacaciones',
      dataIndex: 'vacations_days',
      key: 'vacations_days'
    },
    {
      title: 'Porcentaje de prima vacacional',
      dataIndex: 'vacation_percent',
      key: 'vacation_percent'
    },
    {
      title: 'Factor de integracion',
      dataIndex: 'integration_factor',
      key: 'integration_factor'
    }
  ]


  return(
    <Spin spinning = { loading }>
      <MainLayout
        currentKey={["integrationFactors"]}
        defaultOpenKeys={["strategyPlaning","company"]}
      >
              <Breadcrumb className={"mainBreadcrumb"}>
          <Breadcrumb.Item
            className={"pointer"}
            onClick={() => route.push({ pathname: "/home/persons/" })}
          >
            Inicio
          </Breadcrumb.Item>
          <Breadcrumb.Item>Empresa</Breadcrumb.Item>
          <Breadcrumb.Item>Prestaciones</Breadcrumb.Item>
          <Breadcrumb.Item>Ver prestaciones de ley</Breadcrumb.Item>
        </Breadcrumb>

        <div
          className="container-border-radius"
          style={{ padding: 24, minHeight: 380, height: "100%" }}
        >
          <Row justify={"end"}>
            <Col span={12}>              
              <DatePicker 
                onChange={onChange}
                picker="year"
                moment={"YYYY"}
                locale={locale}
                placeholder="Filtrar por año"
              />              
            </Col>
            <Col span={12}>           
                <Button
                  className="close_modal"
                  htmlType="button"
                  style={{ marginRight: 10, float: "right" }}
                  onClick={() =>
                    route.push({ pathname: "/business/integrationFactors" })
                  }
                >
                  Cerrar
                </Button>
              </Col>
          </Row>
          <Row>
          <Col span={12}>
                  <Form
                   layout={"vertical"}
                   form={formNode}
                  //  onFinish={updateConfig}
                   size="large"
                  >
                    <Form.Item
                      label="¿Repartir vacaciones con ley anterior?"
                      name="distribute_benefits_with_previous_law"
                      valuePropName="checked"                      
                      >
                        <Switch
                          checkedChildren={<CheckOutlined />}
                          unCheckedChildren={<CloseOutlined />}
                          onChange={changeChecked}
                        />
                    </Form.Item>
                  </Form>                  
                </Col>
          </Row>
          <Row justify="end" style={{ marginTop: 30 }}>
          <Col span={24}>
            <Table 
              className="table-data"
              columns={columns}
              dataSource={detailFactor}
              key="tableDetailIntegrationFactors"
              scroll={{ x: 350 }}
              locale={{
                emptyText: loading
                  ? "Cargando..."
                  : "No se encontraron resultados.",
              }}
              pagination = {false}
            />
          </Col>
        </Row>
        </div>
      </MainLayout>
    </Spin>
  )
}

const mapState = (state) =>{
  return {
    currentNode: state.userStore.current_node      
  }
}
export default connect(mapState)(defaultFactors);