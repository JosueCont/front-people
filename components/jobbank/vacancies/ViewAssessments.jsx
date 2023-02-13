import React, { useState, useEffect } from "react";
import {
    Button,
    Modal,
    List,
    Avatar,
    Typography
} from "antd";
const { Text } = Typography

const ViewAssessments = ({...props}) =>{

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

          {
            props.item.length > 0 && props.item.map((ass) => (
              <>
                <Text style={{ fontWeight: 'bold' }}> { ass.name } </Text>
                <List
                  key={ass.id}
                  size={'small'}
                  itemLayout="horizontal"
                  dataSource={ass.assessments}
                  renderItem={ass => (
                      <List.Item key={ass.id}>
                          <List.Item.Meta
                              title={ass.name}
                              description={
                                  <div>
                                      Tipo: {ass.category === "A" ? "Assessment" : ass.category === "K" ? "Khor" : "Quiz"},
                                      Secciones: {ass.total_sections},
                                      Preguntas: {ass.total_questions}
                                  </div>
                              }
                          />
                      </List.Item>
                  )}
                />
              </>

            ))
          }

        </Modal>
    )
}

export default ViewAssessments