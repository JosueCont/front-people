import React, { useEffect, useState } from 'react';
import {
    Button,
    Spin,
    Space,
    Upload,
    message,
    Form,
    Row,
    Col,
    Input,
    DatePicker,
    Select
} from 'antd';
import { ProfileCard, ProfileHeader, ProfileContent } from './ProfileFormStyled';
import {
    ArrowLeftOutlined,
    PlusOutlined, LoadingOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import WebApiPeople from '../../../api/WebApiPeople';
import SelectPersonType from '../../selects/SelectPersonType';
import locale from 'antd/lib/date-picker/locale/es_ES';
import { civilStatus, genders } from '../../../utils/constant';
import moment from 'moment';
import { curpFormat, nameLastname, rfcFormat, ruleRequired } from '../../../utils/rules';

const ProfileForm = () => {

    const router = useRouter();
    const getUser = state => state.userStore.user;
    const currentUser = useSelector(getUser);
    const [formUser] = Form.useForm();
    const [loadImge, setLoadImage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [infoUser, setInfoUser] = useState({});
    const [imgUser, setImgUser] = useState(null);

    useEffect(()=>{
        if(currentUser) getInfoUser(currentUser.id);
    },[currentUser])

    useEffect(()=>{
        formUser.resetFields();
        if(Object.keys(infoUser).length <=0) return;
        let values = {...infoUser};
        values.code = infoUser?.code;
        values.person_type = infoUser?.person_type;
        values.first_name = infoUser?.first_name;
        values.flast_name = infoUser?.flast_name;
        values.mlast_name = infoUser?.mlast_name;
        values.email = infoUser?.email;
        values.civil_status = infoUser?.civil_status;
        values.gender = infoUser?.gender;
        values.curp = infoUser?.curp;
        values.rfc = infoUser?.rfc;
        values.register_date = infoUser.timestamp ? moment(infoUser.timestamp) : null;
        values.birth_date = infoUser?.birth_date ? moment(infoUser?.birth_date, 'YYYY-MM-DD') : null;
        formUser.setFieldsValue(values)
    },[infoUser])

    const getInfoUser = async (id) =>{
        try {
            setLoading(true)
            let response = await WebApiPeople.getPerson(id)
            setInfoUser(response.data)
            setImgUser(response.data?.photo)
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false )
        }
    }

    const updateImgUser = async (photo) =>{
        try {
            let body = new FormData();
            body.append("id", currentUser.id)
            body.append("photo", photo)
            setLoadImage(true)
            let response = await WebApiPeople.updatePhotoPerson(body);
            setImgUser(response.data?.photo);
            setLoadImage(false)
            message.success('Foto actualizada')
        } catch (e) {
            console.log(e)
            setLoadImage(false)
            message.error('Foto no actualizada')
        }
    }

    const updateInfoUser = async (values) =>{
        try {
            setLoading(true)
            let response = await WebApiPeople.updatePerson(values, currentUser.id);
            setInfoUser(response.data)
            message.success('Información actualizada')
            setLoading(false)            
        } catch (e) {
            console.log(e)
            setLoading(false)
            message.error('Información no actualizada')
        }
    }

    const onFinish = (values) =>{
        values.birth_date = values.birth_date ? values.birth_date?.format('YYYY-MM-DD') : null;
        updateInfoUser(values)
    }

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = ['image/png', 'image/jpeg'].includes(file.type);
        if (!isJpgOrPng) {
          message.error('Archivo seleccionado no válido');
        }
        return isJpgOrPng;
      };

    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoadImage(true);
            return;
        }
        if (info.file.status === 'done') {
            updateImgUser(info.file.originFileObj)
        }  
    }

    const uploadButton = (
        <div>
          {loadImge ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>Cargar</div>
        </div>
    );

    const disabledDate = (current) => {
        return current && current > moment().endOf("day");
    };

    return (
        <ProfileCard
            title={<><h3>Información personal</h3></>}
            extra={
                <Button onClick={()=> router.push('/user')} icon={<ArrowLeftOutlined/>}>
                    Regresar
                </Button>
            }
        >
            <Spin spinning={loading}>
                <Space direction='vertical' size={[8,16]} style={{width: '100%'}}>
                    <ProfileHeader>
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            showUploadList={false}
                            accept='.jpg, .png'
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                            maxCount={1}
                            loa
                        >
                            {imgUser && !loadImge ? (
                                <img
                                    src={imgUser}
                                    alt="avatar"
                                />
                            ) : (
                                uploadButton
                            )}
                        </Upload>
                    </ProfileHeader>
                    <Form form={formUser} layout='vertical' onFinish={onFinish}>
                        <Row gutter={[24, 0]}>
                            <Col xs={24} md={12} xl={8} xxl={6}>
                                <Form.Item label="Número de empleado" name="code">
                                    <Input type="text" placeholder="Núm. empleado" disabled />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} xl={8} xxl={6}>
                                <SelectPersonType isDisabled={true} label="Tipo de persona" />
                            </Col>
                            <Col xs={24} md={12} xl={8} xxl={6}>
                                <Form.Item label="Fecha de ingreso a la plataforma" name="register_date">
                                    <DatePicker
                                        locale={locale}
                                        style={{ width: "100%" }}
                                        format={"DD-MM-YYYY"}
                                        placeholder="Fecha de ingreso a la plataforma"
                                        disabled={true}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} xl={8} xxl={6}>
                                <Form.Item label="Nombres" name="first_name" rules={[ruleRequired, nameLastname]}>
                                    <Input type="text" placeholder="Nombres" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} xl={8} xxl={6}>
                                <Form.Item label="Apellido paterno" name="flast_name" rules={[ruleRequired, nameLastname]}>
                                    <Input type="text" placeholder="Apellido paterno" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} xl={8} xxl={6}>
                                <Form.Item label="Apellido materno" name="mlast_name" rules={[nameLastname]}>
                                    <Input type="text" placeholder="Apellido materno" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} xl={8} xxl={6}>
                                <Form.Item label="Correo electrónico" name="email">
                                    <Input type="text" placeholder="Correo electrónico" disabled />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} xl={8} xxl={6}>
                                <Form.Item label="Fecha de nacimiento" name="birth_date">
                                    <DatePicker
                                        locale={locale}
                                        style={{ width: "100%" }}
                                        format={"DD-MM-YYYY"}
                                        placeholder="Fecha de nacimiento"
                                        disabledDate={disabledDate}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} xl={8} xxl={6}>
                                <Form.Item label="Estado civil" name="civil_status">
                                    <Select
                                        placeholder="Estado civil"
                                        options={civilStatus}
                                        notFoundContent={"No se encontraron resultados."}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} xl={8} xxl={6}>
                                <Form.Item label="Género" name="gender">
                                    <Select
                                        placeholder="Género"
                                        options={genders}
                                        notFoundContent={"No se encontraron resultados."}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} xl={8} xxl={6}>
                                <Form.Item label="CURP" name="curp" rules={[ruleRequired, curpFormat]}>
                                    <Input type="text" placeholder="CURP" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} xl={8} xxl={6}>
                                <Form.Item label="RFC" name="rfc" rules={[ruleRequired, rfcFormat]}>
                                    <Input type="text" placeholder="RFC" />
                                </Form.Item>
                            </Col>
                            <Col span={24} className="content-end">
                                <Button htmlType='submit'>
                                    Actualizar
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Space>
            </Spin>
        </ProfileCard>
    )
}

export default ProfileForm