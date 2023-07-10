import React from 'react';
import {
    VacantHeader,
    VacantTitle,
    VacantName,
    VacantOptions
} from '../SearchStyled';
import { Skeleton } from 'antd';
import styled from '@emotion/styled';

const Fetching = styled(Skeleton.Input)`
    & .ant-skeleton-input{
        background:rgba(41, 49, 109, 0.2)!important;
        height: 28.8px;
    }
`;

const VacantHead = ({
    title = '',
    actions = <></>,
    loading = false
}) => {
    return (
        <VacantHeader>
            <VacantTitle>
                <span />
                <VacantName>
                    {loading ? <Fetching active/> : <p>{title}</p>}
                </VacantName>
            </VacantTitle>
            <VacantOptions>
                {actions}
            </VacantOptions>
        </VacantHeader>
    )
}

export default VacantHead;
