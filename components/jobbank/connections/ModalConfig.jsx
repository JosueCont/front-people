import React, { useEffect, useState } from 'react';
import MyModal from '../../../common/MyModal';
import { Row, Col, Alert, Button } from 'antd';
import { useRouter } from 'next/router';

const ModalConfig = ({
    visible = true,
    configCurrent = {},
    configExist = {},
    close = () =>{},
    actionUpdate = () =>{}
}) =>{

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const msgAlert = `Se ha detectado que la conexión ${configExist.name} ha sido configurada,
        se recomienda copiar sus datos ya que la mayoría son similares
        para esta conexión. En caso de realizar de la copia, posteriormente
        es necesario actualizar otros campos para completar la configuración,
        de lo contrario al realizar la configuración "Manual" podría reemplazar
        algunos parámetros y esto generar problemas para publicaciones futuras.
    `;

    const onCopy = () =>{
        setLoading(true)
        setTimeout(()=>{
            setLoading(false)
            actionUpdate()
            close()
        },2000)
    }

    const onEdit = () =>{
        close()
        router.push({
            pathname: '/jobbank/settings/connections/edit',
            query: {...router.query, id: configCurrent.id, code: configCurrent.code }
        })
    }

    return(
        <MyModal
            visible={visible}
            title={`¿Copiar configuración en ${configCurrent.name}?`}
            close={close}
            closable={!loading}
            widthModal={700}
        >
            <Row gutter={[0,16]}>
                <Col span={24}>
                    <Alert type='warning' message={msgAlert}/>
                </Col>
                <Col span={24} className='content-end' style={{gap: 8}}>
                    <Button onClick={()=> close()}>Cancelar</Button>
                    <Button onClick={()=> onEdit()}>Editar</Button>
                    <Button onClick={()=> onCopy()} loading={loading}>Copiar</Button>
                </Col>
            </Row>
        </MyModal>
    )
}

export default ModalConfig;