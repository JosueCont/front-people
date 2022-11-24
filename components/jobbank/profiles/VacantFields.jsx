import React, { useState, useEffect, Fragment } from 'react';
import {
    Row,
    Col,
    Checkbox,
    Form,
    Divider,
    Skeleton
} from 'antd';
import { useSelector } from 'react-redux';
import _ from 'lodash';

const VacantFields = ({
    disabledField = false
}) => {
    
    const {
        load_vacancies_fields,
        list_vacancies_fields
    } = useSelector(state => state.jobBankStore);

    const titleSection = {
        main: 'Características del puesto',
        education_and_competence: 'Educación, competencias y habilidades',
        salary_and_benefits: 'Sueldo y prestaciones',
        recruitment_process: 'Proceso de reclutamiento'
    }

    return (
        <Skeleton loading={load_vacancies_fields} active>
            <Row gutter={[8,8]} className='vacant-list-fields'>
                {Object.keys(list_vacancies_fields).length > 0
                    && Object.entries(list_vacancies_fields).map(([key, val], idx) => (
                    <Fragment key={`section_${idx}`}>
                        <Divider style={{marginBottom: 0}} key={`divider_${idx}`} plain>
                            {titleSection[key]}
                        </Divider>
                        <Col key={`col_${idx}`} span={24}>
                            <div style={{background: '#f0f0f0', padding: '8px 16px', borderRadius: '12px'}}>
                                <Row gutter={[8,0]} className='section-list-fields'>
                                    {Array.isArray(val) && _.chunk(val, Math.ceil(val.length/4)).map((record, idx) => (
                                        <Col xs={24} md={12} lg={8} xl={6} key={`record_${idx}`} style={{display: 'flex', flexDirection: 'column'}}>
                                            {record.map((item, index) => (
                                                <Form.Item name={`${key}|${item.field}`} key={`item_${idx}_${index}`} valuePropName='checked' noStyle>
                                                    <Checkbox style={{marginLeft: 0}} disabled={disabledField}>
                                                        {item.name}
                                                    </Checkbox>
                                                </Form.Item>
                                            ))}
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        </Col>
                    </Fragment>
                ))}
            </Row>
        </Skeleton>
    )
}

export default VacantFields