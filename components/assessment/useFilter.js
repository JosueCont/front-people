import { useState } from "react";
import { valueToFilter } from "../../utils/functions";

/* 
Ejemplo de uso 
const [filterValues, filterActive, filterString, onFilterChange, onFilterActive, onFilterReset] = useFilter();
*/

export const useFilter = () => {
    const [filterValues, setFilterValues] = useState();
    const [filterString, setFilterString] = useState("");
    const [filterActive, setFilterActive] = useState(false);

    const handleFilterChange = ({target}) => {
        setFilterString(target.value);
    }

    const handleFilterActive = (values) => {
        if (filterString.trim()){
            let filtradas = values.filter(item => valueToFilter(item.name).includes(valueToFilter(filterString)));
            setFilterValues(filtradas);
            setFilterActive(true);
        }else{
            setFilterActive(false);
        }
    }

    const handleFilterReset = (initialState) => {
        setFilterValues(initialState);
        setFilterActive(false);
    }

    return [filterValues, filterActive, filterString, handleFilterChange, handleFilterActive, handleFilterReset];
}