import React, {useState, useEffect} from 'react';
import styled from '@emotion/styled';
import {
    Row,
    Col,
    Modal,
    Tabs,
    List
} from 'antd';
import { CustomModal } from '../assessment/groups/Styled';

const ColTabs = styled(Col)`
    & .ant-tabs-content-holder{
        border-radius: 12px;
        max-height: calc(100vh - 300px);
        overflow-y: auto;
    }
    & .ant-list-item{
        padding: 12px 16px;
        :hover{
           background: #FAFAFA;
        }
    }
    & .ant-list-item-meta-content {
        overflow: hidden;
        white-space: nowrap;
    }
    & .ant-list-item-meta-title,
    .ant-list-item-meta-description {
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

const ViewAssigns = ({visible, setVisible, item, widthModal = 600, ...props}) =>{

    const { TabPane } = Tabs;
    const [listAssigns, setListAssigns] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        if(item){
            setLoading(true)
            setTimeout(()=>{
                setLoading(false)
                setListAssigns(data)
            },3000)
            // getAssigns(item.id)
        }
    },[item])

    // const getAssigns = async (id) =>{
    //     try {
    //         let response = await WebApiAssessment.getAssignByPerson({person: id})
    //         console.log('esto me trae------->', response)
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }

    const data = [
        {id: 1, name: 'assessment 1'},
        {id: 2, name: 'assessment 2'},
        {id: 3, name: 'assessment 3'},
        {id: 4, name: 'assessment 4'},
        {id: 5, name: 'assessment 5'},
        {id: 6, name: 'assessment 6'},
        {id: 7, name: 'assessment 7'},
        {id: 8, name: 'assessment 8'},
        {id: 9, name: 'assessment 9'},
        {id: 10, name: 'assessment 10'},
        {id: 11, name: 'assessment 11'},
    ]

    return(
        <CustomModal
            onCancel={() => setVisible(false)}
            maskClosable={false}
            visible={visible}
            footer={null}
            width={widthModal}
        >
            <Row gutter={[8, 0]}>
                <Col xs={24}>
                    <h3 style={{fontWeight:'bold'}}>Asignaciones</h3>
                </Col>
                <ColTabs xs={24}>
                    <Tabs defaultActiveKey="1" centered>
                        <TabPane tab="Inviduales" key="1">
                            <List
                                itemLayout="horizontal"
                                dataSource={listAssigns}
                                loading={loading}
                                locale={{
                                    emptyText: loading?
                                    "Cargando..." :
                                    "No se encontraron resultados."
                                }}
                                renderItem={item => (
                                    <List.Item key={item.id}>
                                        <List.Item.Meta
                                            title={item.name}
                                            description={item.name}
                                        />
                                    </List.Item>
                                )}
                            />
                        </TabPane>
                        <TabPane tab="Grupales" key="2">
                            <List
                                itemLayout="horizontal"
                                dataSource={data}
                                locale={{
                                    emptyText: props.loading ?
                                    "Cargando..." :
                                    "No se encontraron resultados."
                                }}
                                renderItem={item => (
                                    <List.Item key={item.id}>
                                        <List.Item.Meta
                                            title={item.name}
                                            description={item.name}
                                        />
                                    </List.Item>
                                )}
                            />
                        </TabPane>
                    </Tabs>
                </ColTabs>
            </Row>
        </CustomModal>
    )
}

export default ViewAssigns