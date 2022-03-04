import React, { useState, useEffect } from "react";
import { Button, Modal, List } from "antd";

const DeleteAssign = ({...props}) =>{

    const [loading, setLoading] = useState(false);

    const styleList = {
        whiteSpace:'nowrap',
        overflow:'hidden',
        textOverflow:'ellipsis'
    }

    const styleContent = {
        maxHeight:'calc(100vh - 300px)',
        overflowY:'auto'
    }

    const getOnlyIds = () =>{
        let ids = [];
        props.assign.map((item)=>{
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
                props.assign?.length > 1
                ? "¿Estás seguro de eliminar estas asignaciones?"
                : "¿Estás seguro de eliminar esta asignación?"
            }
            visible={props.visible}
            onCancel={() => props.close()}
            closable={false}
            maskClosable={false}
            bodyStyle={styleContent}
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
                itemLayout="horizontal"
                style={styleList}
                dataSource={props.assign}
                renderItem={(item) => (
                    <List.Item key={item.id}>
                        <List.Item.Meta
                            title={item.id}
                        />
                    </List.Item>
                )}
            />
        </Modal>
    )
}

export default DeleteAssign