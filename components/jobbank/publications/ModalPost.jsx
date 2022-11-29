import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Input, Row, Col } from 'antd';
import MyModal from '../../../common/MyModal';
import { useSelector } from 'react-redux';
import { ToTopOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';

const ModalPost = ({
    visible = false,
    close = () =>{},
    title = '',
    actionForm = () =>{}
}) => {

    const currentUser = useSelector(state => state.userStore.user);
    const inputFile = useRef(null);
    const [formPost] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileImg, setFileImg] = useState([]);

    const setFileSelected = ({target : { files }}) =>{
        if(Object.keys(files).length <= 0) return false;
        setFileImg([files[0]]);
    }

    const createData = (obj) =>{
        let dataPost = new FormData();
        dataPost.append('person', currentUser.id);
        Object.entries(obj).map(([key, val])=>{ if(val) dataPost.append(key, val) });
        if(fileImg.length > 0) dataPost.append('image', fileImg[0]);
        return dataPost;
    }

    const closeModal = () =>{
        close()
        setFileImg([])
        formPost.resetFields()
    }

    const onFinish = (values) =>{
        const body = createData(values);
        setLoading(true)
        setTimeout(()=>{
            actionForm(body);
            setLoading(false)
            closeModal()
        },2000)
    }

    const openFile = () =>{
        inputFile.current.value = null;
        inputFile.current.click();
    }

    return (
        <MyModal
            visible={visible}
            title={title}
            close={closeModal}
            closable={!loading}
            widthModal={700}
        >
            <Form form={formPost} layout='vertical' onFinish={onFinish}>
                <Row>
                    <Col span={24}>
                        <Form.Item name='start_message' label='Mensaje inicial'>
                            <Input.TextArea autoSize={{minRows: 4, maxRows: 4}} placeholder='Escriba el mensaje'/>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name='end_message' label='Mensaje final'>
                            <Input.TextArea autoSize={{minRows: 4, maxRows: 4}} placeholder='Escriba el mensaje'/>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='Imagen'>
                            <Input.Group compact>
                                <Input
                                    style={{
                                        width: 'calc(100% - 64px)',
                                        borderTopLeftRadius: 10,
                                        borderBottomLeftRadius: 10
                                    }}
                                    value={fileImg[0]?.name}
                                    placeholder='Archivo seleccionado'
                                />
                                <Button
                                    className='custom-btn'
                                    onClick={()=> setFileImg([])}
                                    icon={<DeleteOutlined />}
                                />
                                <Button
                                    icon={<ToTopOutlined />}
                                    onClick={()=> openFile()}
                                    style={{
                                        borderTopRightRadius: 10,
                                        borderBottomRightRadius: 10
                                    }}
                                />
                                <input
                                    type='file'
                                    style={{display: 'none'}}
                                    ref={inputFile}
                                    onChange={setFileSelected}
                                />
                            </Input.Group>
                        </Form.Item>
                    </Col>
                    <Col span={24} className='content-end' style={{gap: 8}}>
                        <Button disabled={loading} onClick={()=> closeModal()} >Cancelar</Button>
                        <Button loading={loading} htmlType='submit'>Publicar</Button>
                    </Col>
                </Row>
            </Form>
        </MyModal>
    )
}

export default ModalPost