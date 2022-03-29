import React from 'react';
import styled from '@emotion/styled';
import { Spin } from 'antd';
import { LoadingOutlined, CloseCircleFilled, CheckCircleFilled} from '@ant-design/icons';

const Content = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #252837;
`;

const ContentVertical = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
`;

const ContentVerify = styled(ContentVertical)`
    & p:last-of-type{
        color: #ffff;
        font-size: 1.5rem;
        font-weight: bold;
        animation: fadein 1s ease-in alternate infinite;
    }

    @keyframes fadein {
        from { opacity: 0; }
        to { opacity: 1; }   
    }
`;

const ContentError = styled(ContentVertical)`

`;

const validation = () => {
    const antIcon = <LoadingOutlined style={{ fontSize: 50, color: "white" }} spin />
    return (
        <Content>
            <ContentVerify>
                <p><Spin indicator={antIcon}/></p>
                <p>Verificando los datos</p>
            </ContentVerify>
            <ContentError>
                <p><CloseCircleFilled /></p>
            </ContentError>
            <ContentError>
                <p><CheckCircleFilled /></p>
            </ContentError>
        </Content>
    )
}

export default validation