import React, { useMemo } from 'react'
import { Tree, Skeleton } from 'antd'
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
import styled from '@emotion/styled';

const LoadItem = styled(Skeleton.Input)`
    border-radius: 12px;
    height: 27px;
    & .ant-skeleton-input-sm {
        vertical-align: middle;
        height: 1.25rem;
        line-height: 1.25rem;
    }
`;

const TreeLevels = ({
    list_org_levels_tree,
    load_org_levels_options,
    showEditTree = () => { },
    showDeleteTree = () => { }
}) => {

    const titleRender = (item) => {
        return !load_org_levels_options ? (
            <><span role='title'>
                {item.name}
            </span> <EditOutlined
                onClick={()=> showEditTree(item)}
            /> {item?.children?.length <= 0 && (
                <DeleteOutlined
                    style={{marginInlineStart: 4}}
                    onClick={()=> showDeleteTree(item)}
                />
            )}</>
        ) : <LoadItem size='small' active />
    }
    

    return (
        <Tree   
            selectable={false}
            defaultExpandAll={true}
            titleRender={titleRender}
            className='ant-tree-org'
            showLine={{ showLeafIcon: false }}
            treeData={list_org_levels_tree}
            fieldNames={{ title: 'name', key: 'id', children: 'children' }}
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