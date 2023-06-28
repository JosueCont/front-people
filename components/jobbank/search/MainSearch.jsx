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
import WebApiJobBank from '../../../api/WebApiJobBank';

const MainSearch = ({
    children,
    showLogo = true,
}) => {

    const [setup, setSetup] = useState({});

    useEffect(() => {
        getSetupConfig()
    }, [])

    const getSetupConfig = async () => {
        try {
            let response = await WebApiJobBank.getSetupConfig();
            setSetup(response.data)
        } catch (e) {
            console.log(e)
            setSetup({})
        }
    }

    return (
        <SearchLayout>
            <AutoRegister
                currentNode={setup?.node}
                logoAlign='right'
                secondaryLogo={setup?.logo}
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
                                src={setup?.banner ? setup?.banner : '/images/portadaHex.png'}
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