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
import { convertToRaw, EditorState, Modifier } from "draft-js";
import dynamic from 'next/dynamic';
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
const Editor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor),{ ssr: false })

const ModalComments = ({
    title = '',
    close = () =>{},
    itemToEdit = {},
    visible = false,
    textSave = '',
    actionForm = () =>{},
    setMsgHTML,
    setEditorState,
    editorState

}) => {

    const [formComments] = Form.useForm();
    const [loading, setLoading ] = useState(false);

    const onChangeEditor = (value) =>{
        let current = value.getCurrentContent();
        let msg = draftToHtml(convertToRaw(current));
        setMsgHTML(msg)
        setEditorState(value)
    }

    const onCloseModal = () =>{
        close();
        formComments.resetFields();
    }

    const onFinish = (values) =>{
        setLoading(true)
        setTimeout(()=>{
            actionForm(values)
            onCloseModal()
            setLoading(false)
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
                form={formComments}
                layout='vertical'
                onFinish={onFinish}
            >
                <Row gutter={[24,0]}>
                    <Col span={24}>
                        <label>Comentario:</label>
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
                        <Button htmlType='submit' loading={loading} disabled={loading}>{textSave}</Button>
                    </Col>
                </Row>
            </Form>
        </MyModal>
    )
}

export default ModalComments