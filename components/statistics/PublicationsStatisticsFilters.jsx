import React, { useState } from 'react';
import { Card, Row, Col, Input, Button, DatePicker, Select } from 'antd';
import styled from 'styled-components';

const CustomCard = styled(Card)`
    width: 100%;
    min-height: 80px;
    margin: 20px 0px;
`;
const CustomInput = styled(Input)`
    width: 90%;
    margin: auto;
    border-radius: 5px;
`;
const CustomDatePicker = styled(DatePicker)`
    width: 90%;
    margin: auto;
`;
const CustomButton = styled(Button)`
    width: 90%;
    margin: auto;
    border-radius: 5px;
    margin-top: 27px;
`;
const CustomSelect = styled(Select)`
    width: 90%;
    margin: auto;
    border-radius: 5px;
`;
const InputLabel = styled.p`
    font-size: 1em;
    font-weight: bold;
    margin-bottom: 5px;
    margin-left: 3px;
`;

const PublicationsStatisticsFilters = ({processedPublicationsList = []}) => {
    const [group, setGroup] = useState('');

    const { Option } = Select;

    function getSelectedDate(value, dateString){
        console.log(value, dateString);
    }
    
    return (
        <>
            <CustomCard>
            <Row>
                <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                    <Row>
                        <Col span={24}>
                            <InputLabel>
                                Grupo
                            </InputLabel>
                        </Col>
                        <Col span={24}>
                            <CustomSelect value={group ? group : null} placeholder="Seleccionar grupo" onChange={(value) => setGroup(value)}>
                                <Option value="HiumanLab">HiumanLab</Option>
                                <Option value="Pakal">Pakal</Option>
                            </CustomSelect>
                        </Col>
                    </Row>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                    <Row>
                        <Col span={24}>
                            <InputLabel>Fecha</InputLabel>
                        </Col>
                        <Col span={24}>
                            <CustomDatePicker onChange={getSelectedDate} format={"YYYY-MM-DD"}/>
                        </Col>
                    </Row>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                    <Row>
                        <Col span={24}>
                            <InputLabel>Autor</InputLabel>
                        </Col>
                        <Col span={24}>
                            <CustomInput placeholder="Nombre del autor"/>
                        </Col>
                    </Row>
                </Col>
                <Col xs={12} sm={6} md={4} lg={3} xl={3}>
                    <CustomButton>Filtrar</CustomButton>
                </Col>
                <Col xs={12} sm={6} md={4} lg={3} xl={3}>
                    <CustomButton>Excel</CustomButton>
                </Col>
            </Row>
            </CustomCard>
        </>
    )
}

export default PublicationsStatisticsFilters
