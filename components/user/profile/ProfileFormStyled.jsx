import styled from '@emotion/styled';
import { Card } from 'antd';

export const ProfileHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    & img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

export const ProfileContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const ProfileCard = styled(Card)`
    & .ant-card-head{
        padding: 0px 18px;
    }
    & .ant-card-body{
        padding: 18px;
    }
    & .ant-card-head-title{
        padding: 8px 0px;
        & h3{
            margin-bottom: 0px;
        }
    }
    & .ant-card-extra{
        padding: 8px 0px;
    }
`;