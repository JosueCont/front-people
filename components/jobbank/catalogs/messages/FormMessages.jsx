import React, { useEffect, useState } from 'react';
import { Row, Col, Input, Select, Form, Alert, message } from 'antd';
import { ruleRequired } from '../../../../utils/rules';
import dynamic from 'next/dynamic';
import TagsNotify from './TagsNotify';

import { ContentState, convertFromHTML, convertToRaw, EditorState, Modifier } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
const Editor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor),{ ssr: false })

const FormMessages = ({
    formMessage,
    setMsgHTML
}) => {

    const fields = Form.useWatch('fields_messages', formMessage);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    

    const onChangeEditor = (value) =>{
        let current = value.getCurrentContent();
        let msg = draftToHtml(convertToRaw(current));
        setMsgHTML(msg)
        setEditorState(value)
    }

    const copyTag = (tag) =>{
        try {
            let text = `<strong>{{${tag}}}</strong>`;
            let current = editorState.getCurrentContent();
            let selection = editorState.getSelection();
            let newContent = Modifier.replaceText(current, selection, text);
            let newEditor = EditorState.push(editorState, newContent, 'insert-fragment');
            let newState = EditorState.forceSelection(newEditor, newContent.getSelectionAfter());
            setEditorState(newState);
            message.success(`Campo copiado: ${tag}`)
        } catch (e) {
            console.log(e)       
        }
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
                <TagsNotify copyTag={copyTag}/>
            </Col>
            <Col span={24}>
                <Editor
                    editorState={editorState}
                    onEditorStateChange={onChangeEditor}
                    placeholder='Escriba el mensaje...'
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