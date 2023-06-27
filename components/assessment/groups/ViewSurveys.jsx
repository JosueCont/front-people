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
    close = () => { },
    itemGroup = {}
}) => {

    return (
        <Modal
            title={title}
            visible={visible}
            onCancel={() => close()}
            className='custom-modal'
            bodyStyle={{padding: '8px 24px'}}
            width={400}
            footer={[
                <Button type="primary" onClick={() => close()}>
                    Cerrar
                </Button>
            ]}
        >
            <List
                rowKey='id'
                size='small'
                itemLayout="horizontal"
                dataSource={itemGroup?.assessments}
                renderItem={item => (
                    <List.Item style={{padding: '4px 0px'}}>
                        <List.Item.Meta
                            title={item.name}
                            description={
                                <>
                                    Tipo: {item.category === "A" ? "Assessment" : item.category === "K" ? "Khor" : "Quiz"},
                                    Secciones: {item?.total_sections},
                                    Preguntas: {item?.total_questions}
                                </>
                            }
                        />
                    </List.Item>
                )}
            />
        </Modal>
    )
}

export default ViewSurveys