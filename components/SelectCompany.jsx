import React from "react";

export default function FooterCustom() {
  return (
    <>
      <Footer
        style={{
          textAlign: "center",
          zIndex: 1,
          bottom: 0,
          width: "100%",
        }}
      >
        Created by{" Human"}
        <DingtalkOutlined />
      </Footer>
    </>
  );
}
