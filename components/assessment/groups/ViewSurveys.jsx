import React, { useState, useEffect } from "react";
import {
    Button,
    Modal,
    List,
    Avatar
} from "antd";

const ViewSurveys = ({...props}) =>{

    return(
        <Modal
            title={props.title}
            visible={props.visible}
            onCancel={() => props.setVisible(false)}
            className={'custom-modal'}
            width={500}
            footer={[
                <Button type="primary" onClick={()=>props.setVisible(false)}>
                    Cerrar
                </Button>
            ]}
        >
            <List
                size={'small'}
                itemLayout="horizontal"
                dataSource={props.item?.assessments}
                renderItem={item => (
                    <List.Item key={item.id}>
                        <List.Item.Meta
                            title={item.name}
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