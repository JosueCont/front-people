import React, { useState } from "react";
import MyModal from "../../../common/MyModal";
import { Col, Form, Input, Row, Select, DatePicker, Button } from "antd";
import { optionsStatusAsignament,  } from "../../../utils/constant";
import WebApiJobBank from "../../../api/WebApiJobBank";
import moment from "moment";
import router from "next/router";
import { useEffect } from "react";

const ModalAsignament = ({
  title = '',
  close = () =>{},
  visible = false,
  textSave = '',
  actionForm = () =>{},
  assesments,
}) => {

  const [ formAsignament ] = Form.useForm()
  const [loading, setLoading ] = useState(false);
  
  const onCloseModal = () =>{
    close();
    formAsignament.resetFields();
  }

  const onFinish = (values) =>{
    setLoading(true)
    setTimeout(()=>{
        setLoading(false)
        actionForm(values)
        onCloseModal()
    },1000)
}

  return (
    <MyModal
      title={title}
      visible={visible}
      widthModal={600}
      close={onCloseModal}
      closable={!loading}

    >
      <Form
        form={formAsignament}
        layout='vertical'
        onFinish={onFinish}
      >
        <Row gutter={[24,0]}>
          <Col span={24}>
            <Form.Item
              name='vacant_assessment'
              label='Evaluación'
            >
              <Select>
                {
                  assesments?.length > 0 && assesments.map((as) => (
                    <Select.Option key={as.id} value={as.id}>
                      { as.name }
                    </Select.Option>
                  )) 
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name='user'
              label='Usuario'
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name='password'
              label='Contraseña'
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name='status'
              label='Estatus'
            >
              <Select
                allowClear
                showSearch
                notFoundContent='No se encontraron resultados'
                optionFilterProp='children'
              >
                {optionsStatusAsignament.length > 0 && optionsStatusAsignament.map(item => (
                    <Select.Option  value={item.value} key={item.key}>
                        {item.label}
                    </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name='assignment_timestamp'
              label='Fecha'
            >
              <DatePicker style={{ width: '100%' }}/>
            </Form.Item>
          </Col>
          {/* <Col span={24}>
            <Form.Item
              name='sent_timestamp'
              label='Fecha de envio'
            >
              <DatePicker style={{ width: '100%' }}/>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name='finished_timestamp'
              label='Fecha de finalización'
            >
              <DatePicker style={{ width: '100%' }}/>
            </Form.Item>
          </Col> */}
          <Col span={24}>
            <Form.Item
              name='additional_information'
              label='Información Adicional'
            >
              <Input.TextArea style={{ height: 100 }} />
            </Form.Item>
          </Col>
          <Col span={24} className='content-end' style={{gap: 8}}>
            <Button disabled={loading} onClick={()=> onCloseModal()}>Cancelar</Button>
            <Button htmlType='submit' loading={loading}>{textSave}</Button>
          </Col>
        </Row>
      </Form>
    </MyModal>
  )
}

export default ModalAsignament