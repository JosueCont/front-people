const NumberFormat = ({
  prefix = null,
  suffix = null,
  number = 0,
  numberDecimal = 2,
  style = {},
  ...props
}) => {
  const numberFormat = (value) =>
    new Intl.NumberFormat("es-MX", {
      minimumFractionDigits: numberDecimal,
      maximumFractionDigits: numberDecimal,
    }).format(value);

  return (
    <>
      <span style={style}>
        {prefix && prefix + " "}
        {numberFormat(number)}
        {suffix && " " + suffix}
      </span>
    </>
  );
};

export default NumberFormat;
