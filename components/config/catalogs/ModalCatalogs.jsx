import React, { useEffect, useState } from 'react';
import MyModal from '../../../common/MyModal';
import {
    Button,
    Form,
    Row,
    Col,
    Alert,
    Space,
    message
} from 'antd';
import FileUpload from '../../jobbank/FileUpload';
import { useSelector, useDispatch } from 'react-redux';
import WebApi from '../../../api/webApi';
import {
    getDepartmets,
    getJobs,
    getPersonType,
    getRelationship,
    getDocumentType,
    getWorkTitle,
    getAccountantAccount,
    getCostCenter,
    getTags,
    getBranches
} from '../../../redux/catalogCompany';

const ModalCatalogs = ({
    visible = false,
    close = () => { }
}) => {

    const {
        current_node
    } = useSelector(state => state.userStore);
    const dispatch = useDispatch();
    const [formImport] = Form.useForm();
    const [file, setFile] = useState([]);
    const [loading, setLoading] = useState(false);
    const [details, setDetails] = useState([]);
    const typeFile = ['xlsx'];

    const onFinish = async (values) => {
        try {
            setLoading(true)
            let data = new FormData();
            data.append('file', file[0])
            data.append('node_id', current_node?.id)
            let response = await WebApi.uploadAllCatalogs(data)
            let details_ = response?.data || [];
            if (details_?.length <= 0) {
                setTimeout(() => {
                    onReady()
                    onClose()
                    setLoading(false)
                }, 1000)
                setTimeout(() => {
                    message.success('Catálogos cargados')
                }, 2000)
                return;
            }
            setTimeout(() => {
                message.success('Catálogos cargados')
            }, 1000)
            setTimeout(() => {
                setLoading(false)
                setDetails(details_)
                onReady()
            }, 2000);
        } catch (e) {
            console.log(e)
            setLoading(false)
            let txt = e.response?.data?.message;
            let msg = txt ? txt : 'Catálogos no cargados';
            message.error(msg)
        }
    }

    const onReady = () =>{
        dispatch(getDepartmets(current_node?.id))
        dispatch(getJobs(current_node?.id))
        dispatch(getPersonType(current_node?.id))
        dispatch(getRelationship(current_node?.id))
        dispatch(getDocumentType(current_node?.id))
        dispatch(getWorkTitle(current_node?.id))
        dispatch(getAccountantAccount(current_node?.id))
        dispatch(getCostCenter(current_node?.id))
        dispatch(getTags(current_node?.id))
        dispatch(getBranches(current_node?.id))
    }

    const onClose = () => {
        formImport.resetFields();
        setFile([])
        setDetails([])
        close()
    }

    return (
        <MyModal
            title={details.length > 0
                ? 'Detalle de la carga de catálogos'
                : 'Carga masiva de catálogos'
            }
            closable={!loading}
            visible={visible}
            widthModal={400}
            close={onClose}
        >
            <Form
                form={formImport}
                onFinish={onFinish}
                layout="vertical"
            >
                <Row>
                    {details.length > 0 ? (
                        <Col span={24} style={{ marginBottom: 24 }}>
                            <Space size={[0, 4]} direction='vertical' style={{ width: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <p style={{ marginBottom: 0 }}>Archivo: {file?.at(-1)?.name}</p>
                                </div>
                                <div className='items-selected scroll-bar'>
                                    {details.map((item, idx) => (
                                        <div key={idx}>
                                            <p>{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </Space>
                        </Col>
                    ) : (
                        <>
                            <Col span={24} style={{ marginBottom: 12 }}>
                                <Alert
                                    message={`Actualiza el archivo de catalogos y cargalo para actualizar los registros`}
                                    type='info'
                                />
                            </Col>
                            <Col span={24}>
                                <FileUpload
                                    label='Seleccionar archivo'
                                    keyName='file_name'
                                    isRequired={true}
                                    disabled={loading}
                                    tooltip={`Archivos permitidos: ${typeFile.join(', ')}.`}
                                    setFile={setFile}
                                    typeFile={typeFile}
                                    revertColor={true}
                                    setNameFile={e => formImport.setFieldsValue({
                                        file_name: e
                                    })}
                                />
                            </Col>
                        </>
                    )}
                    <Col span={24} className='content-end' style={{ gap: 8 }}>
                        <Button disabled={loading} onClick={() => onClose()}>
                            {details.length > 0 ? 'Cerrar' : 'Cancelar'}
                        </Button>
                        {details.length <= 0 && (
                            <Button
                                htmlType='submit'
                                loading={loading}
                            >
                                Cargar
                            </Button>
                        )}
                    </Col>
                </Row>
            </Form>
        </MyModal>
    )
}

export default ModalCatalogs