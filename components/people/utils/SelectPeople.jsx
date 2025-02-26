import React, {
    useState
} from 'react';
import { getFullName } from '../../../utils/functions';
import WebApiPeople from '../../../api/WebApiPeople';
import SelectSearch from '../../jobbank/SelectSearch';

const SelectPeople = ({
    ...props
}) => {

    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([]);

    const getOptions = async (currentNode, value) => {
        try {
            setLoading(true)
            let params = `&paginate=0&search=${value}`;
            let response = await WebApiPeople.getCollaborators(currentNode?.id, params);
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
            getLabelOption={getFullName}
        />
    )
}

export default SelectPeople