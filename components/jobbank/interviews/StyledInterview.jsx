import styled from '@emotion/styled';
import { Drawer } from 'antd';

export const ContentVertical = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({gap}) => gap ? `${gap}px` : '0px'};
`;

export const ContentBetween = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const ContentNormal = styled.div`
    display: flex;
    align-items: center;
    gap: ${({gap}) => gap ? `${gap}px` : '0px'};
`;

export const EvenTitle = styled.p`
    font-size: 22px;
    color: rgb(60,64,67);
    margin-bottom: 0px;
    font-weight: 400;
    max-width: calc(100% - 140px);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`;

export const BtnOption = styled.button`
    height: 32px;
    width: 32px;
    display: flex;
    background-color: transparent;
    border: 1px solid #f0f0f0;
    border-radius: 50%;
    transition: 0.5s background-color ease-in;
    cursor: pointer;
    :hover,
    :focus,
    :active{
        background-color: #f0f0f0;
    }
    & svg{
        margin: auto;
        font-size: 26px;
        color: rgb(60,64,67);
    }
`;

export const BtnLink = styled.a`
    background-color: rgb(3, 155, 229);
    color: #ffff;
    font-weight: 400;
    font-size: 14px;
    padding: 8px 16px;
    border-radius: 4px;
    :hover{
        opacity: 0.9;
        color: #ffff;
    }
`;

export const TextDescripcion = styled.p`
    font-size: 14px;
    margin-bottom: 0px;
    color: ${({isTitle}) => isTitle ? 'rgb(60,64,67)' : 'rgb(95,99,104)'};
    font-weight: 400;
    line-height: 1.2;
`;

export const StatusGuest = styled.span`
    display: flex;
    position: absolute;
    width: 17px;
    height: 17px;
    background-color: #f0f0f0;
    bottom: 0px;
    right: -8px;
    border-radius: 50%;
    border: 1px solid #f0f0f0;
    & svg{
        margin: auto;
        color: ${({status}) => status == 'accepted' ? '#188038' : '#d93025'};
    }
`;
