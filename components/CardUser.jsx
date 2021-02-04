import { Card, Avatar } from "antd";
import {
    EditOutlined,
    EllipsisOutlined,
    SettingOutlined,
    PoweroffOutlined,
} from "@ant-design/icons";

import Router from "next/router";

const { Meta } = Card;

export default function cardUser() {
    return (
        <>
            <Card
                key="card_user"
                hoverable={true}
                style={{ width: 300 }}
                actions={[
                    <SettingOutlined key="setting" />,
                    <EditOutlined key="edit" />,
                    <PoweroffOutlined onClick={() => Router.push("/")} key="PoweroffOutlined" />,
                ]}
            >
                <Meta

                    avatar={
                        <Avatar key="avatar_user" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                    }
                    title="Card title"
                    description="This is the description"
                />
            </Card>
        </>
    );
}
