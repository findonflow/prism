export default function ItemIndex(props: { index?: number | string }) {
  const { index } = props;

  return (
    <div className="text-prism-text-muted flex h-6 w-6 flex-shrink-0 flex-row items-center justify-center rounded-full border-1 border-current/50 text-xs font-bold">
      <span className={"translate-y-[1px]"} title={`Key index: ${index}`}>
        {index}
      </span>
    </div>
  );
}
