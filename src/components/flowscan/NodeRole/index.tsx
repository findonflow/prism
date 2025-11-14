import { TagNodeType } from "@/components/ui/tags";

export function NodeRole(props: { role?: string }) {
  const { role } = props;

  if (!role) {
    return null;
  }

  return (
    <div>
      <TagNodeType role={role} />
    </div>
  );
}
