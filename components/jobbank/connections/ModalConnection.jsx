import React, {  useState, useEffect, useMemo } from 'react';
import { Row, Col, Form, Checkbox, Input, Select, Button } from 'antd';
import MyModal from '../../../common/MyModal';
import { ruleRequired } from '../../../utils/rules';
import { useSelector } from 'react-redux';
import FileUpload from '../FileUpload';
import { optionsTypeConnection, optionsConnectionsJB } from '../../../utils/constant';

const ModalConnection = ({
    actionForm = ()=>{},
    visible = false, 
    close = ()=>{},
    title = ''
}) => {

    const {
        list_connections,
        load_connections
    } = useSelector(state => state.jobBankStore);
    const noValid = [undefined, null, '', ' '];
    const [formConnection] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileImg, setFileImg] = useState([]);
    const code = Form.useWatch('code', formConnection);

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
        values.is_active = !(values.code == 'LK');
        let body = createData(values);
        setTimeout(()=>{
            setLoading(false)
            actionForm(body)
            onClose()
        },2000)
    }

    const optionsReds = useMemo(()=>{
        let validate = !list_connections.results || list_connections.results?.length <=0;
        if(validate) return optionsConnectionsJB;
        let codes = list_connections?.results?.map(item => item.code);
        return optionsConnectionsJB.filter(record => !codes.includes(record.value));
    },[list_connections])

    const onChangeName = (value) =>{
        let obj = {name: null, conection_type: null};
        if(!value){
            formConnection.setFieldsValue(obj);
            return;
        };
        if(['WP','GC'].includes(value)){
            formConnection.setFieldsValue({
                name_file: null
            });
            setFileImg([])
        }
        const find_ = item => item.value == value;
        let result = optionsConnectionsJB.find(find_);
        if(!result){
            formConnection.setFieldsValue(obj);
            return;
        };
        obj['name'] = result.label;
        obj['conection_type'] = result.type;
        formConnection.setFieldsValue(obj);
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
                    is_active: true,
                    name: null,
                    conection_type: null
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
                        <Form.Item
                            name='conection_type'
                            label='Tipo de conexión'
                            rules={[ruleRequired]}
                        >
                            <Select
                                allowClear
                                showSearch
                                disabled
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='label'
                                options={optionsTypeConnection}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <FileUpload
                            label='Imagen predeterminada'
                            tooltip={`Esta imagen será utilizada en caso de que
                            no se haya seleccionado ninguna antes de realizar la publicación.`}
                            isRequired={code == 'IG'}
                            disabled={['WP','GC'].includes(code)}
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