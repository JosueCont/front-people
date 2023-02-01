import React, { useState, useEffect } from "react";
import MyModal from "../../../common/MyModal";
import { ruleRequired } from "../../../utils/rules";
import { Col, Form, Input, Row, Select, DatePicker, Button } from "antd";
import { optionsStatusAsignament } from "../../../utils/constant";
import moment from "moment";
import { convertToRaw, EditorState, Modifier } from "draft-js";
import dynamic from 'next/dynamic';
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
const Editor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor),{ ssr: false })
const { Option } = Select

const ModalAsignament = ({
  title = '',
  close = () =>{},
  visible = false,
  textSave = '',
  actionForm = () =>{},
  assesments,
  itemToEdit,
  setMsgHTML,
  setEditorState,
  editorState,
}) => {

  const [ formAsignament ] = Form.useForm()
  const [loading, setLoading ] = useState(false);
  const disable = Object.keys(itemToEdit).length > 0
  const [status, setStatua] = useState(null)
  const [visiblePassword, setVisiblePassword] = useState(false)

  useEffect(() => {
    if(Object.keys(itemToEdit).length >0){
      let fieldsValues = {
        vacant_assessment: itemToEdit.vacant_assessment.id,
        user: itemToEdit.user,
        password: itemToEdit.password,
        status: itemToEdit.status,
        assignment_timestamp: moment(itemToEdit.assignment_timestamp),
      }
      if(itemToEdit.sent_timestamp){
        fieldsValues.sent_timestamp = moment(itemToEdit.sent_timestamp)
      }
      if(itemToEdit.finished_timestamp){
        fieldsValues.finished_timestamp = moment(itemToEdit.finished_timestamp)
      }
      setStatua(itemToEdit.status)
      formAsignament.setFieldsValue(fieldsValues)
      
    }
  },[itemToEdit])

  const onChangeEditor = (value) =>{
    let current = value.getCurrentContent();
    let msg = draftToHtml(convertToRaw(current));
    setMsgHTML(msg)
    setEditorState(value)
}
  
  const onCloseModal = () =>{
    close();
    formAsignament.resetFields();
    setMsgHTML("<p></p>")
    setEditorState('')
    setStatua(null)
  }

  const onFinish = (values) =>{
    setLoading(true)
    setTimeout(()=>{
        setLoading(false)
        actionForm(values)
        onCloseModal()
    },1000)
}

console.log('status', status)

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
              rules={ [ruleRequired] }
            >
              <Select disabled = { disable } placeholder="Selecciona una evaluación">
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
              rules={ [ruleRequired] }
            >
              <Input disabled= { disable } placeholder = 'Ingresa un usuario' />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name='password'
              label='Contraseña'
              rules={ [ruleRequired] }
            >
              <Input.Password 
                placeholder = 'Ingresa una contraseña'
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name='status'
              label='Estatus'
              rules={ [ruleRequired] }
            >
              <Select
                allowClear
                showSearch
                notFoundContent='No se encontraron resultados'
                optionFilterProp='children'
                placeholder="Selecciona un estatus"
              >
                {optionsStatusAsignament.length > 0 && optionsStatusAsignament.map(item => (
                    <Option disabled={ status !== null && status > item.value? true : false } value={item.value} key={item.key}>
                        {item.label}
                    </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name='assignment_timestamp'
              label='Fecha de asignación'
              rules={ [ruleRequired] }
            >
              <DatePicker style={{ width: '100%' }} placeholder="Selecciona una fecha de asignación"/>
            </Form.Item>
          </Col>

          {  itemToEdit && itemToEdit.assignment_timestamp &&        
          
            <Col span={24}>
              <Form.Item
                name='sent_timestamp'
                label='Fecha de envío'
                rules={ [ruleRequired] }
              >
                <DatePicker style={{ width: '100%' }} placeholder="Selecciona una fecha de envío"/>
              </Form.Item>
            </Col>
          }
          { 

            itemToEdit && 
            itemToEdit.assignment_timestamp &&
            itemToEdit.sent_timestamp &&

            <Col span={24}>
              <Form.Item
                name='finished_timestamp'
                label='Fecha de finalización'
                rules={ [ruleRequired] }
              >
                <DatePicker style={{ width: '100%' }} placeholder="Selecciona una fecha de finalización"/>
              </Form.Item>
            </Col>
          }
          <Col span={24}>
          <label>Información adicional:</label>
                            <Editor
                                editorState={editorState}
                                onEditorStateChange={onChangeEditor}
                                placeholder='Escriba el comentario...'
                                editorStyle={{
                                    border: '1px solid', 
                                    padding: '0px 12px',
                                    backgroundColor: '#FFFFFF',
                                    boxSizing: 'border-box',
                                    marginTop: 20,
                                    marginBottom: 20,
                                    borderRadius: 10,
                                    height: 200,
                                    overflowY:'auto'
                                }}
                                toolbarHidden = {true}
                            />
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