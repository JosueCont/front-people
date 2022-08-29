import React, { useState, useEffect } from 'react';
import { getProfiles } from '../../redux/assessmentDuck';
import { connect } from 'react-redux';
import { Form, Select } from 'antd';
import { ruleRequired } from '../../utils/rules';
const { Option } = Select;

const SelectProfile = ({
    name = 'skill_profile_id',
    label = 'Perfil de competencias',
    multiple = false,
    placeholder = 'Perfil de competencias',
    curretNode,
    profiles,
    load_profiles,
    getProfiles,
    ...props
}) => {
    
    useEffect(()=>{
        if(curretNode) getProfiles(curretNode.id,'');
    },[curretNode])

    return (
        <Form.Item
            name={name}
            label={label}
        >
            <Select
                showArrow
                loading={load_profiles}
                mode={multiple && 'multiple'}
                style={{ width: "100%" }}
                placeholder={placeholder}
                notFoundContent="No se encontraron resultados"
                showSearch
                optionFilterProp="children"
            >
                {profiles.length > 0 && profiles.map((item) => (
                    <Option key={item.id} value={item.id}>
                        {item.name}
                    </Option>
                ))}
            </Select>
        </Form.Item>
    )
}

const mapState = (state) => {
    return {
        profiles: state.assessmentStore.profiles,
        load_profiles: state.assessmentStore.load_profiles
    };
};

export default connect(mapState, { getProfiles })(SelectProfile);