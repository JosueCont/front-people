import {css} from 'styled-components';
import styled from '@emotion/styled';
import { Card, Row, Col, Avatar,Space, Button, Radio, Modal, Table, Layout, Progress} from 'antd';

export const ContentStart = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: ${props=>  props.gap};
`;

export const ContentCenter = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${props=> props.gap};
`;

export const ContentVertical = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${props=> props.gap};
`;

export const ContentDescription = styled.div`
    display: flex;
    align-items: center;
    & p{
        margin-bottom: 0px;
        font-size: 1rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    & p:first-of-type{
        color: #ffff;
        font-weight: 700;
        margin-inline-end: 10px;
        display: flex;
        align-items: center;
    }
    & p:last-of-type{
        color: #ffff;
        font-weight: 400;
    }
`;

export const ContentEnd = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: ${props=>  props.gap};
`;

export const ContentButtons = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${props=> props.gap};

    @media (max-width: 575px) {
        flex-direction: row;
    }
`;

export const CustomBtn = styled(Button)(({
    bg = "#1f2733",
    cl = "white",
    wd = "100%",
})=>{
    return css`
        display: flex;
        align-items: center;
        justify-content: center;
        background: ${bg}!important;
        color: ${cl}!important;
        border: none!important;
        border-radius: 50px;
        width: ${wd};
        gap: 5px;
        & span{
            color: ${cl}!important;
        }
        :hover{
            background: ${bg}!important;
            color: ${cl}!important;
            transform: scale(1.05);
        }
        :focus{
            background: ${bg}!important;
            color: ${cl}!important;
        }
    `;
});

export const ContentTitle = styled.div`
    display: flex;
    flex-direction: column;
    & p{
        margin-bottom: 0px;
    }
    & p:first-of-type{
        font-size: 1.125rem;
        color: #1f2733;
        font-weight: 700;
    }
    & p:last-of-type{
        font-size: 1rem;
        color: #8c8c8c;
        font-size: 400;
    }
`;

export const ProgressPurple = styled(Progress)`
    & .ant-progress-bg{
        background-color: #814cf2;
    }
    & .ant-progress-inner{
        background-color: #cccc;
    }
`;