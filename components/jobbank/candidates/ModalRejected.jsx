import React, { useEffect, useState, useMemo } from 'react';
import { Row, Col, Form, Select, Input, Button, DatePicker } from 'antd';
import { ruleRequired, ruleWhiteSpace } from '../../../utils/rules';
import { useSelector } from 'react-redux';
import MyModal from '../../../common/MyModal';
import FileUpload from '../FileUpload';
import { convertToRaw } from "draft-js";
import dynamic from 'next/dynamic';
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
const Editor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor),{ ssr: false })

const ModalRejected = ({
    title = '',
    close = () =>{},
    itemToEdit = {},
    visible = false,
    textSave = 'Guardar',
    actionForm = () =>{},
    setMsgHTML,
    setEditorState,
    editorState,
}) => {

    const [formReference] = Form.useForm();
    const [loading, setLoading] = useState();
    const [file, setFile] = useState([]);
    const typeFile = ['pdf'];

    useEffect(()=>{
        if(Object.keys(itemToEdit).length <= 0) return;
        let values = {...itemToEdit};
        values.file_read = itemToEdit.file ? itemToEdit.file?.split('/')?.at(-1) : null;
        formReference.setFieldsValue(values)
    },[itemToEdit])

    const onChangeEditor = (value) =>{
      let current = value.getCurrentContent();
      let msg = draftToHtml(convertToRaw(current));
      setMsgHTML(msg)
      setEditorState(value)
  }

    const createData = (values) =>{
        let reference = new FormData();
        reference.append('file_name', values.file_name)
        if(file.length > 0) reference.append('file', file[0]);
        return reference;
    }

    const onCloseModal = () =>{
        close();
        setFile([])
        formReference.resetFields();
    }

    const onFinish = (values) =>{
        let body = createData(values);
        setLoading(true)
        setTimeout(()=>{
            setLoading(false)
            actionForm(body)
            onCloseModal()
        },2000)
    }

    return (
        <MyModal
            title={title}
            visible={visible}
            widthModal={400}
            close={onCloseModal}
            closable={!loading}
        >
            <Form
                form={formReference}
                layout='vertical'
                onFinish={onFinish}
            >
                <Row gutter={[24,0]}>
                    <Col span={24}>
                        <Form.Item
                            name='file_name'
                            label='Nombre'
                            rules={[ruleRequired, ruleWhiteSpace]}
                        >
                            <Input maxLength={200} placeholder='Nombre'/>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <FileUpload
                            label='Archivo'
                            keyName='file_read'
                            tooltip={`Archivos permitidos: ${typeFile.join(', ')}`}
                            isRequired={true}
                            revertColor={true}
                            setFile={setFile}
                            typeFile={typeFile}
                            disabled={Object.keys(itemToEdit).length > 0}
                            setNameFile={e => formReference.setFieldsValue({
                                file_read: e
                            })}
                        />
                    </Col>
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
                    <Col span={24} style={{display: 'flex', justifyContent: 'flex-end', gap: 8}}>
                        <Button disabled={loading} onClick={()=> onCloseModal()}>Cancelar</Button>
                        <Button htmlType='submit' loading={loading}>
                            {textSave}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </MyModal>
    )
}

export default ModalRejected