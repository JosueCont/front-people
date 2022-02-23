import React, { useState, useEffect } from "react";
import {
    Button,
    Modal,
    List,
    Avatar
} from "antd";

const ViewMembers = ({...props}) =>{

    const defaultPhoto =
    "https://khorplus.s3.amazonaws.com/demo/people/person/images/photo-profile/1412021224859/placeholder-profile-sq.jpg";

    const styleList = {
        whiteSpace:'nowrap',
        overflow:'hidden',
        textOverflow:'ellipsis'
    }

    const styleContent = {
        maxHeight:'calc(100vh - 300px)',
        overflowY:'auto'
    }

    return(
        <Modal
            title={props.title}
            visible={props.visible}
            onCancel={() => props.setVisible(false)}
            bodyStyle={styleContent}
            width={400}
            footer={[
                <Button type="primary" onClick={()=>props.setVisible(false)}>
                    Cerrar
                </Button>
            ]}
        >
            <List
                itemLayout="horizontal"
                style={styleList}
                dataSource={props.item?.persons}
                renderItem={item => (
                    <List.Item key={item.id}>
                        <List.Item.Meta
                            avatar={<Avatar src={item.photo ? item.photo : defaultPhoto}/>}
                            title={`${item.first_name} ${item.flast_name} ${item.mlast_name !== null ? item.mlast_name :''}`}
                            description={item.email}
                        />
                    </List.Item>
                )}
            />
        </Modal>
    )
}

export default ViewMembers