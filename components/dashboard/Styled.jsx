import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { Card } from 'antd';

export const ContentVertical = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ gap }) => gap ? `${gap}px` : '8px'};
`;

export const ContentCards = styled.div(({
    children
}) => {
    let max = children?.length > 1 ? '1fr' : 'min-content';
    return css`
        display: grid;
        gap: 24px;
        grid-template-columns: repeat(auto-fit, minmax(400px, ${max}));
        grid-auto-rows: 165px;;
        grid-auto-flow: row dense;
    `;
});

export const CardInfo = styled(ContentVertical)`
    border-radius: 10px;
    grid-row: span 2;
`;

export const CardItem = styled(Card)`
    height: ${({ hg }) => hg ? hg : '100%'};
    & .ant-card-extra{
        padding: 0px;
        font-size: 16px;
        font-weight: 600;
    }
    & .ant-card-head-title{
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 0px;
        & p {
            margin-bottom: 0px;
            color: rgba(0,0,0,0.85);
            font-weight: 600;
            font-size: 18px;
        }
        & img{
            width: auto;
            height: 32px;
        }
        & .anticon{
            font-size: 24px;
            font-weight: bold;
        }
    }
    & .ant-card-body{
        display: flex;
        justify-content: ${({ jc }) => jc ? jc : 'flex-start'};
        align-items: ${({ ai }) => ai ? ai : 'center'};
        flex-direction: ${({ fd }) => fd ? fd : 'row'};
        padding: ${({ pd }) => pd ? pd : '8px 24px'};
        height: calc(100% - 49px);
        max-height: calc(100% - 49px);
    }
    & .card-load{
        margin: auto;
        font-size: 2rem;
        color: rgba(0,0,0,0.3)
    }
`;

export const CardScroll = styled.div`
    max-height: 100%;
    overflow-y: auto;
    width: 100%;
    & .ant-list-item-meta-avatar{
        margin-right: 8px;
    }
    & .ant-list-item-meta-title{
        margin-bottom: 0px;
    }
    & .ant-list-item-meta-description,
    & .ant-list-item-meta-title{
        max-width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    & .ant-list-item-meta-description{
        font-size: 13px;
    }
`;

export const ContentTabs = styled.div`
    width: 100%;
    height: 100%;
    & .ant-tabs{
        width: 100%;
        height: 100%;
    }
    & .ant-tabs-content {
        height: 100%;
    }
    & .ant-tabs-tabpane{
        display: flex;
    }
`;