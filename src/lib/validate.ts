export const isFindName = (name?: string) => {
  if (!name) {
    return false;
  }

  if (name.includes(".fn")) {
    return false;
  }

  const noSpaces = name.replace(/\s/g, "");
  const lengthMatcher = /^[a-z0-9-.]{3,16}$/;
  if (lengthMatcher.test(noSpaces)) {
    return true;
  }

  const suffixMatcher = /^[a-z0-9-]{3,16}.find$/;
  const prefixMathcer = /^find:[a-z0-9-]{3,16}$/;
  return suffixMatcher.test(noSpaces) || prefixMathcer.test(noSpaces);
};

export const isFlownsName = (domainName: string) => {
  if (domainName.includes(".find")) {
    return false;
  }
  const noSpaces = domainName.replace(/\s/g, "");
  const matcher = /^([a-z0-9\-_]{1,30})\.([a-z0-9\-_]{1,10})$/;
  return matcher.test(noSpaces);
};

export function isBlockHeight(value: string) {
  if (value === "") {
    return false;
  }
  const isNumber = /^[0-9]*$/.test(value);
  // TODO: Add minimal block height
  const parsed = parseInt(value);
  const smaller = parsed < 7601063;
  if (smaller) {
    return false;
  }
  return isNumber;
}

export function isAddress(value: string) {
  const validLength = value.startsWith("0x") ? [17, 18] : [15, 16];
  return validLength.includes(value.length) && !value.includes(".");
}

export function isHash(value: string) {
  // TODO: add regex to check actual hash
  return value.length === 64;
}

export function isAccount(value: string) {
  const parts = value.split(".");
  if (value.toLowerCase().startsWith("a.")) {
    if (parts.length === 2 && parts[1] !== "") {
      return true;
    }
  }

  return false;
}

export function isContract(value: string) {
  const parts = value.split(".");
  if (value.toLowerCase().startsWith("a.")) {
    if (parts.length === 3) {
      return true;
    }
  }

  return false;
}

export function sanitizeHash(id: string) {
  const hash = decodeURI(id).replace(/["']/g, "");

  if (hash.startsWith("0x")) {
    return hash.slice(2);
  }

  return hash;
}

export function withPrefix(address: string) {
  if (isAddress(address)) {
    const temp = address.startsWith("0x") ? address.slice(2) : address;
    return "0x" + temp.padStart(16, "0");
  }
  return address;
}
