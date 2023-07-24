import React, { useState, useEffect } from 'react';
import { Statistic } from 'antd';
import {
    CardInfo,
    CardItem,
    CardScroll
} from './Styled';
import {
    ReloadOutlined,
    ManOutlined,
    WomanOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import WebApi from '../../api/webApi';
import {
    injectIntl,
    FormattedMessage
} from 'react-intl';

const WidgetGender = () => {
    
    const {
        user,
        current_node
    } = useSelector(state => state.userStore);

    const [loading, setLoading] = useState(false);
    const [genders, setGenders] = useState(0);

    useEffect(()=>{
        if(!current_node) return;
        getGenders()
    },[current_node])

    const getGenders = async () =>{
        try {
            setLoading(true)
            let params = '&widget_code=PEOPLE_BY_GENDER';
            let response = await WebApi.getDashboardDataWidget(current_node?.id, params)
            setLoading(false)
            setGenders(response.data?.data)
        } catch (e) {
            console.log(e)
            setLoading(false)
            setGenders(0)
        }
    }

    return (
        <CardItem hg='50%' title={<>
            <img src='/images/bygender.png'/>
            <p><FormattedMessage id={'gender'}/></p>
        </>}>
            {!loading ?
                <>
                    <Statistic
                        style={{marginInlineEnd: 24}}
                        prefix={<ManOutlined style={{color:'#2351FC'}} />}
                        title={<FormattedMessage id={'male'}/>}
                        value={genders['Masculino'] ?? 0}
                    />
                    <Statistic
                        style={{marginInlineEnd: 24}}
                        prefix={<WomanOutlined style={{color:'#EC23FC'}}/>}
                        title={<FormattedMessage id={'female'}/>}
                        value={genders['Femenino'] ?? 0}
                    />
                    <Statistic title={<FormattedMessage id={'other'}/>} value={genders['Otro'] ?? 0} />
                </>  : <LoadingOutlined className="card-load"  spin />
            }
        </CardItem>
    )
}

export default WidgetGender