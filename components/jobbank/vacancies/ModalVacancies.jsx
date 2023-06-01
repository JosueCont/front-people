import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Row, Col, Form, Select, Input, Button, DatePicker, Switch } from 'antd';
import MyModal from '../../../common/MyModal';
import {
    ruleWhiteSpace,
    ruleEmail,
    rulePhone,
    ruleRequired,
    ruleURL
} from '../../../utils/rules';
import {
    EllipsisOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    EyeOutlined
  } from '@ant-design/icons';
import { convertToRaw, EditorState, Modifier } from "draft-js";
import dynamic from 'next/dynamic';
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
const Editor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor),{ ssr: false })
import { validateNum, validateMaxLength } from '../../../utils/functions';

const ModalVacancies = ({
    title = '',
    close = () =>{},
    itemToEdit = {},
    visible = false,
    textSave = '',
    actionForm = () =>{},
    setMsgHTML,
    setEditorState,
    editorState,
    evaluationsGroup

}) => {

    const [formEvaluations] = Form.useForm();
    const [loading, setLoading ] = useState(false);
    const [optionKey, setOptionKey ] = useState(0)

    useEffect(()=>{
        if(Object.keys(itemToEdit).length <= 0) return;
        if(itemToEdit.group_assessment.length > 0){
            itemToEdit.group_assessment = itemToEdit.group_assessment.map((gas) => gas.id)
        }
        setOptionKey(itemToEdit.source)
        formEvaluations.setFieldsValue(itemToEdit);
    },[itemToEdit])

    const onChangeEditor = (value) =>{
        let current = value.getCurrentContent();
        let msg = draftToHtml(convertToRaw(current));
        setMsgHTML(msg)
        setEditorState(value)
    }

    const onCloseModal = () =>{
        close();
        setOptionKey(0)
        formEvaluations.resetFields();
    }

    const setValue = (key, val) => formEvaluations.setFieldsValue({[key]: val});
    const setUrl = (val = '') => setValue('url', val)
    const setEvaluationsGroup = (val = []) => setValue('group_assessment', val)

    const onchangeSource = (val) => {
        if(val === 1) setUrl()
        if(val === 2) setEvaluationsGroup()
        return
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
            widthModal={800}
            close={onCloseModal}
            closable={!loading}
        >
            <Form
                form={formEvaluations}
                layout='vertical'
                onFinish={onFinish}
                initialValues ={{
                    is_active: true
                }}
            >
                <Row gutter={[24,0]}>
                    <Col span={12}>
                        <Form.Item
                            name='name'
                            label='Nombre de la evaluación'
                            rules={[ruleRequired, ruleWhiteSpace]}
                        >
                            <Input
                                maxLength={50}
                                placeholder='Nombre de la evaluación'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='source'
                            label='Tipo'
                            rules={[ruleRequired]}
                        >
                          <Select 
                            placeholder='Selecciona una opción' 
                            onChange={(e) => { 
                                setOptionKey(e)
                                onchangeSource(e)
                            }}
                          >
                            <Select.Option key={1} value={1}>
                              KHOR+
                            </Select.Option>
                            <Select.Option key={2} value={2}>
                              Cliente
                            </Select.Option>
                          </Select>
                        </Form.Item>
                    </Col>

                    {
                        optionKey !== 0 && optionKey === 1 ? (
                            <Col span={12}>
                            <Form.Item
                                name='group_assessment'
                                label='Grupo de evaluaciones'
                                rules={[ruleRequired]}
                            >
                                <Select placeholder='Selecciona una evaluación' mode='multiple' showArrow={true}>
                                    {
                                        evaluationsGroup.length > 0 && evaluationsGroup.map((eva) => (
                                            <Select.Option key={eva.id} value={eva.id}>
                                                    { eva.name }
                                            </Select.Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        ) : (
                            <Col span={12}>
                            <Form.Item
                                name='url'
                                label='URL'
                                rules={[ ruleURL]}
                            >
                                <Input
                                    placeholder='Url del sitio'
                                />
                            </Form.Item>
                        </Col>
                        )
                    }

                    <Col span={12}>
                        <Form.Item
                            name='is_active'
                            label='¿Activo?'
                            rules={[ruleRequired]}
                            valuePropName="checked"
                        >
                            <Switch 
                                checkedChildren="Activo" 
                                unCheckedChildren="Inactivo"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <label>Instrucciones</label>
                            <Editor
                                editorState={editorState}
                                onEditorStateChange={onChangeEditor}
                                placeholder='Escriba el mensaje...'
                                editorStyle={{
                                    padding: '0px 12px', 
                                    border: '1px solid', 
                                    backgroundColor: '#FFFFFF',
                                    boxSizing: 'border-box',
                                    marginBottom: 20,
                                    borderRadius: 10,
                                    height: 95
                                }}
                                wrapperStyle={{background: '#f0f0f0'}}
                                toolbarStyle={{
                                    background: '#f0f0f0',
                                    borderBottom: '1px solid rgba(0,0,0,0.06)'
                                }}
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

export default ModalVacancies