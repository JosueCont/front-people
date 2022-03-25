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

const ViewAssigns = ({
    item,
    visible,
    itemList,
    setVisible,
    itemSelected,
    widthModal = 600,
    onChangeType,
    actionDelete,
    getAssigns,
    loadAssign,
    ...props
}) =>{

    const { TabPane } = Tabs;
    const [defaultKey, setDefaultKey] = useState("1");
    const [isClosed, setIsClosed] = useState(false);

    useEffect(()=>{
        setIsClosed(visible)
    },[visible])

    const onChangeTab = (key) =>{
        onChangeType(key)
        setDefaultKey(key)
    }

    const onCloseModal = () =>{
        setVisible(false)
        setDefaultKey("1")
    }

    const properties = {
        listAssigns: itemList,
        itemId: itemSelected?.id,
        getAssigns: getAssigns,
        loading: loadAssign,
        actionDelete: actionDelete,
        isClosed: isClosed
    }

    return(
        <CustomModal
            onCancel={() => onCloseModal()}
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
                            <AssignsIndividuales {...properties} />
                        </TabPane>
                        <TabPane tab="Grupales" key="2">
                            <AssignsGroup {...properties} />
                        </TabPane>
                    </Tabs>
                </ColTabs>
            </Row>
        </CustomModal>
    )
}

export default ViewAssigns