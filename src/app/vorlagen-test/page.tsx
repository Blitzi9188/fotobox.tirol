import TemplateWizardTest from "@/components/site/TemplateWizardTest";
import { SiteFooter, SiteHeader } from "@/components/site/SiteShell";
import { readCmsContent } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function VorlagenTestPage() {
  const content = await readCmsContent();

  return (
    <>
      <SiteHeader content={content} />
      <TemplateWizardTest />
      <SiteFooter content={content} />
    </>
  );
}
