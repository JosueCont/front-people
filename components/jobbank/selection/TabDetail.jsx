import React, { useRef, useState, useEffect } from 'react';
import { Row, Col, Form, Input, Select, Button, Checkbox} from 'antd';
import {
    ruleRequired,
    ruleWhiteSpace,
    ruleURL,
    rfcFormat,
    ruleEmail,
    rulePhone
} from '../../../utils/rules';
import { optionsStatusSelection } from '../../../utils/constant';
import { convertToRaw, EditorState, Modifier } from "draft-js";
import dynamic from 'next/dynamic';
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
const Editor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor),{ ssr: false })

const TabDetail = ({ sizeCol = 12, editorState, setEditorState, setMsgHTML }) => {

    const onChangeEditor = (value) =>{
        let current = value.getCurrentContent();
        let msg = draftToHtml(convertToRaw(current));
        setMsgHTML(msg)
        setEditorState(value)
    }

  return(
    <Row gutter={[24,0]} className='tab-client'>
    <Col xs={24} xl={24} xxl={24}>
        <Row gutter={[24,0]}>
            <Col xs={24} md={12} xl={12} xxl={12}>
                <Form.Item
                    name='candidate'
                    label='Candidato'
                    rules={[ruleRequired, ruleWhiteSpace]}
                >
                    <Input maxLength={50} disabled={true}/>
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={12} xxl={12}>
                <Form.Item
                    name='vacant'
                    label='Vacante'
                    rules={[
                        ruleRequired,
                    ]}
                >
                    <Input maxLength={13} disabled/>
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={12} xxl={12}>
                <Form.Item 
                    name='email'
                    label='Correo electrónico'
                    rules={[ruleEmail]}
                >
                    <Input disabled/>
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={12} xxl={8}>
                <Form.Item
                    name='telephone'
                    label='Telefono'
                    rules={[rulePhone]}
                >
                  <Input maxLength={10} disabled/>
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={12} xxl={8}>
                <Form.Item label='Estatus' name='status_process' rules={[ruleRequired]}>
                    <Select
                        allowClear
                        showSearch
                        placeholder='Seleccionar un sector'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='children'
                    >
                        {optionsStatusSelection.length > 0 && optionsStatusSelection.map(item => (
                            <Select.Option value={item.value} key={item.key}>
                                {item.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col xs={24} md={24} xl={24} xxl={8}>
                <label style={{ marginBottom: 10 }}>Comentarios:</label>
                <Editor 
                    editorState={editorState}
                    onEditorStateChange={onChangeEditor}
                    placeholder='Escriba el mensaje...'
                    editorStyle={{
                        padding: '0px 12px', 
                        border: '1px solid', 
                        backgroundColor: '#FFFFFF',
                        boxSizing: 'border-box',
                        marginTop: 20,
                        borderRadius: 10,
                        height: 120,
                        maxHeight: 120
                    }} 
                    toolbarHidden = {true}
                />
            </Col>
        </Row>
    </Col>
    {/* <Col xs={24} xl={10} xxl={24}>
        <Row gutter={[24,0]}>
            <Col xs={24} lg={12} xl={24} xxl={12}>
                <Form.Item
                    name='description'
                    label='Descripción del cliente'
                    // rules={[ruleWhiteSpace]}
                >
                    <Input.TextArea
                        placeholder='Escriba una breve descripción'
                        autoSize={{
                            minRows: 3,
                            maxRows: 3
                        }}
                    />
                </Form.Item>
            </Col>
            <Col xs={24} lg={12} xl={24} xxl={12}>
                <Form.Item
                    name='comments'
                    label='Comentarios adicionales'
                    // rules={[ruleWhiteSpace]}
                    // style={{marginBottom: 0}}
                >
                    <Input.TextArea
                        autoSize={{
                            minRows: 3,
                            maxRows: 3
                        }}
                        placeholder='Escriba los comentarios'
                    />
                </Form.Item>
            </Col>
        </Row>
    </Col> */}
</Row>
  )
}


export default TabDetail