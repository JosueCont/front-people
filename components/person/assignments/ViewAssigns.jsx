import React, {useState, useEffect} from 'react';
import styled from '@emotion/styled';
import { DeleteOutlined, SearchOutlined, PlusOutlined} from "@ant-design/icons";
import {
    Row,
    Col,
    Modal,
    Tabs,
    List,
    Table
} from 'antd';
import { CustomModal, ButtonDanger, ColTabs, CustomCheck, CustomTable} from '../../assessment/groups/Styled';
import WebApiAssessment from '../../../api/WebApiAssessment';
import AssignsIndividuales from './AssignsInviduales';
import AssignsGroup from './AssignsGroup';

const ViewAssigns = ({visible, setVisible, item, widthModal = 600, ...props}) =>{

    const { TabPane } = Tabs;
    const [defaultKey, setDefaultKey] = useState("1");

    const onChangeTab = (key) =>{
        props.onChangeType(key)
        setDefaultKey(key)
    }

    const onCloseModal = () =>{
        setVisible(false)
        setDefaultKey("1")
    }

    return(
        <CustomModal
            onCancel={() => onCloseModal(false)}
            maskClosable={false}
            visible={visible}
            footer={null}
            width={widthModal}
        >
            <Row gutter={[8, 0]}>
                <Col xs={24}>
                    <h3 style={{fontWeight:'bold'}}>Lista de asignaciones</h3>
                </Col>
                <ColTabs xs={24}>
                    <Tabs activeKey={defaultKey} onChange={onChangeTab} centered>
                        <TabPane tab="Inviduales" key="1">
                            <AssignsIndividuales
                                listAssigns={props.itemList}
                                itemId={props.itemSelected?.id}
                                getAssigns={props.getAssigns}
                                loading={props.loadAssign}
                            />
                        </TabPane>
                        <TabPane tab="Grupales" key="2">
                            <AssignsGroup
                                listAssigns={props.itemList}
                                itemId={props.itemSelected?.id}
                                getAssigns={props.getAssigns}
                                loading={props.loadAssign}
                            />
                        </TabPane>
                    </Tabs>
                </ColTabs>
            </Row>
        </CustomModal>
    )
}

export default ViewAssigns