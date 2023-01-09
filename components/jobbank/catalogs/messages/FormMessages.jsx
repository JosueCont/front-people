import React, { useEffect, useState } from 'react';
import { Row, Col, Input, Select, Form, Alert } from 'antd';
import { ruleRequired } from '../../../../utils/rules';
import dynamic from 'next/dynamic';
import TagsNotify from './TagsNotify';

import { ContentState, convertFromHTML, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
const Editor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor),{ ssr: false })

const FormMessages = ({
    formMessage
}) => {

    const fields = Form.useWatch('fields_messages', formMessage);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const onChangeEditor = (value) =>{
        let current = value.getCurrentContent();
        let msg = draftToHtml(convertToRaw(current));
        console.log('el msg----->', msg)
        setEditorState(value)
    }

    return (
        <Row gutter={[24,24]}>
           {/* <Col span={12}>
                <Form.Item
                    name='name'
                    label='Nombre'
                    rules={[ruleRequired]}
                    style={{marginBottom: 0}}
                >
                   <Input maxLength={50} placeholder='Escriba el nombre'/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    name='fields_messages'
                    label='Campos del candidato'
                    rules={[ruleRequired]}
                    style={{marginBottom: 0}}
                >
                    <Select
                        allowClear
                        mode='multiple'
                        placeholder='Seleccionar una opción'
                        notFoundContent='No se encontraron'
                        optionFilterProp='children'
                    ></Select>
                </Form.Item>
            </Col> */}
            <Col span={24}>
                <Alert type='info' message={`
                    De la siguiente lista copiar (click sobre el nombre) los campos
                    que se desean visualizar en el mensaje, según la posicón u
                    orden que se requiera.
                `}/>
            </Col>
            <Col span={24}>
                <TagsNotify/>
            </Col>
            <Col span={24}>
                <Editor
                    editorState={editorState}
                    onEditorStateChange={onChangeEditor}
                    editorStyle={{padding: '0px 12px'}}
                    wrapperStyle={{background: '#f0f0f0'}}
                    toolbarStyle={{
                        background: '#f0f0f0',
                        borderBottom: '1px solid rgba(0,0,0,0.06)'
                    }}
                />
            </Col>
        </Row>
    )
}

export default FormMessages