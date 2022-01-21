import React, {useEffect, useState} from 'react'
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import {Breadcrumb, Row, Col, Typography, Button, Divider, Card, Dropdown, Menu} from 'antd';
import { css, Global } from "@emotion/core";

const Info = ({title, icon, count=0, onOk=null, okText=null, ...props}) => {
    const {Title, Text} = Typography

    return (
        <>
            <Global
                styles={css`
                    .title_card_dashboard{
                        height: auto;
                        margin-bottom:5px;
                    }
                    .card_element_icon{
                        margin-bottom: auto;
                    }

                    .btn_hide{
                        margin-left:auto;
                        margin-bottom: auto;
                        margin-top:10px; 
                        border-radius:3px;
                        border:none;
                        background-color:gray !important;
                    }
                    .btn_ok{
                        position: absolute;
                        bottom: 10px;
                        right: 15px;
                        border-radius:3px;
                        border:none;
                        background-color:gray !important;
                    }
                `}
            />
            <div style={{ justifyContent:"space-between", display:'flex'}}>
                <div className="title_card_dashboard">
                    <Text>
                        <span className="card_element_icon">
                            {icon}
                        </span>
                        <span className="card_element_text">
                            {title}
                            <Title level={2} style={{margin:0}}>
                                {count}
                            </Title>
                        </span>
                    </Text>
                </div>
                <div>
                <Button className="btn_hide" size="small" >
                    Ocultar
                </Button>
                {
                    onOk &&
                    <Button className="btn_ok" size="small"  >
                        {okText ? okText : 'Ok'}
                    </Button>
                }
                </div>
            </div> 
        </>
    )
}

export default Info
