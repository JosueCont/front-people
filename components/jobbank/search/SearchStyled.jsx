import { Skeleton, Spin } from 'antd';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

export const SearchLayout = styled.section`
    & main.ant-layout-content{
        background-color: #dbdbdb!important;
        overflow-x: hidden;
    }
    & .ant-spin-container::after{
        background: transparent;
    }
`;

export const SearchContent = styled.section`
    display: grid;
    grid-template-columns: 400px 1fr;
    grid-template-rows: 76px 1fr;
    grid-auto-flow: row dense;
    gap: 16px;

    @media (max-width: 992px) {
        grid-template-columns: 1fr;
        grid-template-rows: auto 76px 1fr;
    }
`;

export const SearchLogo = styled.section`
    height: 300px;
    display: flex;
    justify-content: center;
    & .ant-image,
    .ant-image-img{
        height: 100%;
        /* width: auto; */
        object-fit: contain;
    }
    @media (max-width: 1137px) {
       height: auto;
       & .ant-image,
        .ant-image-img{
            height: auto;
            width: 100%;
        }
    }
    ${({ grid }) => grid && css`
        grid-column: 1 / 3;
        grid-row: 1 / 2;
    `}
`;

export const SearchHeader = styled.section`
    grid-column: 2 / 3;
    grid-row: 1;

    @media (max-width: 992px) {
        grid-column: 1;
        grid-row: 2 / 3;
    }
`;

export const SearchAside = styled.section`
    grid-column: 1 / 2;
    grid-row: 1 / 3;
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 16px;

    @media (max-width: 992px) {
        grid-column: 1;
        grid-row: 1 / 2;
    }
`;

export const SearchBody = styled.section`
    grid-column: 2 / 3;
    grid-row: 2 / 3;

    @media (max-width: 992px) {
        grid-column: 1;
        grid-row: 3 / 4;
    }
`;

export const SectionTitle = styled.div`
    padding: 8px;
    background-color: #29316D;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    & p{
        color: #ffff;
        margin-bottom: 0px;
        font-weight: 500;
    }
`;

export const SectionBody = styled.div`
    height: 100%;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    background-color: #ffff;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
`;

export const SectionSubtitle = styled.div`
    border-bottom: 1px solid #f0f0f0;
    background-color: #ffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    & p{
        color: #000090;
        margin-bottom: 0px;
        font-weight: 500;
    }
    & span{
        cursor: pointer;
    }
`;

export const SectionTags = styled.div`
    display: flex;
    flex-flow: row wrap;
    gap: 4px;
    & .ant-tag{
        cursor: pointer;
        margin-right: 0px;
        border-radius: 6px;
    }
`;

export const SectionVoid = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px 0px;
    height: 100%;
    & p{
        color: #d9d9d9;
        margin-bottom: 0px;
    }
`;

export const SearchFields = styled.div`
    & .ant-form-vertical{
        & .ant-form-item-label{
            padding: 0px 0px 4px;
        }
        & .ant-form-item {
            margin-bottom: 12px;
        }
    }
`;

export const SearchTitle = styled.div`
    height: ${({ hg }) => hg ? hg : '50%'};
    background-color: #29316D;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0px 8px;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    & p{
        font-size: 14px;
        color: #ffff;
        margin-bottom: 0px;
        font-weight: 500;
    }
`;

export const SearchPagination = styled.div`
    height: 50%;
    background-color: #ffff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
`;

export const ContentCards = styled.div`
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    grid-auto-rows: 225px;
    grid-auto-flow: row dense;
`;

export const CardItem = styled.div`
    background-color: #ffff;
    border-radius: 10px;
    padding: 8px 16px;
    transition: all 0.3s;
    display: flex;
    flex-direction: column;
    gap: 4px;
    :hover{
        box-shadow:
            0 1px 2px -2px #00000029,
            0 3px 6px #0000001f,
            0 5px 12px 4px #00000017;
    }
`;

export const CardTitle = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding-bottom: 4px;
    border-bottom: 1px solid #f0f0f0;
    & span{
        border-radius: 50%;
        height: 20px;
        width: 20px;
        background-color: #01C3FF;
    }
    & p{
        color: #29316D;
        max-width: calc(100% - 28px);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        margin-bottom: 0px;
        font-size: 16px;
        font-weight: 500;
    }
`;

export const CardDescription = styled.div`
    display: flex;
    gap: 4px;
    flex-direction: column;
    min-height: calc(100% - 70.14px);
    max-height: calc(100% - 70.14px);
    overflow-y: auto;
`;

