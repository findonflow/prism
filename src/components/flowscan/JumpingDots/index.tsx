/*--------------------------------------------------------------------------------------------------------------------*/
import "./styles.css";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function JumpingDots() {
  return (
    <span className={"jumping-dots"} title={"Retrieving data..."}>
      <i />
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
export function LoadingBlock(props: { title?: string }) {
  const { title } = props;
  return (
    <div
      className={"flex flex-row items-center justify-start gap-2 opacity-50"}
    >
      <span className="capitalize">{title || "Loading"}</span>
      <JumpingDots />
    </div>
  );
}
