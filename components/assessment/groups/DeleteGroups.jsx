import React, { useState, useEffect } from "react";
import { Button, Modal, List } from "antd";

const DeleteGroups = ({...props}) =>{

    const [loading, setLoading] = useState(false);

    const getOnlyIds = () =>{
        let ids = [];
        props.groups.map((item)=>{
          ids.push(item.id)
        })
        return ids;
    }

    const confirmDelete = () =>{
        const ids = getOnlyIds()
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            props.actionDelete(ids)
        }, 2000);
    }

    return(
        <Modal
            title={
                props.groups?.length > 1
                ? "¿Estás seguro de eliminar estos grupos?"
                : "¿Estás seguro de eliminar este grupo?"
            }
            visible={props.visible}
            onCancel={() => props.close()}
            closable={false}
            maskClosable={false}
            className={'custom-modal'}
            width={400}
            footer={[
                <>
                    <Button
                        type="primary"
                        onClick={()=>props.close()}
                    >
                        No
                    </Button>
                    <Button
                        type="primary"
                        onClick={()=>confirmDelete()}
                        loading={loading}
                    >
                        Sí
                    </Button>
                </>
            ]}
        >
            <List
                size={'small'}
                itemLayout="horizontal"
                dataSource={props.groups}
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

export default DeleteGroups