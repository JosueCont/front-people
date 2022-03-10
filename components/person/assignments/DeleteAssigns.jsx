import React, { useState, useEffect } from "react";
import { Button, Modal, List } from "antd";

const DeleteAssigns = ({...props}) =>{

    const [loading, setLoading] = useState(false);

    const getOnlyIds = () =>{
        let ids = [];
        props.items.map((item)=>{
          ids.push(item.id)
        })
        return ids;
    }

    const confirmDelete = () =>{
        const ids = getOnlyIds()
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            props.close()
            props.actionDelete(ids)
        }, 2000);
    }

    return(
        <Modal
            title={
                props.items?.length > 1
                ? "¿Estás seguro de eliminar estas asignaciones?"
                : "¿Estás seguro de eliminar ésta asignación?"
            }
            visible={props.visible}
            onCancel={() => props.close()}
            closable={false}
            maskClosable={false}
            className={'custom-modal'}
            width={400}
            footer={[
                <Button
                    type="primary"
                    onClick={()=>props.close()}
                >
                    No
                </Button>,
                <Button
                    type="primary"
                    onClick={()=>confirmDelete()}
                    loading={loading}
                >
                    Sí
                </Button>
            ]}
        >
            <List
                size={'small'}
                itemLayout="horizontal"
                dataSource={props.items}
                renderItem={(item) => (
                    <List.Item key={item.id}>
                        <List.Item.Meta
                            title={item.name}
                        />
                    </List.Item>
                )}
            />
        </Modal>
    )
}

export default DeleteAssigns