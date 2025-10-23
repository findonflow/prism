export function NodeRole(props: { role?: string }) {
  const { role } = props;

  if (!role) {
    return null;
  }

  const color = `var(--role-${role.toLowerCase()})`;

  return (
    <div
      style={{
        color,
      }}
      className={
        "border-1px flex w-[75px] items-center justify-center border-[1px] border-current px-1 py-0.5"
      }
    >
      <span className={"text-fineprint capitalize"}>{role}</span>
    </div>
  );
}
