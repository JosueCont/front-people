import React, { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import MyModal from '../../../common/MyModal';
import { Row, Col, Form, Select, Input, Button, DatePicker, Checkbox, Typography} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
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
    const [document, setDocument] = useState([])
    const status = Form.useWatch('status', formEducation);
    const { Text } = Typography
    const typeFileCV = ['pdf','png','jpg','jpeg','xlsx','docx','pptx','pub'];

    useEffect(()=>{
        if(Object.keys(itemToEdit).length <= 0) return;
        if(itemToEdit.end_date) itemToEdit.end_date = moment(itemToEdit.end_date);
        itemToEdit.file = itemToEdit.file.split('/').at(-1) || ''
        itemToEdit.study_level = itemToEdit.study_level?.id ?? null;
        formEducation.setFieldsValue(itemToEdit);
    },[itemToEdit])

    const onCloseModal = () =>{
        close()
        formEducation.resetFields();
    }

    const setValue = (key, val) => formEducation.setFieldsValue({[key]: val});
    const setEndDate = (val = null) => setValue('end_date', val);

    const onFinish = (values) =>{
        if(document.length > 0) values.file = document[0]
        if(values.end_date) values.end_date = values.end_date.format('YYYY-MM-DD');
        setLoading(true);
        setTimeout(()=>{
            setLoading(false)
            onCloseModal()
            actionForm(values)
        },2000)
    }

    const onChangeStatus = (value) =>{
        if(value == 1) setEndDate();
    }

    const disabledDate = (current) => {
        return current && current > moment().endOf("day");
    };

    return (
        <MyModal
            title={title}
            widthModal={800}
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
                                placeholder='Selecionar una opción'
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
                    <Col span={24}>
                        <Form.Item
                            name='specialitation_area'
                            label='Carrera / especialización'
                        >
                            <Input maxLength={500} placeholder='Escriba el nombre de la carrera o especialzación'/>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Text style={{ fontWeight: 'bold' }}>Adjuntar certificado de estudios</Text>
                    </Col>
                    <Col span={24} style={{ marginTop: 10 }}>
                        <FileUpload 
                            label='Archivo'
                            keyName='file'
                            tooltip={`Archivos permitidos: ${typeFileCV.join(', ')}.`}
                            isRequired={true}
                            // download={true}
                            // urlPreview={infoCandidate?.cv}
                            setFile={setDocument}
                            typeFile={typeFileCV}
                            setNameFile={e => formEducation.setFieldsValue({
                                file: e
                            })}
                        />
                    </Col>
                    <Col span={24}>            
                       <Form.Item
                           name='url_file'
                           label='URL'
                           rules={[ruleURL]}
                       >
                            <Input />
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