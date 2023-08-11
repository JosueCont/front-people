import React, { useMemo } from 'react'
import { Tree } from 'antd'
import { connect } from 'react-redux'
import {
    DeleteOutlined,
    EditOutlined,
    LoadingOutlined,
    NodeExpandOutlined,
    PlusOutlined,
    SearchOutlined,
    SyncOutlined,
    SettingOutlined,
    StopOutlined,
    TableOutlined,
    PlusCircleOutlined
} from '@ant-design/icons';

const TreeLevels = ({
    list_org_levels_tree,
    load_org_levels_options
}) => {

    const formatData = (item) => {
        let parent = item?.children;
        const map_ = record => (formatData(record));
        let children = parent?.length > 0 ? parent.map(map_) : [];
        return {
            value: item?.id,
            title: item?.name,
            // disabled: !item?.is_active,
            children
        }
    }

    const treeData = useMemo(() => {
        if (list_org_levels_tree.length <= 0) return [];
        const reduce_ = (acc, item) => ([...acc, formatData(item)])
        return list_org_levels_tree.reduce(reduce_, []);
    }, [list_org_levels_tree])

    return (
        <Tree
            className='ant-tree-org'
            showLine={{ showLeafIcon: false }}
            treeData={treeData}
        />
    )
}

const mapState = (state) => {
    return {
        list_org_levels_tree: state.orgStore.list_org_levels_tree,
        load_org_levels_options: state.orgStore.load_org_levels_options,
        currentNode: state.userStore.current_node,
    }
}

export default connect(
    mapState
)(TreeLevels);