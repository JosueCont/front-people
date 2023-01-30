import React from 'react';
import { Col, Form, Input, InputNumber } from 'antd';
import { validateNum, validateMaxLength } from '../../utils/functions';

const RangeAge = ({
    minAgeRequired = true,
    maxAgeRequired = true,
    minAgeKey = 'age_min',
    maxAgeKey = 'age_max',
    minAgeNum = 18,
    maxAgeNum = 90,
    sizeCol = { xs: 24, md: 12, xl: 8, xxl: 6 },
    label = 'Rango de edad'
}) => {

    const noValid = [undefined,null,''];

    const styleDisabled = {
        width: 32,
        borderRight: 0,
        borderLeft: 0,
        pointerEvents: 'none',
        textAlign: 'center',
        background: '#ffff'
    }

    const minAge = ({getFieldValue}) => ({
        validator(_, value){
            if(!value) return Promise.resolve();
            let min_age = parseInt(value);
            let max_age = getFieldValue(maxAgeKey);
            if(min_age < 18) return Promise.reject('Edad mínima mayor o igual a 18');
            if(noValid.includes(max_age) && maxAgeRequired) return Promise.reject('Edad máxima requerida');
            if(!noValid.includes(max_age) && min_age > max_age) return Promise.reject('Edad máxima debe ser mayor a edad mínima');
            return Promise.resolve();
        }
    })

    const maxAge = ({getFieldValue}) => ({
        validator(_, value){
            if(!value) return Promise.resolve();
            let max_age = parseInt(value);
            let min_age = getFieldValue(minAgeKey);
            if(max_age > 90) return Promise.reject('Edad máxima menor o igual a 90');
            if(noValid.includes(min_age) && minAgeRequired) return Promise.reject('Edad mínima requerida');
            return Promise.resolve();
        }
      })

    return (
        <Col {...sizeCol} className='range_age_content'>
            <Form.Item label={label}>
                <Input.Group compact>
                    <Form.Item
                        name={minAgeKey}
                        noStyle
                        rules={[minAge]}
                        dependencies={[maxAgeKey]}
                    >
                        <InputNumber
                            type='number'
                            maxLength={2}
                            min={minAgeNum}
                            max={maxAgeNum}
                            controls={false}
                            className='min_age'
                            onKeyDown={validateNum}
                            onPaste={validateNum}
                            onKeyPress={validateMaxLength}
                            placeholder='Edad mínima'
                        />
                    </Form.Item>
                    <Input
                        style={styleDisabled}
                        placeholder='-'
                        disabled
                    />
                    <Form.Item
                        name={maxAgeKey}
                        noStyle
                        rules={[maxAge]}
                        dependencies={[minAgeKey]}
                    >
                        <InputNumber
                            type='number'
                            min={minAgeNum}
                            max={maxAgeNum}
                            maxLength={2}
                            controls={false}
                            className='max_age'
                            onKeyDown={validateNum}
                            onPaste={validateNum}
                            onKeyPress={validateMaxLength}
                            placeholder='Edad máxima'
                        />
                    </Form.Item>
                </Input.Group>
            </Form.Item>
        </Col>
    )
}

export default RangeAge