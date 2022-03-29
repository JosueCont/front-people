import React from 'react';
import styled from '@emotion/styled';

const Content = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
`;

const ContentVertical = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    & p:last-of-type{
        font-size: 2rem;
        animation: blink 3s infinite linear;
    }

    @keyframes blink {
        from { opacity: 0 }
        to { opacity: 1 }   
    }
`;

const validation = () => {
    return (
        <Content>
            <ContentVertical>
                <p>Probando</p>
                <p>Verificando los datos</p>
            </ContentVertical>
        </Content>
    )
}

export default validation