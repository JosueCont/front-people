import React from 'react';
import Icon from '@ant-design/icons';
import { Tooltip } from "antd";

const PermissionIcon = (props) => {
    const PermissionSvg = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 60 60"
        >
            <g id="Page-1" fill="none" fillRule="evenodd">
                <g id="062---Invite" fill="#000" fillRule="nonzero">
                    <path
                        id="Shape"
                        d="M53 6h-3V1a1 1 0 00-2 0v5H12V1a1 1 0 00-2 0v5H7a7.008 7.008 0 00-7 7v40a7.008 7.008 0 007 7h46a7.008 7.008 0 007-7V13a7.008 7.008 0 00-7-7zm5 12H9a1 1 0 000 2h49v33a5.006 5.006 0 01-5 5H7a5.006 5.006 0 01-5-5V20h2a1 1 0 000-2H2v-5a5.006 5.006 0 015-5h3a1 1 0 002 0h36a1 1 0 002 0h3a5.006 5.006 0 015 5z"
                    ></path>
                    <path
                        id="Shape"
                        d="M11 11a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1zM49 11a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1zM40 55a1 1 0 001 1h7a1 1 0 000-2h-7a1 1 0 00-1 1zM52 56h2a1 1 0 000-2h-2a1 1 0 000 2zM16 48.19a4 4 0 006.955 2.5L30 42.945l7.04 7.745a4 4 0 105.919-5.38l-8.166-8.983a1 1 0 10-1.479 1.346l8.166 8.982a2 2 0 01-.135 2.824 2.057 2.057 0 01-2.825-.134l-7.78-8.559a1.034 1.034 0 00-1.48 0l-7.781 8.559a2.057 2.057 0 01-2.825.134 2 2 0 01-.134-2.824l8.166-8.982a1 1 0 000-1.346l-8.166-8.982a2 2 0 012.96-2.69l7.78 8.559a1.034 1.034 0 001.48 0l7.78-8.559a2 2 0 112.96 2.69l-4.529 4.982a1 1 0 101.479 1.346l4.529-4.983a4 4 0 10-5.918-5.38L30 31.055l-7.041-7.745a4 4 0 10-5.918 5.38L24.6 37l-7.554 8.31A3.974 3.974 0 0016 48.19z"
                    ></path>
                </g>
            </g>
        </svg>

    )
    const PermissionIconComponent = props => <Icon component={PermissionSvg} {...props} />;

    return (
        <Tooltip title="Solicitudes de Permisos" color="#3d78b9" key="#3d78b9"><PermissionIconComponent style={{ fontSize: '32px' }} /></Tooltip>
    )
}

export default PermissionIcon;




