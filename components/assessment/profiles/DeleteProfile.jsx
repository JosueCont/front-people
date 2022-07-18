import React, {useState, useEffect} from 'react';
import MyModal from '../../../common/MyModal';
import { Row, Col, Button, List } from 'antd';

const DeleteProfile = ({
    visible,
    close,
    profilesSelected,
    viewlist,
    actionDelete,
    ...props
}) => {

    const [loading, setLoading] = useState(false);

    const getOnlyIds = () =>{
        let ids = [];
        profilesSelected.map((item)=> ids.push(item.id))
        return ids;
    }

    const confirmDelete = () =>{
        const ids = getOnlyIds();
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            actionDelete(ids)
        }, 2000);
    }

    return (
        <MyModal
            visible={visible}
            close={close}
            title={
                !viewlist
                ? profilesSelected.length > 1
                ? "¿Estás seguro de eliminar estos perfiles?"
                : "¿Estás seguro de eliminar este perfil?"
                : "Lista competencias" 
            }
            widthModal={400}
        >
            <Row gutter={[24,24]}>
                <Col span={24} className='elements_delete scroll-bar'>
                    <List
                        size={'small'}
                        itemLayout={'horizontal'}
                        dataSource={profilesSelected}
                        renderItem={item => (
                            <List.Item key={!viewlist ? item.id : item.competence?.id}>
                                <List.Item.Meta
                                    title={!viewlist ? item.name : item.competence?.name}
                                    description={item.level ? <span>Nivel: {item.level}</span> : null}
                                />
                            </List.Item>
                        )}
                    />
                </Col>
                <Col
                    span={24}
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '16px'
                    }}
                >
                    <Button onClick={()=> close()}>
                        {!viewlist ? (
                            <span>No</span>
                        ) : (
                            <span>Cerrar</span>
                        )}
                    </Button>
                    {!viewlist ? (
                        <Button
                            loading={loading}
                            onClick={()=> confirmDelete()}
                        >
                            Sí
                        </Button>
                    ): null}
                </Col>
            </Row>
        </MyModal>
    )
}

export default DeleteProfile;