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

/*--------------------------------------------------------------------------------------------------------------------*/
export function splitCase(text: string): string {
  let result = text.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
 result = result.replace(/([a-z])([A-Z])/g, '$1 $2');

  return result;
}

/*--------------------------------------------------------------------------------------------------------------------*/
export function formatTimestamp(
  value: number | string | Date,
  dateTimeOptions?: Intl.DateTimeFormatOptions,
): string {
  if (!value) {
    return "";
  }

  // Define a consistent locale
  const locale = "en-US";

  // Default options - don't mix with dateStyle/timeStyle
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour12: false,
  };

  try {
    // Convert value to Date object regardless of input type
    const dateValue = value instanceof Date ? value : new Date(value);

    // Check if date is valid
    if (isNaN(dateValue.getTime())) {
      throw new Error("Invalid date");
    }

    // If dateStyle or timeStyle is provided, don't use individual options
    const finalOptions =
      dateTimeOptions?.dateStyle || dateTimeOptions?.timeStyle
        ? { ...dateTimeOptions, hour12: false }
        : { ...defaultOptions, ...dateTimeOptions };

    return new Intl.DateTimeFormat(locale, finalOptions).format(dateValue);
  } catch (e) {
    console.error("Wrong timestamp format:", value, e);
    return "🚩 Wrong time format";
  }
}