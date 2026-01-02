"use client";

import { useMemo, useState, useTransition } from "react";

type MessageAuthor = "agent" | "prospect";

type Message = {
  id: string;
  author: MessageAuthor;
  content: string;
};

type BaseStep = {
  id: string;
  prompt: string;
  helper?: string;
};

type InputStep = BaseStep & {
  type: "text" | "email" | "tel" | "textarea" | "number";
  placeholder?: string;
};

type ChoiceStep = BaseStep & {
  type: "choice";
  multiple?: boolean;
  options: {
    value: string;
    label: string;
    helper?: string;
  }[];
};

type Step = InputStep | ChoiceStep;

type LeadData = Record<string, string | string[]>;

const agentName = "Luma";

const steps: Step[] = [
  {
    id: "name",
    type: "text",
    prompt: `Hey there! I'm ${agentName}, your style scout. What's your first name?`,
    placeholder: "Alex",
  },
  {
    id: "email",
    type: "email",
    prompt: "Perfect. Where should we send your personalized lookbook?",
    helper: "We only send 1-2 drops a month. No spam, promise.",
    placeholder: "alex@email.com",
  },
  {
    id: "style",
    type: "choice",
    prompt: "Which vibe feels most you right now?",
    multiple: true,
    options: [
      { value: "streetwear", label: "Streetwear Edge" },
      { value: "minimal", label: "Minimal Essentials" },
      { value: "luxury", label: "Luxury Staples" },
      { value: "athleisure", label: "Elevated Athleisure" },
      { value: "bold", label: "Bold Statements" },
    ],
  },
  {
    id: "fit",
    type: "choice",
    prompt: "What are you building your closet for?",
    options: [
      { value: "daily", label: "Everyday rotation" },
      { value: "work", label: "Creative workspace" },
      { value: "events", label: "Night out / events" },
      { value: "travel", label: "Travel-ready fits" },
    ],
  },
  {
    id: "budget",
    type: "choice",
    prompt: "Got a budget range in mind for your next refresh?",
    options: [
      { value: "under-150", label: "Under $150" },
      { value: "150-300", label: "$150 - $300" },
      { value: "300-600", label: "$300 - $600" },
      { value: "over-600", label: "$600+" },
    ],
  },
  {
    id: "notes",
    type: "textarea",
    prompt: "Any brands or pieces you’re hunting for right now?",
    helper: "Give me keywords, fabrics, colors—anything helps.",
    placeholder: "E.g. Washed black denim jacket, oversized knit, neutral cargos...",
  },
];

const initialMessages: Message[] = [
  {
    id: "welcome",
    author: "agent",
    content: `Welcome to Nova Wardrobe — I’m ${agentName}, here to help craft fits that hit just right.`,
  },
  {
    id: steps[0].id,
    author: "agent",
    content: steps[0].prompt,
  },
];

function randomId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function prettyList(values: string | string[] | undefined) {
  if (!values || (Array.isArray(values) && values.length === 0)) return "";
  if (Array.isArray(values)) {
    if (values.length === 1) return values[0];
    return `${values.slice(0, -1).join(", ")} and ${values.at(-1)}`;
  }
  return values;
}

async function submitLead(payload: LeadData) {
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to submit lead");
  }
}

