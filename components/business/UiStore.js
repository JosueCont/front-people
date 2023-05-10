import React, {useEffect, useState} from "react";
import { Row, Col, Button, Form, message, Input } from "antd";
import { messageSaveSuccess, messageError } from "../../utils/constant";
import WebApiPeople from "../../api/WebApiPeople";

const UiStore = ({...props}) => {

  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const node = props && props.node_id

  useEffect(() => {
    if(node){
      getUsid(node)
    }
  },[node])

  const getUsid = node => {
    WebApiPeople.GetUiStoreId(node)
    .then((res) => {
      console.log('Response', res)
    })
    .catch((e) => {
      console.log('Error', e)
    })
  }

  const onFinish = (data) => {
    data.node = node
    setLoading(true)
    WebApiPeople.CreateUiStoreId(data)
    .then((res) => {
      message.success(messageSaveSuccess)
    })
    .catch((e) => {
      message.error(messageError)
    })
    .finally(() => {
      setLoading(false)
    })
    
  }

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
    >
      <Row>
        <Col lg={6} xs={22} offset={1}>
          <Form.Item name="company" label="Id de empresa">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row justify={"end"} className="container-items-center">
        <Col lg={20} xs={22} offset={1} justify={"end"}>
          <Row justify={"end"}>
            <Col offset={1}>
              <Button loading={loading} type="primary" htmlType="submit">
                Guardar
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  )
}

export default UiStore