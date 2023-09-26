import Link from 'next/link'
import { Tooltip } from 'antd';
import {  LinkOutlined } from "@ant-design/icons";

const LinkToPerson = ({personId}) => {
      return   <a href={`/home/persons/${personId}`} passHref target="_blank" >
            <Tooltip placement="bottom" title={'Ver detalle de persona'}>
                <a><LinkOutlined /></a>
            </Tooltip>
        </a>
}

export default LinkToPerson