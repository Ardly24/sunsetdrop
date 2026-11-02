import type { Step } from "@/types";

const steps: Step[] = [
  {
    number: "01",
    title: "Discover deals",
    description:
      "Find great food deals from restaurants, bakeries and supermarkets near you.",
  },
  {
    number: "02",
    title: "Reserve your food",
    description:
      "Choose your favourite deal and reserve it before someone else does.",
  },
  {
    number: "03",
    title: "Pick up and enjoy",
    description:
      "Collect your order from the business and enjoy great food for less.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-widest text-[#B87528]">
            Simple as 1, 2, 3
          </p>

          <h2 className="mt-3 text-3xl font-bold text-forest md:text-4xl">
            Good food, made more affordable.
          </h2>

          <p className="mt-4 leading-7 text-muted">
            Getting great food at a better price has never been easier.
          </p>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {steps.map((step) => (
            <article key={step.number}>
              <span className="text-4xl font-bold text-sunset">
                {step.number}
              </span>

              <h3 className="mt-5 text-xl font-bold text-forest">
                {step.title}
              </h3>

              <p className="mt-3 leading-7 text-muted">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


