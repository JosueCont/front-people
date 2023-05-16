import React, {useEffect, useState} from "react";
import { Row, Col, Button, Form, message, Input } from "antd";
import { messageSaveSuccess, messageError, messageUpdateSuccess } from "../../utils/constant";
import WebApiPeople from "../../api/WebApiPeople";
import { ruleRequired } from "../../utils/rules";

const UiStore = ({...props}) => {

  const [loading, setLoading] = useState(false)
  const [editMode, setEditMode ] = useState(false)
  const [idCompany, setIdCompany ] = useState(null)
  const [form] = Form.useForm()
  const node = props && props.node_id

  useEffect(() => {
    if(node){
      getUsid(node)
    }
  },[])

  const getUsid = node => {
    WebApiPeople.GetUiStoreId(node)
    .then((res) => {
      if(res && res.data && res.data.results){
        
        let company = res.data.results[0].company
        let idCompany = res.data.results[0].id
        form.setFieldsValue({
          company: company
        })
        setIdCompany(idCompany)
        setEditMode(true)
      }
    })
    .catch((e) => {
      console.log('Error', e)
    })
  }

  const onFinish = (data) => {
    data.node = node
    if(editMode){
      data.id = idCompany
    }
    setLoading(true)

    if(!editMode){
      WebApiPeople.CreateUiStoreId(data)
      .then((res) => {
        message.success(messageSaveSuccess)
        getUsid(node)
      })
      .catch((e) => {
        message.error(messageError)
      })
      .finally(() => {
        setLoading(false)
      })    
    } else {
      WebApiPeople.UpdateUiStoreId(data)
      .then((res) => {
        message.success(messageUpdateSuccess)
        getUsid(node)
      })
      .catch((e) => {
        message.error(messageError)
      })
      .finally(() => {
        setLoading(false)
      })
    }
    
  }

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
    >
      <Row>
        <Col lg={6} xs={22} offset={1}>
          <Form.Item name="company" label="Id de empresa" rules={[ruleRequired]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row justify={"end"} className="container-items-center">
        <Col lg={20} xs={22} offset={1} justify={"end"}>
          <Row justify={"end"}>
            <Col offset={1}>
              <Button loading={loading} type="primary" htmlType="submit">
                { editMode? "Actualizar" : 'Guardar' }
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  )
}

export default UiStore