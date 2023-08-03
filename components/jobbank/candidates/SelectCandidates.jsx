import React, { useEffect, useState } from 'react';
import SelectSearch from '../SelectSearch';
import WebApiJobBank from '../../../api/WebApiJobBank';

const SelectCandidates = ({
    ...props
}) => {

    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([]);

    const getOptions = async (currentNode, value) => {
        try {
            setLoading(true)
            let params = `&paginate=0&search=${value}`;
            let response = await WebApiJobBank.getCandidatesList(currentNode?.id, params);
            setOptions(response?.data || [])
            setTimeout(() => {
                setLoading(false)
            }, 500)
        } catch (e) {
            console.log(e)
            setLoading(false)
            setOptions([])
        }
    }

    return (
        <SelectSearch
            {...props}
            loading={loading}
            listOptions={options}
            getOptions={getOptions}
            getLabelOption={e => `${e?.first_name} ${e?.last_name}`}
        />
    )
}

export default SelectCandidates