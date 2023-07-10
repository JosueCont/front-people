import React, { useState, useEffect } from 'react';
import { Empty } from 'antd';
import {
    CardInfo,
    CardItem,
    CardScroll
} from './Styled';
import _ from 'lodash';
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
import ChartDoughnut from '../dashboards-cards/ChartDoughnut';

const WidgetGeneration = () => {

    const {
        user,
        current_node
    } = useSelector(state => state.userStore);

    const [loading, setLoading] = useState(false);
    const [generation, setGeneration] = useState({});
    const [max, setMax] = useState("");

    useEffect(() => {
        if (!current_node) return;
        getGeneration()
    }, [current_node])

    const getGeneration = async () => {
        try {
            setLoading(true)
            let params = '&widget_code=PEOPLE_BY_GENERATION';
            let response = await WebApi.getDashboardDataWidget(current_node?.id, params)
            setLoading(false)
            if (response.data) {
                let dataD = { ...response.data };
                dataD.datasets = [
                    {
                        label: '# of Votes',
                        data: response?.data?.data,
                        backgroundColor: [
                            'rgba(208, 0, 0,1)',
                            'rgba(255, 186, 8,1)',
                            'rgba(63, 136, 197,1)',
                            'rgb(196,9,203)',
                            'rgba(19, 111, 99,1)',
                            'rgb(105,199,16)',
                        ]
                    }
                ]
                if (dataD?.data) {
                    // conseguimos cual se repite mas
                    let maximo = _.max(dataD.data);
                    let maxIdx = dataD.data.findIndex((ele) => ele === maximo)
                    setMax(dataD?.labels[maxIdx])
                }
                setGeneration(dataD)
            } else {
                setGeneration({})
            }
        } catch (e) {
            console.log(e)
            setLoading(false)
            setGeneration({})
        }
    }

    const Void = (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<FormattedMessage id={'nodata'} />} />
    )

    return (
        <CardInfo>
            <CardItem jc='center' hg='100%' title={<>
                <img src='/images/people.png' />
                <p><FormattedMessage id={'generations'} /></p>
            </>}>
                {!loading ? <div className="card-chart">
                    {generation?.data?.some(item => item > 0) ? (
                        <>
                            <ChartDoughnut data={generation} />
                            <p style={{ marginBottom: 0, marginTop: 24, textAlign: 'center' }}>
                                <FormattedMessage id={'dashboard.predominant'} /> : {max}
                            </p>
                        </>
                    ) : Void}
                </div> : <LoadingOutlined className="card-load" spin />
                }
            </CardItem>
        </CardInfo>
    )
}

export default WidgetGeneration