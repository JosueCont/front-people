import React, { Fragment } from 'react';
import { Row, Col, Skeleton, Tooltip } from 'antd';
import { useSelector } from 'react-redux';
import Clipboard from 'react-clipboard.js';
import _ from 'lodash';
import { ContentState, convertFromHTML, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";

const TagsNotify = () => {

    const {
        list_tags_notification,
        load_tags_notification
    } = useSelector(state => state.jobBankStore);

    return (
        <Skeleton loading={load_tags_notification} active>
            <Row gutter={[8,8]} className='vacant-list-fields'>
                {list_tags_notification.length > 0 && (
                    <Col span={24}>
                         <div style={{background: '#f0f0f0', padding: '8px', borderRadius: '12px'}}>
                            <Row gutter={[8,0]} className='section-list-fields'>
                                {_.chunk(list_tags_notification, Math.ceil(list_tags_notification.length/4)).map((record, idx) => (
                                    <Col
                                        xs={24} md={12} lg={8} xl={6}
                                        key={"record_"+idx}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 8
                                        }}
                                    >
                                        {record.map((item, idx) => (
                                            <Tooltip title={item.tag_name} key={"tag_"+idx}>
                                               <div className='btn-tag-copy'>
                                                    <Clipboard data-clipboard-text={`{{${item.tag_name}}}`}>
                                                        {item.tag_name}
                                                    </Clipboard>
                                                </div> 
                                            </Tooltip>
                                        ))}
                                    </Col>
                                ))}
                            </Row>
                         </div>
                    </Col>
                )}
            </Row>
        </Skeleton>
    )
}

export default TagsNotify