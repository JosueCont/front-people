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
    & .ant-radio-group-solid{
        & .ant-radio-button-wrapper-checked{
            background: #252837;
            color: white!important;
            :hover{
                background: #252837;
                opacity: 0.7;
            }
        }
        & .ant-radio-button-wrapper{
            color: black;
            :hover{
                color: #1890ff;
            }
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