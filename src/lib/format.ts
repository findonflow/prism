function getLocale(): string {
  // TODO: read local on client side
  const locale = "en-GB"; // navigator?.language || "en-GB";
  return locale;
}
/*--------------------------------------------------------------------------------------------------------------------*/
export const formatNumberToAccounting = (
  value: number | undefined,
  maxDecimals = 0,
  minDecimals = 0,
) => {
  let valueToFormat = typeof value === "string" ? Number(value) : value;
  valueToFormat = valueToFormat === undefined ? 0 : valueToFormat;

  return new Intl.NumberFormat(getLocale(), {
    currencySign: "accounting",
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: minDecimals,
    roundingMode: "halfFloor",
  }).format(valueToFormat);
};

/*--------------------------------------------------------------------------------------------------------------------*/
export const formatToFlowValue = (value: number, precission = 2) => {
  return new Intl.NumberFormat(getLocale(), {
    currencySign: "accounting",
    minimumFractionDigits: precission,
    maximumFractionDigits: precission,
  }).format(value);
};

/*--------------------------------------------------------------------------------------------------------------------*/
export function formatBytesToStorageString(value: number) {
  const kb = 1024;
  const mb = kb * 1024;
  const gb = mb * 1024;

  let extension = "";
  let size = value;

  if (value < kb) {
    extension = " bytes";
  } else if (value < mb) {
    extension = " KB";
    size = value / kb;
  } else if (value < gb) {
    extension = " MB";
    size = value / mb;
  } else {
    extension = " GB";
    size = value / gb;
  }

  return {
    size,
    extension,
  };
}
