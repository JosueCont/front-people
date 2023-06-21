import React from 'react';
import styled from '@emotion/styled';
import {
    CheckCircleFilled,
    FacebookFilled,
    LinkedinFilled,
    InstagramFilled,
} from '@ant-design/icons';
import { FaTiktok } from 'react-icons/fa';
import { SearchBtn } from '../SearchStyled';
import { redirectTo } from '../../../../utils/constant';

const ContentSuccess = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    min-height: calc(100vh - 198px);
`;

const ContentMessage = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    & .anticon-check-circle{
        font-size: 50px;
        color: #28a745;
    }
`;

const CustomText = styled.p`
    text-align: center;
    margin-bottom: 0px;
    font-size: ${({ size }) => size ? size : '1.5rem'};
    font-weight: 500;
    color: rgba(0,0,0,0.85);
`;

const ContentIcons = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    & button{
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
    }
    & .anticon{
        color: #ffff;
        font-size: 18px;
    }
    & button[name='facebook']{
        background: linear-gradient(
            to bottom, 
            #3A5795 0%, 
            #2B4886 100%
        );
    }
    & button[name='linkedin']{
        background: linear-gradient(
            to bottom right,
            #0e76a8,
            #1293d2
        )
    }
    & button[name='instagram']{
        background: radial-gradient(circle farthest-corner at 35% 90%, #fec564, transparent 50%),
            radial-gradient(circle farthest-corner at 0 140%, #fec564, transparent 50%),
            radial-gradient(ellipse farthest-corner at 0 -25%, #5258cf, transparent 50%),
            radial-gradient(ellipse farthest-corner at 20% -50%, #5258cf, transparent 50%),
            radial-gradient(ellipse farthest-corner at 100% 0, #893dc2, transparent 50%),
            radial-gradient(ellipse farthest-corner at 60% -20%, #893dc2, transparent 50%),
            radial-gradient(ellipse farthest-corner at 100% 100%, #d9317a, transparent),
            linear-gradient(#6559ca, #bc318f 30%, #e33f5f 50%, #f77638 70%, #fec66d 100%);
    }
`;

const ContentOptions = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
`;

const VacantMessage = ({
    actionBack = () =>{}
}) => {

    return (
        <ContentSuccess>
            <ContentMessage>
                <CheckCircleFilled />
                <CustomText>Gracias por registrarte <br /> Hemos recibido tu información</CustomText>
            </ContentMessage>
            <ContentOptions>
                <SearchBtn onClick={()=> actionBack(2)}>
                    Consultar más vacantes
                </SearchBtn>
                <SearchBtn onClick={()=> actionBack(1)}>
                    Regresar
                </SearchBtn>
            </ContentOptions>
            <CustomText size='1rem'>
                Te recordamos que todos nuestros procesos<br />
                de atracción de talento son gratuitos
            </CustomText>
            <CustomText size='1rem'>
                Síguemos en redes sociales
            </CustomText>
            <ContentIcons>
                <button name='facebook' onClick={()=> redirectTo('https://es-es.facebook.com/HEXbyiUCorp/', true)}>
                    <FacebookFilled />
                </button>
                <button name='instagram' onClick={()=> redirectTo('https://www.instagram.com/hex_by_iucorp/', true)}>
                    <InstagramFilled />
                </button>
                <button name='linkedin' onClick={()=> redirectTo('https://mx.linkedin.com/company/hexbyiucorp', true)}>
                    <LinkedinFilled />
                </button>
                <button name='tiktok' onClick={()=> redirectTo('https://www.tiktok.com/es/', true)}>
                    <FaTiktok />
                </button>
            </ContentIcons>
        </ContentSuccess>
    )
}

export default VacantMessage