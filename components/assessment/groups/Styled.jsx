import styled from '@emotion/styled';
import {
    Form,
    Input,
    Button,
    Modal,
    Row,
    Col,
    Space,
    Select,
    Table,
    Checkbox,
    message,
    Radio
} from "antd";

export const CustomContent = styled.div`
    max-height: calc(100vh - 400px)!important;
    overflow-y: auto!important;
`;

export const CustomModal = styled(Modal)`
    & .ant-modal-content{
        background: #F0F0F0;
    }
`;

export const CustomInput = styled(Input)`
    border: 1px solid #252837;
`;

export const ColButtons = styled(Col)`
    display: flex;
    justify-content: flex-end;
    & .ant-radio-group{
        & .ant-radio-button-wrapper{
            color: #000000;
            :hover{
                color: #1890ff;
            }
        }
        .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)::before {
            background-color: transparent;
        }
        & .ant-radio-button-wrapper-checked:not([class*=' ant-radio-button-wrapper-disabled']).ant-radio-button-wrapper:first-child {
            border-right-color: #8e88e7;
            background-color: #8e88e7;
            color: white!important;
            border-color: #8e88e7;
        }
        & .ant-radio-button-wrapper-checked:not([class*=' ant-radio-button-wrapper-disabled']).ant-radio-button-wrapper:last-child {
            border-right-color: #e7b488;
            background-color: #e7b488;
            color: white!important;
            border-color: #e7b488;
        }
    }
`;

export const CustomCheck = styled(Checkbox)`
    color: black!important;
`;

export const CheckAll = styled(CustomCheck)`
    color: black!important;
    padding-top: 16px;
    padding-left: 16px;
`;

export const ButtonDanger = styled(Button)`
    background: #dc3545!important;
    border: none;
    border-radius: 10px!important;
`;

export const ButtonTransparent = styled(Button)`
    background: transparent;
    border: none;
    border-radius: 5px!important;
`;

export const DeleteAll = styled(Button)`
    background: #dc3545!important;
    border: none;
    border-radius: 10px!important;
    margin-top: 16px;
    margin-right: 16px;
`;

export const CompactSelect = styled(Select)`
    width: calc(100% - 32px)!important;
    & .ant-select-selector {
        border-top-left-radius: 10px!important;
        border-bottom-left-radius: 10px!important;
    }
`;

export const CompactButton = styled(Button)`
    border-top-right-radius: 10px!important;
    border-bottom-right-radius: 10px!important;
`;

export const ColTabs = styled(Col)`
    & .ant-tabs-content-holder{
        border-radius: 12px;
        background: #FAFAFA;
    }
`;

export const CustomTable = styled(Table)`
    & .ant-table-body {
        max-height: calc(100vh - 400px)!important;
        overflow-y: auto!important;
    }
`;