import { useState } from "react"

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
        if (filterString.trim() === "") {
            setFilterActive(false);
        }else{
            let filtradas = values.filter( filtro => filtro.name.toLowerCase().includes(filterString) );
            setFilterValues(filtradas);
            setFilterActive(true);
        }
    }

    const handleFilterReset = (initialState) => {
        setFilterValues(initialState);
        setFilterActive(false);
    }

    return [filterValues, filterActive, filterString, handleFilterChange, handleFilterActive, handleFilterReset];
}