export const CardsVoid = styled.div`
    height: 100%;
    padding: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffff;
    border-radius: 10px;
    & .ant-empty-description{
        color: #d9d9d9;
    }
`;

export const SearchBtn = styled.button`
    font-weight: 400;
    border: 1px solid transparent;
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
    cursor: pointer;
    height: 32px;
    padding: 4px 15px;
    font-size: 14px;
    border-radius: 10px;
    color: rgba(0, 0, 0, 0.85);
    border-color: #d9d9d9;
    background-color: #fff;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 8px;
    :hover{
        opacity: 0.9;
    }
    :disabled:not([role='loading']){
        color: gray;
        border-color: #f0f0f0;
        background: #f0f0f0;
        text-shadow: none;
        box-shadow: none;
        cursor: not-allowed;
    }
    :where([role='loading']){
        position: relative;
        cursor: default;
        ::before{
            display: block;
            position: absolute;
            top: -1px;
            right: -1px;
            bottom: -1px;
            left: -1px;
            z-index: 1;
            background: #fff;
            border-radius: inherit;
            opacity: 0.35;
            transition: opacity 0.2s;
            content: '';
        }
    }
`;

export const ButtonPrimary = styled(SearchBtn)`
    color: #ffff;
    border-color: ${({ color }) => color ? color : '#01C3FF'};
    background-color: ${({ color }) => color ? color : '#01C3FF'};;
    text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
`;

export const ContentBeetwen = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

export const ContentEnd = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: ${({ gap }) => gap ? gap : '0px'};
`;

export const ContentVertical = styled.div`
    display: flex;
    flex-direction: ${({ direction }) => direction ? direction : 'column'};
    gap: ${({ gap }) => gap ? gap : '0px'};
`;

// Estilo para el detalle de la vacante

export const VacantHeader = styled.section`
    border-radius: 10px;
    background-color: #ffff;
    display: flex;
    align-items: center;
    padding: 0px 8px;
    gap: 8px;
    @media (max-width: 992px) {
        padding: 0px;
        align-items: stretch;
        flex-direction: column;
    }
`;

export const VacantTitle = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    & > span{
        border-radius: 50%;
        height: 25px;
        width: 25px;
        background-color: #01C3FF;
    }
    @media (max-width: 992px) {
        & > span{
            display: none;
        }
    }
`;

export const VacantName = styled.div`
    flex: 1;
    padding: 8px;
    background-color: #29316D;
    & p{
        font-size: 24px;
        margin-bottom: 0px;
        color: #ffff;
        font-weight: 500;
        line-height: 1.2;
    }
    @media (max-width: 992px) {
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;
        & p{
            font-size: 16px;
        }
    }
`;

export const VacantOptions = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    @media (max-width: 992px) {
        width: 100%;
        justify-content: flex-end;
        padding: 0px 8px 8px;
    }
`;

export const VacantCards = styled.section`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-template-rows: auto;
    grid-auto-flow: row dense;
    gap: 16px;
`;

export const FeaturesContent = styled(ContentVertical)`
    padding: 8px;
    background-color: #ffff;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    gap: 8px;
    height: calc(100% - 38px);

    & .needRow {
        grid-column: 1 / 3;
    }

    ${({ responsive }) => responsive && css`
        @media (max-width: 992px) {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
        }
    `}
`;

export const FeaturesText = styled.p`
    margin-bottom: 0px;
    font-size: ${({ size }) => size ? size : '14px'};
    line-height: 1.2;
    color: ${({ color }) => color ? color : '#005eb8'};
    ${({ weight }) => weight && css`
        font-weight: ${weight};
    `}
`;

export const FeaturesList = styled.ul`
    list-style: disc;
    padding-inline-start: 20px;
    margin-block-end: 0px;
    margin-block-start: 0px;
    margin-bottom: 0px;
    color: gray;
`;

export const LoadText = styled(Skeleton.Input)`
    height: 19px;
    & .ant-skeleton-input-sm {
        height: 19px;
        line-height: 19px;
    }
`;

export const ContentCenter = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const ContentPrivacy = styled(ContentCenter)`
    & a{
        font-size: 16px;
        color: #ffff;
        font-weight: 500;
        text-decoration: underline;
    }
`;

export const ContentHTML = styled.div`
    color: gray;
    & p{
        margin-bottom: 0.5em;
    }
    & ul{
        padding-inline-start: 20px;
        margin-block-end: 0px;
        margin-block-start: 0px;
        margin-bottom: 0px;
    }
    & li{
        margin-left: 0px!important;
    }
    & li, span, p{
        color: gray!important;
    }

`;