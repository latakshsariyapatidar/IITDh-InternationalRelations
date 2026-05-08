import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Download, FileText, BookOpen, Presentation, FileSignature, Users } from "lucide-react";

export const Route = createFileRoute("/downloads")({
  head: () => ({
    meta: [
      { title: "Downloads — IRO IIT Dharwad" },
      { name: "description", content: "Factsheet, international student guide, presentations, MoU template and faculty profiles." },
    ],
  }),
  component: DownloadsPage,
});

const files = [
  { icon: FileText, name: "IITDh Factsheet", size: "1.2 MB · PDF", desc: "Quick numbers, programs and facilities at a glance." },
  { icon: BookOpen, name: "International Student Guide", size: "3.4 MB · PDF", desc: "Everything you need to know before you arrive." },
  { icon: Presentation, name: "IITDh Institutional PPT", size: "8.1 MB · PPTX", desc: "Use this deck to introduce IITDh to your home institution." },
  { icon: FileSignature, name: "MoU Template", size: "240 KB · DOCX", desc: "Standard memorandum template for new partnerships." },
  { icon: Users, name: "Faculty Profiles", size: "5.6 MB · PDF", desc: "Department-wise list of faculty and research areas." },
];

function DownloadsPage() {
  return (
    <>
      <PageHero
        eyebrow="Downloads"
        title={<>Resources, <span className="italic text-saffron">ready to share.</span></>}
        description="The documents you'll need most often — factsheets, guides and templates."
      />

      <section className="container-editorial py-24 max-w-4xl">
        <div className="space-y-3">
          {files.map((f) => (
            <a key={f.name} href="#" className="group flex items-center gap-6 bg-card border border-border rounded-2xl p-6 hover:border-saffron hover:shadow-editorial transition-all">
              <div className="h-14 w-14 rounded-xl bg-saffron/15 flex items-center justify-center shrink-0 group-hover:bg-saffron transition-colors">
                <f.icon className="h-6 w-6 text-saffron-deep group-hover:text-ink" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display text-xl">{f.name}</div>
                <div className="text-sm text-muted-foreground">{f.desc}</div>
              </div>
              <div className="hidden sm:block text-xs uppercase tracking-[0.18em] text-muted-foreground">{f.size}</div>
              <Download className="h-5 w-5 text-saffron-deep group-hover:translate-y-0.5 transition-transform" />
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
