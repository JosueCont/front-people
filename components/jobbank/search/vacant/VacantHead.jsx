import React from 'react';
import {
    ButtonPrimary,
    SearchBtn,
    ContentVertical,
    ContentEnd,
    ContentBeetwen,
    VacantHeader,
    VacantTitle,
    VacantName,
    VacantOptions
} from '../SearchStyled';

const VacantHead = ({
    title = '',
    actions = <></>
}) => {
    return (
        <VacantHeader>
            <VacantTitle>
                <span />
                <VacantName>
                    <p>{title}</p>
                </VacantName>
            </VacantTitle>
            <VacantOptions>
                {actions}
            </VacantOptions>
        </VacantHeader>
    )
}

export default VacantHead;
