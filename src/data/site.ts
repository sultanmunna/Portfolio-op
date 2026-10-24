// All visible strings and projects live here so the owner can swap real material in one place.
// Assumptions (all invented, replace freely):
//   - projects, their summaries, stacks and case pages: placeholder: true
//   - socials and email: placeholders in the obvious `github.com/sultan…` form
//   - "available for backend roles" status line
export type Project = {
  slug: string;
  method: string;
  path: string;                       // endpoint path shown in the index row
  title: string;
  tagline: string;                    // one line, what it does
  year: number;
  role: string[];
  stack: string[];
  summary: string;                    // case-page one-liner: what changed, for whom
  response: string[];                 // the resolved panel preview: JSON-shaped lines
  body: { heading: string; text: string }[];
  links: { github: string; live: string };
  placeholder: true;
};

export const site = {
  name: 'Md Sultan Mahmud Munna',
  shortName: 'Munna',
  role: 'Backend developer · FastAPI',
  url: 'https://sultanmunna.dev', // production URL: canonical, OG, sitemap. Replace on deploy.
  description:
    'Backend developer. I build and ship FastAPI services with PostgreSQL, Redis and RAG pipelines, and I keep response times honest.',
  email: 'hello@sultanmunna.dev',
  status: 'Status: open to backend roles',
  socials: [
    { label: 'GitHub', href: 'https://github.com/sultan-munna' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/sultan-munna' },
    { label: 'X / Twitter', href: 'https://x.com/sultan_munna' },
  ],
};

export const stack: { group: string; items: string[] }[] = [
  { group: 'core', items: ['python', 'fastapi', 'pydantic', 'sqlmodel', 'uvicorn', 'rest', 'jwt auth'] },
  { group: 'data', items: ['postgresql', 'redis', 'mongodb', 'sqlalchemy', 'pgvector', 'alembic'] },
  { group: 'ai', items: ['openai api', 'langchain', 'embeddings', 'rag pipelines', 'prompt design'] },
  { group: 'ops', items: ['docker', 'github actions', 'pytest', 'nginx', 'linux'] },
];

export const projects: Project[] = [
  {
    slug: 'answerline',
    method: 'GET',
    path: '/v1/answers',
    title: 'Answerline',
    tagline: 'A RAG question-answering service over private docs.',
    year: 2026,
    role: ['Backend', 'AI pipeline'],
    stack: ['FastAPI', 'PostgreSQL + pgvector', 'OpenAI API', 'Redis', 'Docker'],
    summary:
      'A retrieval-augmented answer API: typed queries go in, cited answers come out, with every chunk stored a way back.',
    response: [
      '{',
      '  "endpoint": "/v1/answers",',
      '  "retrieval": "hybrid · pgvector",',
      '  "status": "200",',
      '}',
    ],
    body: [
      {
        heading: 'Context',
        text: 'Teams drowning in internal docs asked one question a hundred ways and never trusted the answers. Answerline puts one typed endpoint over the mess: ask in natural language, get an answer with the exact sources it came from.',
      },
      {
        heading: 'The build',
        text: 'FastAPI with strict Pydantic schemas at the edge, so bad payloads fail before they reach the model. Documents chunk and embed into pgvector, a thin Redis layer keeps the hot questions cached, and every answer carries its citations. The whole stack ships as one Compose file.',
      },
      {
        heading: 'Hard parts',
        text: 'Retrieval quality: hybrid keyword plus vector search made answers stable where pure embeddings drifted. Latency: streaming responses and an embedding cache took the first token under a second on a laptop stack.',
      },
      {
        heading: 'Outcome',
        text: 'The service runs, answers, cites, and survives process reboots. Built as the capstone of my backend learning track, now the project I use to demo how I think about API design.',
      },
    ],
    links: {
      github: 'https://github.com/sultan-munna/answerline',
      live: 'https://answerline-demo.example.com',
    },
    placeholder: true,
  },
  {
    slug: 'tidepool',
    method: 'WS',
    path: '/ws/rooms/{id}',
    title: 'Tidepool',
    tagline: 'Realtime chat rooms with presence and durable history.',
    year: 2026,
    role: ['Backend', 'Realtime'],
    stack: ['FastAPI', 'WebSockets', 'PostgreSQL', 'Redis pub/sub', 'Docker'],
    summary:
      'A chat backend that keeps rooms honest: live presence, ordered delivery, and history that survives a server restart.',
    response: [
      '{',
      '  "endpoint": "/ws/rooms/{id}",',
      '  "transports": ["websocket", "sse"],',
      '  "status": "switching_protocols",',
      '}',
    ],
    body: [
      {
        heading: 'Context',
        text: 'Chat demos are easy; chat backends are not. Tidepool is my ground-up take on the hard half: presence, ordering, delivery, and reconnects, with no magic framework in the middle.',
      },
      {
        heading: 'The build',
        text: 'WebSocket routes inside FastAPI, fan-out through Redis pub/sub so rooms span workers, and message ordering solved with a monotonic per-room cursor the client acks. History lives in PostgreSQL and replays cheaply on reconnect.',
      },
      {
        heading: 'Hard parts',
        text: 'Reconnects: an acked-cursor protocol means a dropped laptop never replays a wall of duplicates. Load: standing up two Uvicorn workers with shared Redis made the room survive the death of its own process.',
      },
      {
        heading: 'Outcome',
        text: 'Rooms hold steady with a dozen clients open in tabs, reconnect clean, and the log reads like a real transport layer. The infrastructure bits are the part I am proudest of.',
      },
    ],
    links: {
      github: 'https://github.com/sultan-munna/tidepool',
      live: 'https://tidepool-demo.example.com',
    },
    placeholder: true,
  },
  {
    slug: 'cartline',
    method: 'POST',
    path: '/checkout',
    title: 'Cartline',
    tagline: 'An orders and checkout API with honest inventory math.',
    year: 2025,
    role: ['Backend', 'Data modeling'],
    stack: ['FastAPI', 'SQLModel', 'PostgreSQL', 'Redis', 'pytest'],
    summary:
      'Checkout done properly: money math with decimals, idempotent order creation, and inventory that cannot go negative.',
    response: [
      '{',
      '  "endpoint": "/checkout",',
      '  "idempotent": true,',
      '  "status": "201",',
      '}',
    ],
    body: [
      {
        heading: 'Context',
        text: 'Cart demos everywhere round money into floats and let two buyers claim the last item. Cartline is the boring, correct version: an orders and checkout API where the edge cases are the feature.',
      },
      {
        heading: 'The build',
        text: 'SQLModel tables with decimal money columns, an idempotency key on every order POST, and row-level reservations that expire if the buyer never confirms. Payment stays a stubbed interface, cleanly isolated behind one adapter.',
      },
      {
        heading: 'Hard parts',
        text: 'Concurrency: the reservation step runs in one transaction and the test suite proves two simultaneous orders cannot both take the final unit. Idempotency: replaying the same request returns the same order, never a second charge.',
      },
      {
        heading: 'Outcome',
        text: 'A checkout API whose edge-case suite is its best documentation. It is the project I reach for when asked how I test backend logic.',
      },
    ],
    links: {
      github: 'https://github.com/sultan-munna/cartline',
      live: 'https://cartline-api.example.com',
    },
    placeholder: true,
  },
  {
    slug: 'cronmill',
    method: 'GET',
    path: '/jobs/next',
    title: 'Cronmill',
    tagline: 'A job scheduler and worker service with replayable logs.',
    year: 2025,
    role: ['Backend', 'Background work'],
    stack: ['FastAPI', 'PostgreSQL', 'Redis', 'Celery-style workers', 'Docker'],
    summary:
      'Scheduled jobs with a control plane: enqueue, inspect, replay and fail loudly, all through typed endpoints.',
    response: [
      '{',
      '  "endpoint": "/jobs/next",',
      '  "delivery": "at_least_once",',
      '  "status": "200",',
      '}',
    ],
    body: [
      {
        heading: 'Context',
        text: 'Every backend eventually needs background work. Cronmill is my answer to "where do the cron jobs live": one service that schedules, runs, and reports on jobs with the honesty of a real queue.',
      },
      {
        heading: 'The build',
        text: 'A schedule table with locking claims so two workers never take the same job, exponential backoff on failure, and a control API to inspect and replay runs. Redis holds the hot queue; PostgreSQL keeps the durable truth.',
      },
      {
        heading: 'Hard parts',
        text: 'At-least-once delivery meant learning to make every job idempotent, and the replay endpoint presupposes exactly that. Visibility: the runs table turned "why is it failing" into a single query.',
      },
      {
        heading: 'Outcome',
        text: 'It schedules, it retries, it replays, and its failure log is the nicest API response I have designed. Deployed locally with Compose for demos.',
      },
    ],
    links: {
      github: 'https://github.com/sultan-munna/cronmill',
      live: 'https://cronmill.example.com',
    },
    placeholder: true,
  },
];
