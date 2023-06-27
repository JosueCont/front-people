import React, { useState, useEffect } from "react";
import {
    Button,
    Modal,
    List,
    Avatar,
    Typography,
    Row,
    Col
} from "antd";
import MyModal from "../../../common/MyModal";

const ViewAssessments = ({
    visible = false,
    close = () => { },
    itemsGroup = []
}) => {

    return (
        <MyModal
            title='Grupos de evaluaciones'
            visible={visible}
            widthModal={450}
            close={close}
        >
            <Row style={{
                maxHeight: 'calc(100vh - 400px)',
                overflowY: 'auto'
            }} className="scroll-bar">
                {itemsGroup?.length > 0 && itemsGroup.map((record, idx) => (
                    <React.Fragment key={idx}>
                        <Col span={24} style={{marginTop: idx > 0 ? 8 : 0}}>
                            <p style={{
                                fontWeight: 500,
                                marginBottom: 0
                            }}>{record?.name}</p>
                        </Col>
                        <Col span={24}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                backgroundColor: '#ffff',
                                padding: '4px 8px',
                                borderRadius: 8
                            }} className='scroll-bar'>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    lineHeight: 1.3,
                                    gap: 4
                                }}>
                                    {record?.assessments?.map((row, idx) => (
                                        <div key={idx}>
                                            <p style={{
                                                marginBottom: 0
                                            }}>{row?.name}</p>
                                            <span style={{ color: 'gray' }}>
                                                Tipo: {row.category === "A" ? "Assessment" : row.category === "K" ? "Khor" : "Quiz"},
                                                Secciones: {row?.total_sections},
                                                Preguntas: {row?.total_questions}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Col>
                    </React.Fragment>
                ))}
            </Row>
        </MyModal>
    )
}

export default ViewAssessments