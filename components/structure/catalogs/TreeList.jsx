import React, { useMemo } from 'react';
import { Tree, Skeleton, Empty, Card } from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
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

const TreeList = ({
    list_tree = [],
    load_tree = false,
    showEditTree = () => { },
    showDeleteTree = () => { }
}) => {

    const titleRender = (item) => {
        return !load_tree ? (
            <><span role='title'>
                {item.name}
            </span> <EditOutlined
                    onClick={() => showEditTree(item)}
                /> {item?.children?.length <= 0 && (
                    <DeleteOutlined
                        style={{ marginInlineStart: 4 }}
                        onClick={() => showDeleteTree(item)}
                    />
                )}</>
        ) : <LoadItem size='small' active />
    }


    return (
        <>{list_tree.length > 0 ? (
            <Tree
                selectable={false}
                defaultExpandAll={true}
                titleRender={titleRender}
                className='ant-tree-org'
                showLine={{ showLeafIcon: false }}
                treeData={list_tree}
                fieldNames={{ title: 'name', key: 'id', children: 'children' }}
            />
        ) : (
            <Card>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </Card>
        )}
        </>
    )
}

export default TreeList;