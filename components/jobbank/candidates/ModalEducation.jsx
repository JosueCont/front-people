import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import MyModal from '../../../common/MyModal';
import { Row, Col, Form, Select, Input, Button, DatePicker } from 'antd';
import { optionsStatusAcademic } from '../../../utils/constant';
import { ruleRequired, ruleWhiteSpace, ruleURL } from '../../../utils/rules';
import FileUpload from '../FileUpload';

const ModalEducation = ({
    title = '',
    close = () =>{},
    visible,
    actionForm = () =>{},
    itemToEdit = {},
    textSave = ''
}) => {
    
    const {
        list_scholarship,
        load_scholarship
    } = useSelector(state => state.jobBankStore);
    const [formEducation] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [certificate, setCertificate] = useState([])
    const status = Form.useWatch('status', formEducation);
    const noValid = [undefined, null, "", " "];
    const typeFile = ['pdf','png','jpg','jpeg','xlsx','docx','pptx','pub'];

    useEffect(()=>{
        if(Object.keys(itemToEdit).length <= 0) return;
        let values = {...itemToEdit};
        values.end_date = itemToEdit.end_date ? moment(itemToEdit.end_date) : null;
        values.certificate = itemToEdit.file ? itemToEdit.file.split('/').at(-1) : null;
        values.study_level = itemToEdit.study_level?.id ?? null;
        formEducation.setFieldsValue(values);
    },[itemToEdit])

    const onCloseModal = () =>{
        close()
        setCertificate([])
        formEducation.resetFields();
    }

    const createData = (values) =>{
        let educationData = new FormData();
        if(certificate.length > 0) educationData.append('file', certificate[0]);
        Object.entries(values).map(([key, val]) =>{
            let value = noValid.includes(val) ? "" : val;
            educationData.append(key, value);
        })
        return educationData;
    }

    const onFinish = (values) =>{
        if(values.end_date) values.end_date = values.end_date.format('YYYY-MM-DD');
        let body = createData(values);
        setLoading(true);
        setTimeout(()=>{
            setLoading(false)
            onCloseModal()
            actionForm(body)
        },2000)
    }

    const onChangeStatus = (value) =>{
        if(value == 1) formEducation.setFieldsValue({end_date: null});
    }

    const disabledDate = (current) => {
        return current && current > moment().endOf("day");
    };

    return (
        <MyModal
            title={title}
            widthModal={700}
            close={onCloseModal}
            visible={visible}
            closable={!loading}
        >
            <Form
                form={formEducation}
                onFinish={onFinish}
                layout='vertical'
            >
                <Row gutter={[24,0]}>
                    <Col span={12}>
                        <Form.Item
                            name='study_level'
                            label='Escolaridad'
                            rules={[ruleRequired]}
                        >
                            <Select
                                allowClear
                                showSearch
                                disabled={load_scholarship}
                                loading={load_scholarship}
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
                            >
                                {list_scholarship.length > 0 && list_scholarship.map(item => (
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='status'
                            label='Estatus'
                            rules={[ruleRequired]}
                        >
                            <Select
                                allowClear
                                placeholder='Seleccionar una opción'
                                options={optionsStatusAcademic}
                                onChange={onChangeStatus}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='end_date'
                            label='Fecha de finalización'
                            dependencies={['status']}
                            rules={[status == 3 ? ruleRequired : {validator: (_, value) => Promise.resolve()}]}
                        >
                            <DatePicker
                                style={{width: '100%'}}
                                disabled={![2,3].includes(status)}
                                disabledDate={disabledDate}
                                placeholder='Seleccionar una fecha'
                                format='DD-MM-YYYY'
                                inputReadOnly
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='institution_name'
                            label='Nombre de la institución'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input maxLength={200} placeholder='Escriba el nombre de la institución'/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='specialitation_area'
                            label='Carrera / especialización'
                        >
                            <Input maxLength={500} placeholder='Escriba el nombre de la carrera o especialzación'/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <FileUpload 
                            label='Certificado de estudios'
                            keyName='certificate'
                            tooltip={`Archivos permitidos: ${typeFile.join(', ')}.`}
                            isRequired={false}
                            download={true}
                            urlPreview={itemToEdit?.file}
                            setFile={setCertificate}
                            typeFile={typeFile}
                            setNameFile={e => formEducation.setFieldsValue({
                                certificate: e
                            })}
                        />
                    </Col>
                    <Col span={24}>            
                       <Form.Item
                           name='url_file'
                           label='URL del certificado'
                           rules={[ruleURL]}
                       >
                            <Input placeholder='URL del certificado'/>
                       </Form.Item>
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

export default ModalEducation