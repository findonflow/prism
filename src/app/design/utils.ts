import type { ReactNode } from "react";
/*--------------------------------------------------------------------------------------------------------------------*/
export function constructCode(
  element: ReactNode | Array<ReactNode>,
  innerLevel: boolean = true,
): string {
  console.log(element);

  // Handle null/undefined
  if (!element) {
    return "";
  }

  // Handle strings (text content)
  if (typeof element === "string") {
    return element;
  }

  // Handle arrays of children
  if (Array.isArray(element)) {
    if (element.length === 0) {
      return "";
    }
    if (element.length === 1) {
      return constructCode(element[0]);
    }
    // Multiple children need a fragment
    const childrenCode = element
      .map((child) => constructCode(child))
      .join("\n");
    return !innerLevel ? `<>\n${childrenCode}\n</>` : childrenCode;
  }

  // Handle React elements
  const { props, type } = element as any;
  let componentName = type?.name || type?.displayName || "Unknown";
  if (typeof type === "string") {
    componentName = type;
  }


  // TODO: add other props to rendered string
  const {className, children, ...rest} = props;
  let classNameFormatted = props?.className ? ` className={"${props.className}"}` : "";

  // Recursively process children
  const childrenCode = constructCode(props?.children);

  return `<${componentName}${classNameFormatted}>${childrenCode}</${componentName}>`;
}
