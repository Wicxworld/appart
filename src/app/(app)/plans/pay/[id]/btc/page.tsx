import { MethodPage } from "../method-page";

export default async function BtcPayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MethodPage id={id} method="btc" />;
}
