import SlideEditor from "@/app/(pages)/SlideEditor";

export default async function Page({ params }) {
  const { pId } = await params;

  return (
    <>
      <SlideEditor pptId={pId} />
    </>
  );
}
