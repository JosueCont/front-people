import React, { useState } from 'react';
import MyModal from '../../../common/MyModal';
import { Row, Col, Space, Spin, Upload, Radio, Button, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { InboxOutlined } from '@ant-design/icons';

const ModalUploadGroups = ({
    visible = true,
    close = () => { },
    sendFile = async () => { }
}) => {

    const { current_node } = useSelector(state => state.userStore)
    const [action, setAction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showErrorAction, setShowErrorAction] = useState(false)
    const [showErrorFile, setShowErrorFile] = useState(false)
    const [fileList, setFileList] = useState([]);

    const createData = () => {
        let data = new FormData();
        data.append('file', fileList[0])
        data.append('node', current_node?.id)
        data.action('action', action)
        return data;
    }

    const onFinish = () => {
        setShowErrorFile(false)
        setShowErrorAction(false)
        if (fileList.length <= 0) {
            setShowErrorFile(true)
            return;
        }
        if (!action) {
            setShowErrorAction(true)
            return;
        }
        setLoading(true)
        let body = createData();
        setTimeout(async () => {
            let resp = await sendFile(body);
            if(resp) closeModal();
            setLoading(false)
        }, 2000)
    }

    const onChangeAction = ({ target }) => {
        setAction(target?.value)
    }

    const closeModal = () => {
        close()
        setFileList([])
        setAction(null)
        setShowErrorAction(false)
        setShowErrorFile(false)
    }

    const propsUpl = {
        onRemove: (file) => {
            let index = fileList.indexOf(file);
            let newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            setShowErrorFile(false)
            setFileList([file])
            return false;
        },
        fileList
    }

    return (
        <MyModal
            title='Cargar archivo'
            visible={visible}
            close={closeModal}
            widthModal={500}
            closable={!loading}
        >
            <Spin spinning={loading}>
                <Row gutter={[0, 8]}>
                    <Col span={24}>
                        <div>
                            <Upload.Dragger maxCount={1} {...propsUpl}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">
                                    Selecciona o arrastra un archivo para cargarlo
                                </p>
                            </Upload.Dragger>
                        </div>
                        {showErrorFile && (
                            <Typography.Text type='danger'>
                                Debes elegir un archivo
                            </Typography.Text>
                        )}
                    </Col>
                    <Col span={24}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <b>
                                ¿Qué acción desea realizar si el grupo de evaluaciones ya existe?
                            </b>
                            <Radio.Group
                                onChange={onChangeAction}
                                value={action}
                            >
                                <Space direction="vertical">
                                    <Radio value={2} >Duplicar</Radio>
                                    <Radio value={3}>Omitir</Radio>
                                    <Radio value={1}>Reemplazar</Radio>

                                </Space>
                            </Radio.Group>
                        </Space>
                        {showErrorAction && (
                            <Typography.Text type='danger'>
                                Selecciona una acción
                            </Typography.Text>
                        )}
                    </Col>

                    <Col span={24} className='content-end' style={{ gap: 8 }}>
                        <Button
                            onClick={() => closeModal()}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={() => onFinish()}
                        >
                            Enviar
                        </Button>
                    </Col>
                </Row>
            </Spin>
        </MyModal>
    )
}

export default ModalUploadGroups