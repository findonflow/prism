const ERROR_CODES = {
  "1006": {
    title: "INVALID_KEY",
    description: "One of the keys used in this transaction is not valid.",
  },
  "1007": {
    title: "NOT_SUBMITTED",
    description:
      "This transaction was not submitted because it was sent to the blockchain with a key that already has a pending transaction.",
  },
  "1008": {
    title: "INVALID_KEY",
    description: "One of the keys used in this transaction is not valid.",
  },
  "1009": {
    title: "INVALID_KEY",
    description:
      "This transaction was not submitted because it was sent to the blockchain with a key that is invalid. Double check the signing/hashing algorithms.",
  },
  "1052": {
    title: "WRONG_ARGUMENTS",
    description: "One of the arguments sent into this transaction is wrong.",
  },
  "1055": {
    title: "NOT_AUTHORISED",
    description: "This transaction does not have enough signatures to be sent.",
  },
  "1056": {
    title: "NOT_PERMITTED",
    description: "This transaction is trying to do something it is not allowed to do.",
  },
  	"1101": {
		title: "CODE_ERROR",
		description: "There is an error in the cadence code of this transaction.",
	},
  "1103": {
    title: "NO_STORAGE",
    description:
      "One of the accounts in this transaction does not have enough flow to pay for storage. Ensure that the account you are adding data to has enough flow before trying again.",
  },
  "1105": {
    title: "TOO_MANY_EVENTS",
    description: "This transaction is too complex, it tries to send to many events.",
  },
  "1110": {
    title: "TOO_COMPLEX",
    description:
      "This transaction is too complex it does too much logic or read/write to much data.",
  },
  "1111": {
    title: "TOO_COMPLEX",
    description: "This transaction ran out of memory in the execution phase.",
  },
  "1118": {
    title: "CANNOT_PAY",
    description: "The payer of this transaction does not have enough funds to send it.",
  },
  "1201": {
    title: "ACCOUNT_NOT_FOUND",
    description: "One account referred to in this transaction cannot be found.",
  },
  "1202": {
    title: "INVALID_KEY",
    description: "One of the keys used in this transaction is not valid.",
  },
};

/*--------------------------------------------------------------------------------------------------------------------*/
const GENERIC_ERROR = {
  title: "Error",
  description: "Whoops! 😨 Something unexpected happened...",
};

/*--------------------------------------------------------------------------------------------------------------------*/
export function extractCode(errorMessage: string){
  const errorExtract = /\[Error Code: (\d+)]/.exec(errorMessage);

  return errorExtract ? errorExtract[1] : undefined;
}

export function getErrorInfo(code: string | undefined) {
  if (!code) {
    return GENERIC_ERROR;
  }

  return ERROR_CODES[code as keyof typeof ERROR_CODES] || GENERIC_ERROR;
}
