type CadenceField = {
  id: string;
  type: any;
};

export type CadenceType = {
  kind: string;
  typeID?: string;
  fields?: CadenceField[];
};

/**
 * Parses "A.3abff1de88b1063b.DAO.Topic" into { name: "DAO", address: "0x3abff1de88b1063b" }
 */
const parseTypeID = (typeID: string) => {
  const parts = typeID.split(".");
  if (parts.length >= 3) {
    return {
      address: `0x${parts[1]}`,
      contractName: parts[2],
    };
  }
  return null;
};

const getTypeName = (typeObj: any): string => {
  if (typeof typeObj === "string") return typeObj;
  if (typeObj.kind === "Resource" || typeObj.kind === "Struct") {
    return typeObj.typeID
      ? typeObj.typeID.split(".").slice(2).join(".")
      : "Any";
  }
  return typeObj.kind;
};

/**
 * Recursively scans the schema for all unique contracts that need to be imported.
 */
const collectImports = (
  schema: CadenceType,
  imports: Map<string, string> = new Map(),
) => {
  if (schema.typeID) {
    const info = parseTypeID(schema.typeID);
    if (info) imports.set(info.contractName, info.address);
  }

  schema.fields?.forEach((field) => {
    if (field.type.kind === "Resource" || field.type.kind === "Struct") {
      collectImports(field.type, imports);
    }
  });
  return imports;
};

const emitExtraction = (
  fields: CadenceField[],
  sourceVar: string,
  targetDict: string,
  blacklist: Array<string>, // Added blacklist param
  indent: string = "        ",
): string => {
  return fields
    .filter((field) => !blacklist.includes(field.id)) // Filter out the "illegal" fields
    .map((field) => {
      const isResource = field.type.kind === "Resource";
      const typeName = getTypeName(field.type);

      if (isResource) {
        const nestedVar = `${sourceVar}_${field.id}`;
        const nestedDict = `${targetDict}_${field.id}`;
        return `
${indent}let ${nestedDict}: {String: AnyStruct} = {}
${indent}if let ${nestedVar} = &${sourceVar}.${field.id} as &${typeName} {
${field.type.fields ? emitExtraction(field.type.fields, nestedVar, nestedDict, blacklist, indent + "    ") : ""}
${indent}}
${indent}${targetDict}["${field.id}"] = ${nestedDict}`;
      }

      return `${indent}${targetDict}["${field.id}"] = ${sourceVar}.${field.id}`;
    })
    .join("\n");
};

/**
 * Final Generator
 */
export const generateCadenceScript = (
  schema: CadenceType,
  address: string,
  path: string,
  blackList: Array<string>,
): string => {
  const rootType = getTypeName(schema);

  // Collect and format imports
  const importMap = collectImports(schema);
  const importStatements = Array.from(importMap.entries())
    .map(([name, addr]) => `import ${name} from ${addr}`)
    .join("\n");

  const extractionLogic = emitExtraction(
    schema.fields || [],
    "rootRef",
    "results",
    blackList,
  );

  return `
${importStatements}

access(all) fun main(): {String: AnyStruct} {
    let account = getAuthAccount<auth(Storage, Capabilities, BorrowValue) &Account>(${address})
    let path = StoragePath(identifier: "${path}")!
    let results: {String: AnyStruct} = {}

    if let rootRef = account.storage.borrow<&${rootType}>(from: path) {
${extractionLogic}
    }

    return results
}`.trim();
};

export const extractRestrictedFields = (errorMessage: string): string[] => {
  const regex = /cannot access `([^`]+)` because/g;
  const matches = [];
  let match;
  while ((match = regex.exec(errorMessage)) !== null) {
    matches.push(match[1]);
  }
  return matches;
};

// --- Usage ---
// const resourceSchema: CadenceType = {"kind":"Resource","typeID":"A.3abff1de88b1063b.DAO.Topic","fields":[{"type":{"kind":"UInt64"},"id":"uuid"},{"type":{"kind":"String"},"id":"title"},{"type":{"kind":"Resource","typeID":"A.3abff1de88b1063b.DAO.Vault","fields":[{"id":"balance","type":{"kind":"UFix64"}}]},"id":"internalVault"}]};
// console.log(generateCadenceScript(resourceSchema, "0x3abff1de88b1063b", "daoTopicPath"));
