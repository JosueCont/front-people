import React, {useState, useEffect} from 'react';
import styled from '@emotion/styled';
import {
    Row,
    Col,
    Modal
} from 'antd';

const CustomModal = styled(Modal)`
    & .ant-modal-content{
        background: #F0F0F0;
    }
`;

const MyModal = ({ title, visible, close, widthModal = 600, ...props}) =>{

    return(
        <CustomModal
            onCancel={() => close()}
            afterClose={()=> close()}
            maskClosable={false}
            visible={visible}
            footer={null}
            width={widthModal}
        >
            <Row gutter={[0, 8]}>
                <Col xs={24}>
                    <h3 style={{fontWeight:'bold'}}>{title}</h3>
                </Col>
                <Col xs={24}>
                    {props.children}
                </Col>
            </Row>
        </CustomModal>
    )
}

export default MyModal