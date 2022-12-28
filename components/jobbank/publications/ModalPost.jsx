import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Input, Row, Col, Select } from 'antd';
import MyModal from '../../../common/MyModal';
import { useSelector } from 'react-redux';
import {
    ToTopOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import { getFileExtension } from '../../../utils/functions';
import { ruleRequired } from '../../../utils/rules';

const ModalPost = ({
    visible = false,
    close = () =>{},
    title = '',
    actionForm = () =>{},
    itemToPublish = {}
}) => {

    const {
        list_connections_options,
        load_connections_options
    } = useSelector(state => state.jobBankStore);
    const currentUser = useSelector(state => state.userStore.user);
    const rule_img = {msg: '', status: ''};
    const inputFile = useRef(null);
    const [formPost] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileImg, setFileImg] = useState([]);
    const [ruleImg, setRuleImg] = useState(rule_img);
    const typeFile = ['png','jpg','jpeg'];

    useEffect(()=>{
        if(Object.keys(itemToPublish).length <= 0) return;
        let accounts_to_share = itemToPublish.account_to_share?.length > 0
            ? itemToPublish.account_to_share
            : [];
        formPost.setFieldsValue({accounts_to_share})
    },[itemToPublish])

    const setFileSelected = ({target : { files }}) =>{
        if(Object.keys(files).length <= 0){
            let msg = 'No se pudo cargar el archivo, intente de nuevo';
            setRuleImg({msg, status: 'error'});
            return;
        }
        let extension = getFileExtension(files[0].name);
        if(!typeFile.includes(extension.toLowerCase())){
            let msg = 'El archivo seleccionado no es válido';
            setRuleImg({msg, status: 'error'});
            return;
        }
        setFileImg([files[0]]);
    }

    const createData = (obj) =>{
        let dataPost = new FormData();
        dataPost.append('person', currentUser.id);
        Object.entries(obj).map(([key, val])=>{
            const account = item => dataPost.append('accounts_to_share', item);
            if(val && Array.isArray(val)) val.map(account);
            else if(val) dataPost.append(key, val);
        });
        if(fileImg.length > 0) dataPost.append('image', fileImg[0]);
        return dataPost;
    }

    const closeModal = () =>{
        close()
        setRuleImg(rule_img)
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
        setRuleImg(rule_img);
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
                        <Form.Item
                            name='accounts_to_share'
                            label='Cuentas conectadas'
                            rules={[ruleRequired]}
                        >
                            <Select
                                mode='multiple'
                                maxTagCount='responsive'
                                disabled={load_connections_options}
                                loading={load_connections_options}
                                placeholder='Seleccionar las cuentas'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
                            >
                                {list_connections_options.length > 0 && list_connections_options.map(item=> (
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name='start_message' label='Mensaje inicial'>
                            <Input.TextArea
                                showCount
                                maxLength={2000}
                                autoSize={{minRows: 2, maxRows: 2}}
                                placeholder='Escriba el mensaje'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name='end_message' label='Mensaje final'>
                            <Input.TextArea
                                showCount
                                maxLength={2000}
                                autoSize={{minRows: 2, maxRows: 2}}
                                placeholder='Escriba el mensaje'
                            />
                        </Form.Item>
                    </Col>
                    {/* <Col span={24}>
                        <Form.Item name='hashtags' label='Hashtags'>
                            <Input placeholder='Escriba las palabras clave'/>
                        </Form.Item>
                    </Col> */}
                    <Col span={24}>
                        <Form.Item
                            label='Imagen'
                            help={ruleImg?.msg}
                            validateStatus={ruleImg?.status}
                        >
                            <Input.Group compact>
                                <Input
                                    style={{
                                        width: 'calc(100% - 64px)',
                                        borderTopLeftRadius: 10,
                                        borderBottomLeftRadius: 10
                                    }}
                                    value={fileImg[0]?.name}
                                    placeholder='Ningún archivo seleccionado'
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
                                    accept='.png, .jpg, .jpeg'
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