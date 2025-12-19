/*--------------------------------------------------------------------------------------------------------------------*/
import PageLayout from "@/components/ui/layout";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function StorageLayout(props: { children: React.ReactNode }) {
  const { children } = props;
  return <PageLayout title={"Account Storage"}>{children}</PageLayout>;
}
