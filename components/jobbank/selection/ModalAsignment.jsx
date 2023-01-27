import React, { useState } from "react";
import MyModal from "../../../common/MyModal";
import { Col, Form, Input, Row, Select, DatePicker, Button } from "antd";
import { optionsStatusSelection } from "../../../utils/constant";
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
}) => {

  const [ formAsignament ] = Form.useForm()
  const [loading, setLoading ] = useState(false);
  
  const onCloseModal = () =>{
    close();
    formAsignament.resetFields();
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
        // onFinish={onFinish}
      >
        <Row gutter={[24,0]}>
          <Col span={24}>
            <Form.Item
              name='name'
              label='Evaluación'
            >
              <Select />
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
              name='status_process'
              label='Estatus'
            >
              <Select
                allowClear
                showSearch
                notFoundContent='No se encontraron resultados'
                optionFilterProp='children'
              >
                {optionsStatusSelection.length > 0 && optionsStatusSelection.map(item => (
                    <Select.Option  value={item.value} key={item.key}>
                        {item.label}
                    </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name='date'
              label='Fecha'
            >
              <DatePicker style={{ width: '100%' }}/>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name='aditionalcomment'
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