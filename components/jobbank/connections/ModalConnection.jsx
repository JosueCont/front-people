import React, {  useState, useEffect, useMemo } from 'react';
import { Row, Col, Form, Checkbox, Input, Select, Button } from 'antd';
import MyModal from '../../../common/MyModal';
import { ruleRequired } from '../../../utils/rules';
import { useSelector } from 'react-redux';
import FileUpload from '../FileUpload';

const ModalConnection = ({
    actionForm = ()=>{},
    visible = false, 
    close = ()=>{},
    title = ''
}) => {

    const {
        list_connections_options,
        load_connections_options
    } = useSelector(state => state.jobBankStore);
    const noValid = [undefined, null, '', ' '];
    const [formConnection] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileImg, setFileImg] = useState([]);
    const code = Form.useWatch('code', formConnection);
    const options = [
        {label: 'Facebook', value: 'FB', key: 'FB'},
        {label: 'Instagram', value: 'IG', key: 'IG'},
        {label: 'Linkedin', value: 'LK', key: 'LK', disabled: true}
    ]

    const onClose = () =>{
        close()
        formConnection.resetFields();
    }

    const createData = (values) =>{
        let dataRed = new FormData();
        if(fileImg.length > 0) dataRed.append('default_image', fileImg[0]);
        Object.entries(values).map(([key, val]) =>{
            if(noValid.includes(val)) return;
            dataRed.append(key, val);
        })
        return dataRed;
    }

    const onFinish = (values) =>{
        setLoading(true)
        if(values.code == 'LK') values.is_active = false; 
        let body = createData(values);
        setTimeout(()=>{
            setLoading(false)
            actionForm(body)
            onClose()
        },2000)
    }

    const optionsReds = useMemo(()=>{
        let codes = list_connections_options.map(item => item.code);
        return options.filter(record => !codes.includes(record.value));
    },[list_connections_options])

    const onChangeName = (value) =>{
        if(!value){
            formConnection.setFieldsValue({
                name: null
            })
            return;
        }
        const find_ = item => item.value == value;
        let result = optionsReds.find(find_);
        if(!result){
            formConnection.setFieldsValue({
                name: null
            })
            return;
        }
        formConnection.setFieldsValue({
            name: result.label
        })
    }

    return (
        <MyModal
            title={title}
            closable={!loading}
            visible={visible}
            close={onClose}
        >
            <Form
                form={formConnection}
                layout='vertical'
                onFinish={onFinish}
                initialValues={{
                    is_valid: true,
                    is_active: true
                }}
            >
                <Row gutter={[24,0]}>
                    <Col span={24} style={{display: 'none'}}>
                        <Form.Item
                            name='is_valid'
                            label='¿Es válido?'
                            valuePropName='checked'
                        >
                            <Checkbox/>
                        </Form.Item>
                    </Col>
                    <Col span={24} style={{display: 'none'}}>
                        <Form.Item
                            name='is_active'
                            label='¿Activar?'
                            valuePropName='checked'
                        >
                            <Checkbox/>
                        </Form.Item>
                    </Col>
                    <Col span={24} style={{display: 'none'}}>
                        <Form.Item
                            name='name'
                            label='Nombre'
                        >
                            <Input placeholder='Nombre'/>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name='code'
                            label='Conexión'
                            rules={[ruleRequired]}
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='label'
                                onChange={onChangeName}
                                options={optionsReds}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <FileUpload
                            label='Imagen predeterminada'
                            tooltip={`Esta imagen será utilizada en caso de que
                            no se haya seleccionado ninguna antes de realizar la publicación.`}
                            isRequired={code == 'IG'}
                            dependencies={['code']}
                            setFile={setFileImg}
                            typeFile={['png','jpg','jpeg']}
                            setNameFile={e=> formConnection.setFieldsValue({
                                name_file: e
                            })}
                        />
                    </Col>
                    <Col span={24} className='content-end' style={{gap: 8}}>
                        <Button disabled={loading} onClick={()=> onClose()}>Cancelar</Button>
                        <Button htmlType='submit' loading={loading}>Guardar</Button>
                    </Col>
                </Row>
            </Form>
        </MyModal>
    )
}

export default ModalConnection