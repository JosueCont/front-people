import React, {useState} from 'react'

const LogoHeader = () => {

    const [mainLogo, setMainLogo] = useState(
      "https://khorplus.s3.amazonaws.com/demo/people/person/images/photo-profile/12220210623/staff_1-1.png"
    );

    return (
      <img
        style={{ float: "left", height: 60, margin: "auto" }}
        src={mainLogo}
        alt=""
      />
    );
}

export default LogoHeader
