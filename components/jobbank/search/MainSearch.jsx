import React from 'react';
import AutoRegister from '../AutoRegister';
import {
    SearchLayout,
    ContentVertical,
    SearchLogo,
    FeaturesText,
    ContentPrivacy
} from './SearchStyled';
import { Image } from 'antd';

const MainSearch = ({
    children,
    currentNode,
    showLogo = true
}) => {
    return (
        <SearchLayout>
            <AutoRegister
                currentNode={currentNode}
                logoAlign='right'
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
                            <Image
                                src='/images/portadaHex.png'
                                preview={false}
                            />
                        </SearchLogo>
                        {children}
                    </ContentVertical>
                ) : children}
            </AutoRegister>
        </SearchLayout>
    )
}

export default MainSearch