import React from 'react';

export const useProcessInfo = () => {

    const formatData = (values, checked = true, extraKey = '') => {
        return Object.entries(values).reduce((obj, [key, val]) => {
            if(!Array.isArray(val)) return obj;
            let results = val.reduce((prev, current) =>{
                let field = extraKey ? current[extraKey] : current;
                let name = `${key}|${field}`;
                return {...prev, [name]: checked };
            }, {});
            return {...obj, ...results};
        }, {});
    }

    const createData = (values, keyConfig) =>{
        return Object.entries(values).reduce((obj, [key, val])=> {
            if(!val) return obj;
            if(!key.includes('|')) return {...obj, [key]: val == 'open_fields' ? '' : val};
            let fields = obj[keyConfig] ?? {};
            let name = key.split('|');
            let prev = fields[name[0]] ?? [];
            let item = [...prev, name[1]];
            let config = {...fields, [name[0]]: item};
            return {...obj, [keyConfig]: config};
        }, { [keyConfig]: {} });
    }

    return {
        formatData,
        createData
    }
}