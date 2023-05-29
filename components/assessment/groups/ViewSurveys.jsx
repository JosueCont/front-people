import React, { useState, useEffect } from "react";
import {
    Button,
    Modal,
    List,
    Avatar
} from "antd";

const ViewSurveys = ({
    title = '',
    visible = false,
    close =()=>{},
    itemGroup = {}
}) =>{

    return(
        <Modal
            title={title}
            visible={visible}
            onCancel={() => close()}
            className={'custom-modal'}
            width={500}
            footer={[
                <Button type="primary" onClick={()=> close()}>
                    Cerrar
                </Button>
            ]}
        >
            <List
                size='small'
                itemLayout="horizontal"
                dataSource={itemGroup?.assessments}
                renderItem={item => (
                    <List.Item key={item.id}>
                        <List.Item.Meta
                            title={item.name}
                            description={
                                <div>
                                    Tipo: {item.category === "A" ? "Assessment" : item.category === "K" ? "Khor" : "Quiz"},
                                    Secciones: {item?.total_sections},
                                    Preguntas: {item?.total_questions}
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