import React, {
    useEffect,
    useState
} from 'react';
import AutoRegister from '../AutoRegister';
import {
    SearchLayout,
    ContentVertical,
    SearchLogo,
    ContentPrivacy
} from './SearchStyled';
import { Image } from 'antd';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import { getSetupConfig } from '../../../redux/jobBankDuck';
import styled from '@emotion/styled';

const FetchingBanner = styled.div`
    height: 100%;
    aspect-ratio: 16 / 4;
    border-radius: 10px;
    display: inline-block;
    position: relative;
    overflow: hidden;
    background-color: transparent;

    &::after {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transform: translateX(-100%);
        background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0,
            rgba(255, 255, 255, 0.2) 30%,
            rgba(255, 255, 255, 0.5) 70%,
            rgba(255, 255, 255, 0)
        );
        animation: shimmer 2s infinite;
        content: '';
    }

    @keyframes shimmer {
        100% {
        transform: translateX(100%);
        }
    }

    @media (max-width: 1137px) {
       width: 100%;
    }

`;

const MainSearch = ({
    children,
    showLogo = true,
}) => {

    const {
        list_setup_config,
        load_setup_config
    } = useSelector(state => state.jobBankStore);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSetupConfig())
    }, [])

    return (
        <SearchLayout>
            <AutoRegister
                currentNode={list_setup_config?.node}
                logoAlign='right'
                secondaryLogo={list_setup_config?.logo}
                showFooter={true}
                contentFooter={
                    <ContentPrivacy>
                        <a href='https://www.grupohuman.com/aviso-privacidad' target='_blank'>
                            Aviso de privacidad
                        </a>
                    </ContentPrivacy>
                }
            >
                {showLogo ? (
                    <ContentVertical gap='16px'>
                        <SearchLogo>
                            {!load_setup_config ? (
                                <Image
                                    src={list_setup_config?.banner ? list_setup_config?.banner : '/images/portadaHex.png'}
                                    preview={false}
                                />
                            ) : <FetchingBanner/>}
                        </SearchLogo>
                        {children}
                    </ContentVertical>
                ) : children}
            </AutoRegister>
        </SearchLayout>
    )
}

export default MainSearch