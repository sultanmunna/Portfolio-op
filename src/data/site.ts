// Assumptions (placeholder register): everything marked `placeholder` is
// invented for the owner to replace with real work, links, and copy.
// Email, GitHub URL, and the four projects are placeholders; live demo
// URLs are omitted until the owner provides them ("demo soon" is shown).

export type SceneId = "archive" | "taskforge" | "gatehouse" | "agentbench";

export type CaseSection = { heading: string; text: string };

export type Project = {
  slug: string;
  title: string;
  summary: string;
  role: string;
  year: number;
  stack: string[];
  github: string;
  live?: string;
  scene: SceneId;
  sceneLabel: string;
  cta: string;
  caption: string;
  body: CaseSection[];
  placeholder?: boolean;
};

export const site = {
  name: "Sultan Mahmud",
  role: "Backend engineer. FastAPI and applied AI.",
  tagline: "I build the part you never see.",
  description:
    "Sultan Mahmud builds backends: FastAPI services, data models, and applied AI systems. Four projects, shown running live.",
  url: "https://sultanmahmud.dev", // placeholder, owner must replace
  email: "hello@sultanmahmud.dev", // placeholder, owner must replace
  github: "https://github.com/sultanmahmud", // placeholder, owner must replace
};

export const intro = {
  text: "I am Sultan Mahmud. I build backends: FastAPI services, data models, and the AI systems behind them. No company has hired me for it yet: what I have instead are systems I designed, built, broke, and fixed myself. The four below are shown running.",
};

export const machinery = [
  {
    group: "runtime",
    role: "the language and its contracts",
    tools: ["Python 3.12", "Pydantic", "uv"],
  },
  {
    group: "web layer",
    role: "the doors requests come through",
    tools: ["FastAPI", "ASGI", "Uvicorn", "OpenAPI"],
  },
  {
    group: "data",
    role: "where state survives",
    tools: ["PostgreSQL", "pgvector", "Redis", "SQLAlchemy", "Alembic"],
  },
  {
    group: "ai",
    role: "retrieval, generation, evaluation",
    tools: ["embeddings", "OpenAI-compatible APIs", "Ollama", "eval harnesses"],
  },
  {
    group: "ops",
    role: "ship it, watch it, prove it",
    tools: ["Docker", "GitHub Actions", "pytest", "Prometheus"],
  },
];

export const projects: Project[] = [
  {
    slug: "ask-the-archive",
    title: "Ask the Archive",
    summary:
      "A RAG service: ask a document archive in plain language, get answers with the sources attached.",
    role: "design, backend, retrieval",
    year: 2026,
    stack: ["FastAPI", "PostgreSQL", "pgvector", "embeddings"],
    github: "https://github.com/sultanmahmud/ask-the-archive", // placeholder
    scene: "archive",
    sceneLabel:
      "Animation of a retrieval pipeline: a document splits into chunks that scatter across a vector space, a query arrives, three nearest passages light up, and an answer assembles.",
    cta: "send a query",
    caption: "the retrieval path: chunks, vector space, sources",
    body: [
      {
        heading: "Context",
        text: "Documents pile up faster than anyone reads them. The archive needed to answer questions from its own contents, with the evidence attached to every answer.",
      },
      {
        heading: "Idea",
        text: "Chunk on structure, embed once at ingest, retrieve with pgvector. The real work was the contract: no answer ships without the passages that produced it.",
      },
      {
        heading: "Craft",
        text: "Ingestion is idempotent per document. Queries embed at request time and nearest neighbors come back in one SQL round trip. Answers cite chunk ids.",
      },
      {
        heading: "Outcome",
        text: "Shipped as a personal project. The contract held: every answer came back with its sources.",
      },
    ],
    placeholder: true,
  },
  {
    slug: "taskforge",
    title: "Taskforge",
    summary:
      "An async job queue with retries, backpressure, and failure states it does not hide.",
    role: "design, backend, workers",
    year: 2026,
    stack: ["FastAPI", "Redis", "ARQ", "Docker"],
    github: "https://github.com/sultanmahmud/taskforge", // placeholder
    scene: "taskforge",
    sceneLabel:
      "Animation of a job queue: jobs drop onto a rail, three workers pick them up and fill progress rings, finished jobs stack in a done pile, and one job retries.",
    cta: "enqueue a job",
    caption: "intake, workers, and a done pile that only grows when work finishes",
    body: [
      {
        heading: "Context",
        text: "Imports, reports, and model calls kept timing out inside request handlers. Long work needed to leave the request cycle entirely.",
      },
      {
        heading: "Idea",
        text: "Move work out of the request. Jobs land in Redis, workers drain the queue, and every job carries an idempotency key so a retry never doubles the effect.",
      },
      {
        heading: "Craft",
        text: "Exponential backoff with a cap, a dead letter list for the jobs that keep failing, and a backlog endpoint that reports queue depth honestly.",
      },
      {
        heading: "Outcome",
        text: "Shipped as a personal project. The queue has drained and refilled itself many times since.",
      },
    ],
    placeholder: true,
  },
  {
    slug: "gatehouse",
    title: "Gatehouse",
    summary:
      "An API gateway that rate limits per key and sheds load instead of hanging.",
    role: "design, middleware",
    year: 2026,
    stack: ["FastAPI middleware", "Redis", "token buckets"],
    github: "https://github.com/sultanmahmud/gatehouse", // placeholder
    scene: "gatehouse",
    sceneLabel:
      "Animation of rate limiting: request pulses stream toward a gate, a token bucket above it refills, requests with tokens pass through, and the rest deflect down as honest 429s.",
    cta: "send a burst",
    caption: "a token bucket that refills, and a gate that says no politely",
    body: [
      {
        heading: "Context",
        text: "One noisy client could starve everyone else sharing the service. The fix had to sit before any handler ran.",
      },
      {
        heading: "Idea",
        text: "Rate limiting belongs at the edge. A token bucket per API key is checked in middleware, so abuse never reaches application code.",
      },
      {
        heading: "Craft",
        text: "Buckets refill on a fixed schedule. Requests over the limit get an immediate 429 with a retry after header, never a slow hang.",
      },
      {
        heading: "Outcome",
        text: "Shipped as a personal project. Shedding load loudly beats failing quietly.",
      },
    ],
    placeholder: true,
  },
  {
    slug: "agentbench",
    title: "Agentbench",
    summary:
      "A small orchestrator that plans, calls tools one at a time, and shows its own trace.",
    role: "design, backend, orchestration",
    year: 2026,
    stack: ["FastAPI", "function calling", "Pydantic", "pytest"],
    github: "https://github.com/sultanmahmud/agentbench", // placeholder
    scene: "agentbench",
    sceneLabel:
      "Animation of an agent run: a plan node emits three steps that fan out to tool nodes, results flow back to an answer node, and a trace panel prints each step with real timings.",
    cta: "run a task",
    caption: "plan, tools, answer, and a trace that shows its work",
    body: [
      {
        heading: "Context",
        text: "LLM calls fail in boring ways: wrong arguments, missing tools, and no record of what actually happened.",
      },
      {
        heading: "Idea",
        text: "Plan first, then call tools one at a time, then verify before answering. The trace is a first class output, not a log line.",
      },
      {
        heading: "Craft",
        text: "Every tool call is typed and retried once on schema failure. The trace panel prints real timings from the run itself.",
      },
      {
        heading: "Outcome",
        text: "Shipped as a personal project. It runs tasks end to end and shows its work.",
      },
    ],
    placeholder: true,
  },
];
