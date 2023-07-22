import React, { useEffect, useState, useMemo } from 'react';
import MyModal from '../../../common/MyModal';
import {
    Button,
    Row,
    Col,
    Space,
    message
} from 'antd';
import { useSelector } from 'react-redux';
import WebApiPeople from '../../../api/WebApiPeople';
import { getFullName } from '../../../utils/functions';

const ModalSendUI = ({
    visible = false,
    close = () => { },
    itemsSelected = []
}) => {

    const {
        current_node,
    } = useSelector(state => state.userStore);

    const [loading, setLoading] = useState(false);
    const [details, setDetails] = useState({});

    const onFinish = async () => {
        setLoading(true)
        let persons_id = itemsSelected?.map(item => item.id);
        try {
            let body = { persons_id, node_id: current_node?.id };
            let response = await WebApiPeople.CreateUIStoreUsers(body);
            let detail = response.data?.detail;
            let txt = response.data?.message;
            let success = response.data?.success || 0;
            let errors = response.data?.error_details || [];
            if (detail) {
                message.error(detail)
                setLoading(false)
                return;
            }
            if (errors?.length > 0) {
                setTimeout(() => {
                    setLoading(false)
                    setDetails({ success, errors })
                }, 2000)
                return;
            }
            let msg = txt ? txt : persons_id.length > 1
                ? 'Personas enviadas'
                : 'Persona enviada';
            message.success(msg)
            setTimeout(() => {
                onClose()
                setLoading(false)
            }, 1000)
            setTimeout(() => {
                message.success(msg)
            }, 2000)
        } catch (e) {
            console.log(e)
            setLoading(false)
            let error = e.response?.data?.message;
            let msg = error ? error : persons_id.length > 1
                ? 'Personas no enviadas'
                : 'Persona no enviada';
            message.error(msg)
        }
    }

    const onClose = () => {
        setDetails({})
        close()
    }

    const exist = useMemo(() => Object.keys(details)?.length > 0, [details])

    const Void = (
        <div className='placeholder-list-items' style={{ padding: 8 }}>
            <p style={{ fontSize: 14 }}>No se encontraron resultados</p>
        </div>
    )

    return (
        <MyModal
            title={Object.keys(details)?.length > 0
                ? 'Detalles de la sincronización'
                : itemsSelected?.length > 1
                    ? '¿Enviar a estas personas a UI Store?'
                    : '¿Enviar a esta persona a UI Store?'
            }
            closable={!loading}
            visible={visible}
            widthModal={400}
            close={onClose}
        >
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    {exist ? (
                        <Space size={[0, 4]} direction='vertical' style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <p style={{ marginBottom: 0 }}>Errores ({details?.errors?.length})</p>
                                <p style={{ marginBottom: 0 }}>Usuarios creados ({details?.success})</p>
                            </div>
                            <div className='items-to-list scroll-bar'>
                                {details?.errors?.length > 0 ? details?.errors?.map((item, idx) => (
                                    <div key={idx}>
                                        <p style={{ color: '#ff4d4f' }}>{item}</p>
                                    </div>
                                )): Void}
                            </div>
                        </Space>
                    ) : (
                        <div className='items-to-list scroll-bar'>
                            {itemsSelected.length > 0 ? itemsSelected.map((item, idx) => (
                                <div key={idx}>
                                    <p>{getFullName(item)}</p>
                                    <p>{item?.email}</p>
                                </div>
                            )): Void}
                        </div>
                    )}
                </Col>
                <Col span={24} className='content-end' style={{ gap: 8 }}>
                    <Button disabled={loading} onClick={() => onClose()}>
                        {exist ? 'Cerrar' : 'Cancelar'}
                    </Button>
                    {!exist && (
                        <Button
                            loading={loading}
                            onClick={() => onFinish()}
                        >
                            Enviar
                        </Button>
                    )}
                </Col>
            </Row>
        </MyModal>
    )
}

export default ModalSendUI