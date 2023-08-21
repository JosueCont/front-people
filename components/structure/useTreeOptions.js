export const useTreeOptions = () =>{

    const GetName = ({ item }) => {
        let color = 'rgba(0, 0, 0, 0.25)';
        return (
            <>{item.name} {!item?.is_active &&
                <span style={{ color }}>
                    (Inactivo)
                </span>
            }</>
        )
    }

    const getOptionsEdit = ({
        list_tree = [],
        value = null,
        exclude = true
    }) => {
        let depth = null;

        const formatEdit = (item, depth, pos) => {
            const some_ = record => record?.id == value;
            const filter_ = record => record?.id != value;
            const format = record => (formatEdit(record, depth, pos + 1));
    
            let exist = item?.children?.some(some_);
            let parent = exist && exclude? item?.children?.filter(filter_) : item?.children;
            let results = depth == pos ? [] : parent?.map(format);
    
            return {
                value: item?.id,
                title: <GetName item={item}/>,
                name: item?.name,
                children: results
            }
        }

        // Obtenemos la profundidad del nivel a editar
        const getDepth = (item, idx = []) => {
            let valid = item?.id == value;
            if (valid) return depth = idx;
            return item?.children?.forEach((record, index) => {
                return getDepth(record, [...idx, index]);
            })
        }

        list_tree.forEach((item, idx) => {
            let valid = item?.id == value;
            if (!valid) return getDepth(item, [idx]);
            return depth = [idx];
        })

        return list_tree.reduce((acc, item) => {
            if (item?.id == value) return acc;
            return [...acc, formatEdit(item, depth?.length, 1)]
        }, [])
    }
    
    const formatAdd = (item) => {
        const map_ = record => (formatAdd(record));
        let children = item?.children?.length > 0
            ? item?.children?.map(map_) : [];
        return {
            value: item?.id,
            title: <GetName item={item}/>,
            name: item?.name,
            children
        }
    }

    return {
        getOptionsEdit,
        formatAdd
    }

}