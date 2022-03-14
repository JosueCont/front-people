import React, { useState, useEffect } from "react";
import { Button, Modal, List } from "antd";

const DeleteAssigns = ({actionDelete, visible, close, items, ...props}) =>{

    const [loading, setLoading] = useState(false);

    const getOnlyIds = () =>{
        let ids = [];
        items.map((item)=>{
          ids.push(item.id)
        })
        return ids;
    }

    const confirmDelete = () =>{
        const ids = getOnlyIds()
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            actionDelete(ids)
            close()
        }, 2000);
    }

    return(
        <Modal
            title={
                items?.length > 1
                ? "¿Estás seguro de eliminar estas asignaciones?"
                : "¿Estás seguro de eliminar ésta asignación?"
            }
            visible={visible}
            onCancel={() => close()}
            closable={false}
            maskClosable={false}
            className={'custom-modal'}
            width={400}
            footer={[
                <Button
                    type="primary"
                    onClick={()=>close()}
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
                dataSource={items}
                renderItem={(item) => (
                    <List.Item key={item.id}>
                        <List.Item.Meta
                            title={
                                item.assessment ?
                                item.assessment.name :
                                item.group_assessment &&
                                item.group_assessment.name
                            }
                        />
                    </List.Item>
                )}
            />
        </Modal>
    )
}

export default DeleteAssigns