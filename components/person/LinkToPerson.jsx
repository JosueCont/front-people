import Link from 'next/link'
import { Tooltip } from 'antd';
import {  LinkOutlined } from "@ant-design/icons";

const LinkToPerson = ({personId}) => {
      return   <Link href={`/home/persons/${personId}`} passHref>
            <Tooltip placement="bottom" title={'Ver detalle de persona'}>
                <a><LinkOutlined /></a>
            </Tooltip>
        </Link>
}

export default LinkToPerson