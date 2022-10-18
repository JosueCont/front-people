import React, { useState, useEffect} from 'react'
import {
  Button,
  Col,
  Input,
  Row,
  Typography,
  Upload,
  Form,
  message,
  InputNumber
} from "antd";
import WebApiFiscal from '../../api/WebApiFiscal';
import { toInteger } from 'lodash';
import { useRouter } from 'next/router';


const IntegrationFactorsForm =  ({ nodeId, factor }) => {

  const { Title } = Typography;
  const [formFactor] = Form.useForm();
  const [ loading, setLoading ] = useState(false)
  const route = useRouter();

  useEffect(() => {
    if(factor){
      formFactor.setFieldsValue({
        vacations_days: factor.vacations_days,
        vacation_percent: factor.vacation_percent,
        bonus_days: factor.bonus_days,
        description: factor.description
      })
    }
  },[factor])

  const routeIndex = () => {
    route.push({ pathname: "/business/integrationFactors" })
  }

  const onSaveFactor = async (values) => {
    setLoading(true)
    values.node = nodeId
    values.bonus_days = toInteger(values.bonus_days)
    values.vacation_percent = toInteger(values.vacation_percent)
    values.vacations_days = toInteger(values.vacations_days)
    WebApiFiscal.saveIntegrationFactor(values)
    .then((response) => {
      console.log("Response", response)
      if (response.data.message && response.data.message == 'success'){
        setLoading(false)
        formFactor.resetFields()
        message.success('Configuración agregada')
        setTimeout(routeIndex(), 2000)
      }
      
    })
    .catch((error) => {
      console.log("Error", error)
      setLoading(false)
    })
  }

  const updateFactor = async (values) => {
    setLoading(true)
    values.node = nodeId
    values.bonus_days = toInteger(values.bonus_days)
    values.vacation_percent = toInteger(values.vacation_percent)
    values.vacations_days = toInteger(values.vacations_days)
    WebApiFiscal.updateIntegratorFactor(values, factor.id)
    .then((response) => {
      if (response.data.message && response.data.message == 'success'){
        setLoading(false)
        formFactor.resetFields()
        message.success('Configuración agregada')
        setTimeout(routeIndex(), 2000)
      }
      
    })
    .catch((error) => {
      console.log("Error", error)
      setLoading(false)
    })
  }

  return (
    <Form
      layout={"vertical"}
      form={formFactor}
      onFinish = { factor? updateFactor : onSaveFactor } 
      size="large"
    >
      <Row gutter={30} style={{ marginBottom: 20 }}>
          <Col lg={8} xs={12}>
            <Form.Item label="Numero de dias de vacaciones" name="vacations_days">
              <InputNumber max={30} min={1} style={{ width: '100%' }}/>
            </Form.Item>
          </Col>
          <Col lg={8} xs={12}>
            <Form.Item label="Porcentaje de prima vacacional" name="vacation_percent">
              <InputNumber max={100} min={1} style={{ width: '100%' }}/>
            </Form.Item>
          </Col>
          <Col lg={8} xs={12}>
            <Form.Item label="Dias de aguinaldo" name="bonus_days">
              <InputNumber max={30} min={1} style={{ width: '100%' }}/>
            </Form.Item>
          </Col>
          <Col lg={8} xs={12}>
            <Form.Item label="Descripción" name="description">
              <Input.TextArea />
            </Form.Item>
          </Col>
      </Row>
      <Row justify={"end"}>
        <Col>
              <Button
                className="close_modal"
                htmlType="button"
                style={{ marginRight: 10 }}
                onClick={() =>
                  route.push({ pathname: "/business/integrationFactors" })
                }
              >
                {factor && factor.id ? "Cerrar" : "Cancelar"}
              </Button>
              <Button loading = { loading } type="primary" htmlType="submit">
                  Guardar
              </Button>
            </Col>
        </Row>
    </Form>
  )
}

export default IntegrationFactorsForm