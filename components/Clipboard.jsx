import { message } from "antd";
import ClipboardButton from "react-clipboard.js";
import { LinkOutlined } from "@material-ui/icons";

const Clipboard = ({
  text = "Text to copy",
  msg = "",
  type = "button",
  tooltipTitle = "Tooltip title",
  border = true,
  title = null,
  ...props
}) => {
  const copyText = (value) => {
    message.success(`${msg}: ${value.text}`);
  };

  return (
    <>
      <ClipboardButton
        className={
          border
            ? "btn-copy-text tooltip"
            : "btn-copy-text tooltip btn-copy-text-noborder"
        }
        data-clipboard-text={text}
        onSuccess={(value) => copyText(value)}
      >
        <span className="tooltiptext">{tooltipTitle}</span>
        {title ? <span>{title}</span> : <LinkOutlined />}
      </ClipboardButton>
    </>
  );
};

export default Clipboard;
