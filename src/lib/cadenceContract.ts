export type CadenceContractInfo = {
  name: string;
  kind: "contract" | "contractInterface";
};

function stripCadenceNoise(code: string): string {
  const withoutStrings = code.replace(/"(?:\\.|[^"\\])*"/g, "\"\"");
  const withoutBlockComments = withoutStrings.replace(/\/\*[\s\S]*?\*\//g, "");
  const withoutLineComments = withoutBlockComments.replace(/\/\/[^\n\r]*/g, "");
  return withoutLineComments;
}

export function extractCadenceContract(code: string): CadenceContractInfo | null {
  const src = stripCadenceNoise(code);
  const iface = src.match(/\bcontract\s+interface\s+([A-Za-z_][A-Za-z0-9_]*)/im);
  if (iface && iface[1]) {
    return { name: iface[1], kind: "contractInterface" };
  }
  const contract = src.match(/\bcontract(?!\s+interface)\s+([A-Za-z_][A-Za-z0-9_]*)/im);
  if (contract && contract[1]) {
    return { name: contract[1], kind: "contract" };
  }
  return null;
}

export function extractCadenceContractName(code: string): string | null {
  const res = extractCadenceContract(code);
  return res ? res.name : null;
}

export function testExtraction(): void {
  const cases: Array<{ code: string; expected: CadenceContractInfo | null; label: string }> = [
    {
      label: "simple contract",
      code: `pub contract Foo {}`,
      expected: { name: "Foo", kind: "contract" },
    },
    {
      label: "contract interface",
      code: `pub contract interface IFoo {}`,
      expected: { name: "IFoo", kind: "contractInterface" },
    },
    {
      label: "multiline contract",
      code: `pub\n  contract\n  Bar\n{}`,
      expected: { name: "Bar", kind: "contract" },
    },
    {
      label: "multiline interface",
      code: `access(all)\ncontract\n  interface\n  IBar\n{}`,
      expected: { name: "IBar", kind: "contractInterface" },
    },
    {
      label: "conformance and comments",
      code: `// before\n/* block start */\n/* block end */\npub contract Baz: IFoo, IBar {\n  // body\n}\n` ,
      expected: { name: "Baz", kind: "contract" },
    },
    {
      label: "commented out contract",
      code: `// pub contract ShouldNotMatch {}`,
      expected: null,
    },
    {
      label: "string with keyword",
      code: `let s = \"contract Fake\"\n pub contract Real {}`,
      expected: { name: "Real", kind: "contract" },
    },
  ];

  let failed = 0;
  for (const t of cases) {
    const got = extractCadenceContract(t.code);
    const ok = JSON.stringify(got) === JSON.stringify(t.expected);
    if (!ok) {
      failed++;
      console.error(`FAIL: ${t.label} -> expected ${JSON.stringify(t.expected)} got ${JSON.stringify(got)}`);
    } else {
      console.log(`OK: ${t.label}`);
    }
  }
  if (failed > 0) {
    throw new Error(`${failed} test(s) failed`);
  } else {
    console.log("All tests passed");
  }
}
