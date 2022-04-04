import styled from "@emotion/styled";

export const Content = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #252837;
    overflow: hidden;

    @keyframes fadein {
        from { opacity: 0; }
        to { opacity: 1; }   
    }

    @keyframes slidein {
        from { transform: translateY(-100%); }
        to { transform: translateY(0%); }
    }
`;

export const ContentVertical = styled.div`
    display: flex;
    gap: 16px;
    align-items: center;
    flex-direction: column;
    animation: slidein 1s ease-in, fadein 1s ease-in;
    & p{
        margin-bottom: 0em;
    }
    & p:last-of-type{
        color: #ffff;
        font-size: 1.5rem;
        font-weight: bold;
    }
`;

export const ContentVerify = styled(ContentVertical)`
    animation: slidein 1s ease-in, fadein 1s ease-in;
    & p:last-of-type{
        animation: fadein 1s ease-in alternate infinite;
    }
`;