import React, { useEffect, useState } from 'react';
import { Row, Col, Input, Select, Form, Alert, message } from 'antd';
import { ruleRequired } from '../../../../utils/rules';
import dynamic from 'next/dynamic';
import TagsNotify from './TagsNotify';
import {
    optionsStatusSelection,
    optionsTypeNotify,
    optionsSourceJB
} from '../../../../utils/constant';
import { useSelector } from 'react-redux';
//
import { convertToRaw, EditorState, Modifier } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
const Editor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor),{ ssr: false })

const FormMessages = ({
    formMessage,
    setMsgHTML,
    setEditorState,
    editorState
}) => {
    
    const {
        list_connections_options,
        load_connections_options
    } = useSelector(state => state.jobBankStore);

    const onChangeEditor = (value) =>{
        let current = value.getCurrentContent();
        let msg = draftToHtml(convertToRaw(current));
        setMsgHTML(msg)
        setEditorState(value)
    }

    const copyTag = (tag) =>{
        try {
            let current = editorState.getCurrentContent();
            let selection = editorState.getSelection();
            let newContent = Modifier.replaceText(current, selection, `{{${tag}}}`);
            let newEditor = EditorState.push(editorState, newContent, 'insert-characters');
            let newState = EditorState.forceSelection(newEditor, newContent.getSelectionAfter());
            setEditorState(newState);
            message.success(`Campo copiado: ${tag}`)
        } catch (e) {
            console.log(e)
            message.error(`Campo no copiado: ${tag}`)       
        }
    }

    return (
        <Row gutter={[24,0]}>
            <Col xs={24} md={12} xl={8} xxl={5}>
                <Form.Item
                    name='subject'
                    label='Asunto'
                    rules={[ruleRequired]}
                    // style={{marginBottom: 0}}
                >
                   <Input maxLength={50} placeholder='Asunto'/>
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={5}>
                <Form.Item
                    name='notification_source'
                    label='Enviar notificación por'
                    rules={[ruleRequired]}
                    // style={{marginBottom: 0}}
                >
                   <Select
                        mode='multiple'
                        maxTagCount={1}
                        disabled={load_connections_options}
                        loading={load_connections_options}
                        placeholder='Seleccionar las opciones'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='children'
                    >
                        <Select.Option value='EM' key='EM'>Correo electrónico</Select.Option>
                        {list_connections_options.length > 0 &&
                            list_connections_options.map(item=> (
                            <Select.Option value={item.code} key={item.code}>
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={5}>
                <Form.Item
                    name='status_process'
                    label='Enviar notificación en'
                    rules={[ruleRequired]}
                    // style={{marginBottom: 0}}
                >
                    <Select
                        allowClear
                        showSearch
                        placeholder='Seleccionar una opción'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='label'
                        options={optionsStatusSelection.filter(item => !item.value == 0)}
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={5}>
                <Form.Item
                    name='type'
                    label='Tipo de notificación'
                    // style={{marginBottom: 0}}
                >
                    <Select
                        allowClear
                        showSearch
                        placeholder='Seleccionar una opción'
                        notFoundContent='No se encontraron'
                        optionFilterProp='label'
                        options={optionsTypeNotify}
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={4}>
                <Form.Item
                    name='draft'
                    label='Borrador'
                    // style={{marginBottom: 0}}
                >
                    <Select
                        placeholder='Seleccionar una opción'
                        notFoundContent='No se encontraron'
                        optionFilterProp='label'
                        options={[
                            {value: true, key: true, label: "Sí"},
                            {value: false, key: false, label: "No"}
                        ]}
                    />
                </Form.Item>
            </Col>
            <Col span={24}>
                <div style={{width: '100%', color: 'rgba(0,0,0,0.5)'}}>
                    De la siguiente lista copiar (click sobre el nombre) los campos
                    que se desean visualizar en el mensaje, según la posición u
                    orden que se requiera.
                </div>
                <TagsNotify copyTag={copyTag}/>
            </Col>
            <Col span={24} style={{marginTop: '24px'}}>
                <Editor
                    editorState={editorState}
                    onEditorStateChange={onChangeEditor}
                    placeholder='Escriba el mensaje...'
                    toolbar={{options: ['inline','textAlign']}}
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

export default FormMessages;