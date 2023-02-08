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
    & .ant-modal-body{
        padding: 18px;
    }
    & .content-mymodal{
        display: flex;
        flex-direction: column;
        gap: 8px;

        & h3{
            font-weight: bold;
            margin-bottom: 0px;
            line-height: 1.2;
            width: calc(100% - 20px);
            letter-spacing: -0.3px;
        }
    }
`;

const MyModal = ({
    children,
    title,
    visible,
    close,
    widthModal = 600,
    closable = true
}) =>{

    return(
        <CustomModal
            onCancel={() => close()}
            afterClose={()=> close()}
            maskClosable={false}
            visible={visible}
            footer={null}
            width={widthModal}
            closable={closable}
        >
            <div className='content-mymodal'>
                <h3>{title}</h3>
                <>{children}</>
            </div>
        </CustomModal>
    )
}

export default MyModal