export function LeadAgent() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [answers, setAnswers] = useState<LeadData>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState<string[]>([]);
  const [, startSendTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const step = steps[stepIndex];

  const isComplete = stepIndex >= steps.length;

  const leadScore = useMemo(() => {
    const priorities = answers["style"];
    let score = 40;
    if (Array.isArray(priorities)) {
      score += priorities.length * 8;
      if (priorities.includes("luxury") || priorities.includes("bold")) {
        score += 10;
      }
    }

    const budget = answers["budget"];
    if (typeof budget === "string") {
      switch (budget) {
        case "300-600":
          score += 20;
          break;
        case "over-600":
          score += 30;
          break;
        case "150-300":
          score += 12;
          break;
        default:
          score += 5;
      }
    }

    return Math.min(100, score);
  }, [answers]);

  const canSubmit =
    stepIndex < steps.length &&
    ((step.type === "choice" && currentInput.length > 0) ||
      (step.type !== "choice" && (currentInput[0]?.trim().length ?? 0) > 0));

  const handleChoiceToggle = (value: string) => {
    if (step?.type !== "choice") return;
    if (step.multiple) {
      setCurrentInput((prev) =>
        prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
      );
      return;
    }
    setCurrentInput([value]);
  };

  const advance = (payload: string | string[]) => {
    if (!step) return;

    setMessages((prev) => [
      ...prev,
      { id: randomId("answer"), author: "prospect", content: prettyList(payload) ?? "" },
    ]);
    setAnswers((prev) => ({ ...prev, [step.id]: payload }));

    const nextStepIndex = stepIndex + 1;
    setStepIndex(nextStepIndex);
    setCurrentInput([]);

    if (nextStepIndex < steps.length) {
      const nextStep = steps[nextStepIndex];
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: nextStep.id, author: "agent", content: nextStep.prompt },
        ]);
      }, 350);
    } else {
      startSendTransition(async () => {
        try {
          setStatus("submitting");
          await submitLead({ ...answers, [step.id]: payload });
          setStatus("success");
          setMessages((prev) => [
            ...prev,
            {
              id: "success",
              author: "agent",
              content:
                "Saved! I’ll drop a curated lookbook and size recommendations in your inbox shortly.",
            },
          ]);
        } catch (error) {
          console.error(error);
          setStatus("error");
          setMessages((prev) => [
            ...prev,
            {
              id: "error",
              author: "agent",
              content:
                "Something glitched while saving your details. Mind trying again in a sec?",
            },
          ]);
        }
      });
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!step) return;
    if (!canSubmit) return;

    if (step.type === "choice") {
      advance(step.multiple ? [...currentInput] : currentInput[0]);
      return;
    }

    advance(currentInput[0]?.trim() ?? "");
  };

  const renderInput = () => {
    if (!step || isComplete) return null;

    if (step.type === "choice") {
      return (
        <div className="flex flex-wrap gap-2">
          {step.options.map((option) => {
            const isActive = currentInput.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleChoiceToggle(option.value)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  isActive
                    ? "border-black bg-black text-white"
                    : "border-neutral-300 bg-white text-neutral-700 hover:border-black/40"
                }`}
              >
                <span className="font-medium">{option.label}</span>
                {option.helper ? (
                  <span className="block text-[11px] font-normal text-neutral-500">
                    {option.helper}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      );
    }

    const props = {
      key: step.id,
      value: currentInput[0] ?? "",
      onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCurrentInput([event.target.value]);
      },
      placeholder: step.placeholder,
      className:
        "w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10",
      required: true,
      name: step.id,
    };

    if (step.type === "textarea") {
      return (
        <textarea
          {...props}
          rows={3}
        />
      );
    }

    return (
      <input
        type={step.type}
        {...props}
      />
    );
  };

  return (
    <section className="flex h-full w-full flex-col justify-between rounded-3xl border border-black/5 bg-white/80 p-6 shadow-lg shadow-black/5 backdrop-blur">
      <div className="flex items-center gap-3 pb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-black via-neutral-700 to-neutral-500 text-white shadow-lg">
          <span className="text-lg font-semibold">NW</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-900">Nova Wardrobe Concierge</p>
          <p className="text-xs text-neutral-500">Real-time outfitting support by {agentName}</p>
        </div>
      </div>

      <div className="relative mb-6 flex-1 space-y-3 overflow-y-auto pr-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[85%] rounded-2xl px-3.5 py-3 text-sm leading-6 ${
              message.author === "agent"
                ? "bg-black text-white shadow-lg shadow-black/40"
                : "ml-auto bg-neutral-100 text-neutral-900"
            }`}
          >
            {message.content}
          </div>
        ))}
        {status === "submitting" ? (
          <div className="w-fit rounded-2xl bg-black px-3.5 py-3 text-sm text-white shadow shadow-black/30">
            Syncing your profile…
          </div>
        ) : null}
      </div>

      {!isComplete ? (
        <form className="space-y-3" onSubmit={handleSubmit}>
          {step.helper ? (
            <p className="text-xs uppercase tracking-[0.15em] text-neutral-500">
              {step.helper}
            </p>
          ) : null}
          {renderInput()}
          <div className="flex items-center justify-between gap-3 pt-1">
            <p className="text-[11px] text-neutral-400">
              Step {stepIndex + 1} of {steps.length}
            </p>
            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-black/30 transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
            >
              {stepIndex + 1 === steps.length ? "Lock it in" : "Next"}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Lead summary</p>
          <ul className="space-y-3 text-sm text-neutral-700">
            <li>
              <span className="font-semibold text-neutral-900">Name:</span>{" "}
              {answers["name"]}
            </li>
            <li>
              <span className="font-semibold text-neutral-900">Style vibe:</span>{" "}
              {prettyList(answers["style"]) || "—"}
            </li>
            <li>
              <span className="font-semibold text-neutral-900">Focus:</span>{" "}
              {prettyList(answers["fit"]) || "—"}
            </li>
            <li>
              <span className="font-semibold text-neutral-900">Budget:</span>{" "}
              {prettyList(answers["budget"]) || "—"}
            </li>
          </ul>
          <p className="text-xs text-neutral-500">
            Lead score: <span className="font-semibold text-neutral-900">{leadScore}</span>/100 •{" "}
            Inbox ready
          </p>
        </div>
      )}
    </section>
  );
}
