import React, { useState, useEffect } from "react";
import {
    Button,
    Modal,
    List,
    Avatar
} from "antd";

const ViewSurveys = ({...props}) =>{

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
            width={550}
            footer={[
                <Button type="primary" onClick={()=>props.setVisible(false)}>
                    Cerrar
                </Button>
            ]}
        >
            <List
                itemLayout="horizontal"
                style={styleList}
                dataSource={props.item?.assessments}
                renderItem={item => (
                    <List.Item key={item.id}>
                        <List.Item.Meta
                            title={item.name_es}
                            description={
                                <div>
                                    Categoría: {item.category === "A" ? "Assessment" : "Quiz"},
                                    Secciones: {item.total_sections},
                                    Preguntas: {item.total_questions}
                                </div>
                            }
                        />
                    </List.Item>
                )}
            />
        </Modal>
    )
}

export default ViewSurveys