import type { Comments } from "@/type/comments";

export const mockComments: Comments[] = [
  // t2
  {
    id: "c1",
    taskId: "t2",
    userId: "u1",
    message:
      "Ich habe die Grundstruktur der Komponenten angelegt (Cards, Sections, CTA).",
    createdAt: "2026-02-10T10:05:00+01:00",
  },
  {
    id: "c2",
    taskId: "t2",
    userId: "u12",
    message: "Ich kann die responsive Varianten heute Abend durchgehen.",
    createdAt: "2026-02-10T12:20:00+01:00",
  },
  {
    id: "c3",
    taskId: "t2",
    userId: "u5",
    message:
      "Brauchen wir für den Hero ein neues Grid oder reicht das bestehende 12-col?",
    createdAt: "2026-02-11T09:10:00+01:00",
  },
  {
    id: "c4",
    taskId: "t2",
    userId: "u2",
    message:
      "Figma Components sind aktualisiert – bitte Pull latest Token names.",
    createdAt: "2026-02-11T11:33:00+01:00",
  },

  // t3
  {
    id: "c5",
    taskId: "t3",
    userId: "u8",
    message: "Motion Styleframes sind im Attachment – Feedback willkommen.",
    createdAt: "2026-02-12T14:05:00+01:00",
  },
  {
    id: "c6",
    taskId: "t3",
    userId: "u6",
    message:
      "Ich würde die Illustration etwas reduzierter halten, weniger Details im Hintergrund.",
    createdAt: "2026-02-12T15:40:00+01:00",
  },

  // t4
  {
    id: "c7",
    taskId: "t4",
    userId: "u7",
    message:
      "Performance Budget Vorschlag: LCP < 2.5s, CLS < 0.1, JS initial < 170kb gzip.",
    createdAt: "2026-02-13T09:00:00+01:00",
  },
  {
    id: "c8",
    taskId: "t4",
    userId: "u1",
    message: "Passt. Lass uns zusätzlich Bildgrößen-Limits definieren.",
    createdAt: "2026-02-13T09:18:00+01:00",
  },

  // t5
  {
    id: "c9",
    taskId: "t5",
    userId: "u10",
    message:
      "SEO Checklist ist fertig. Bitte entscheidet euch für canonical Regeln bei Filterseiten.",
    createdAt: "2026-02-14T10:30:00+01:00",
  },
  {
    id: "c10",
    taskId: "t5",
    userId: "u4",
    message: "Canonical: nur auf Hauptkategorien, Filterseiten noindex.",
    createdAt: "2026-02-14T11:10:00+01:00",
  },

  // t6
  {
    id: "c11",
    taskId: "t6",
    userId: "u15",
    message:
      "Auth Flow: Ich würde mit Email+OTP starten und später Social Login ergänzen.",
    createdAt: "2026-02-15T13:05:00+01:00",
  },
  {
    id: "c12",
    taskId: "t6",
    userId: "u11",
    message:
      "Backend-seitig ok. Rate limiting auf OTP Requests nicht vergessen.",
    createdAt: "2026-02-15T13:18:00+01:00",
  },

  // t9
  {
    id: "c13",
    taskId: "t9",
    userId: "u4",
    message:
      "API Contract muss die Pagination sauber definieren (cursor vs offset).",
    createdAt: "2026-02-16T10:00:00+01:00",
  },
  {
    id: "c14",
    taskId: "t9",
    userId: "u3",
    message: "Ich tendiere zu cursor-based (createdAt + id).",
    createdAt: "2026-02-16T10:12:00+01:00",
  },
  {
    id: "c15",
    taskId: "t9",
    userId: "u11",
    message: "Einverstanden. Bitte auch Sorting defaults fixieren.",
    createdAt: "2026-02-16T10:25:00+01:00",
  },

  // t11
  {
    id: "c16",
    taskId: "t11",
    userId: "u5",
    message:
      "Buttons: Primary/Secondary/Tertiary sind drin. Loading + Icon buttons fehlen noch.",
    createdAt: "2026-02-10T17:40:00+01:00",
  },
  {
    id: "c17",
    taskId: "t11",
    userId: "u12",
    message: "Ich mache die Disabled/Focus states und prüfe a11y.",
    createdAt: "2026-02-11T08:05:00+01:00",
  },

  // t12
  {
    id: "c18",
    taskId: "t12",
    userId: "u10",
    message: "Docs IA: Startseite + Komponenten + Tokens + Guidelines.",
    createdAt: "2026-02-12T09:00:00+01:00",
  },
  {
    id: "c19",
    taskId: "t12",
    userId: "u1",
    message: "Super. Lass uns Code Snippets pro Component ergänzen.",
    createdAt: "2026-02-12T09:20:00+01:00",
  },

  // t14
  {
    id: "c20",
    taskId: "t14",
    userId: "u3",
    message:
      "Refactor läuft, aber es gibt noch Abhängigkeiten zum Billing Modul.",
    createdAt: "2026-02-13T14:30:00+01:00",
  },
  {
    id: "c21",
    taskId: "t14",
    userId: "u11",
    message: "Ich kann das Billing Interface als Adapter auskoppeln.",
    createdAt: "2026-02-13T15:05:00+01:00",
  },

  // t15
  {
    id: "c22",
    taskId: "t15",
    userId: "u13",
    message: "Tracing: Ich habe Sample Rates eingestellt (prod 10%).",
    createdAt: "2026-02-14T09:45:00+01:00",
  },
  {
    id: "c23",
    taskId: "t15",
    userId: "u7",
    message: "Bitte Error Spans mit Service/Route tags versehen.",
    createdAt: "2026-02-14T10:10:00+01:00",
  },

  // t18
  {
    id: "c24",
    taskId: "t18",
    userId: "u9",
    message:
      "E2E Setup: Playwright fühlt sich am stabilsten an. CI runner braucht mehr RAM.",
    createdAt: "2026-02-12T16:00:00+01:00",
  },
  {
    id: "c25",
    taskId: "t18",
    userId: "u5",
    message: "Ok. Ich passe die Docker image an, damit Fonts/Deps da sind.",
    createdAt: "2026-02-12T16:12:00+01:00",
  },

  // t21
  {
    id: "c26",
    taskId: "t21",
    userId: "u6",
    message:
      "Key Visuals: Bitte entscheidet euch für Stilrichtung (clean vs playful).",
    createdAt: "2026-02-15T11:00:00+01:00",
  },
  {
    id: "c27",
    taskId: "t21",
    userId: "u8",
    message: "Ich bevorzuge playful, kann aber auch ein clean Set bauen.",
    createdAt: "2026-02-15T11:20:00+01:00",
  },

  // t25
  {
    id: "c28",
    taskId: "t25",
    userId: "u7",
    message:
      "Caching: Bitte definieren, welche Endpoints cachebar sind (GET only).",
    createdAt: "2026-02-16T13:00:00+01:00",
  },
  {
    id: "c29",
    taskId: "t25",
    userId: "u11",
    message: "Ich kann eine allowlist im Gateway hinterlegen.",
    createdAt: "2026-02-16T13:18:00+01:00",
  },
  {
    id: "c30",
    taskId: "t25",
    userId: "u3",
    message: "Wichtig: Auth header variieren -> cache key sauber definieren.",
    createdAt: "2026-02-16T13:25:00+01:00",
  },

  // t27
  {
    id: "c31",
    taskId: "t27",
    userId: "u13",
    message: "Right-sizing: Vorschlag liegt als Spreadsheet vor.",
    createdAt: "2026-02-17T09:00:00+01:00",
  },
  {
    id: "c32",
    taskId: "t27",
    userId: "u7",
    message: "Nice. Bitte Savings pro Service zusammenfassen.",
    createdAt: "2026-02-17T09:15:00+01:00",
  },

  // t31
  {
    id: "c33",
    taskId: "t31",
    userId: "u9",
    message: "A11y: Fokus-Outline fehlt bei einigen Links im Footer.",
    createdAt: "2026-02-18T10:00:00+01:00",
  },
  {
    id: "c34",
    taskId: "t31",
    userId: "u2",
    message: "Ich update die Farben für besseren Kontrast (AA).",
    createdAt: "2026-02-18T10:20:00+01:00",
  },

  // t32
  {
    id: "c35",
    taskId: "t32",
    userId: "u3",
    message: "Rate limiting Doku: Ich schreibe Beispiele für 429 Handling.",
    createdAt: "2026-02-18T11:30:00+01:00",
  },
  {
    id: "c36",
    taskId: "t32",
    userId: "u4",
    message: "Bitte auch die Support FAQ ergänzen: 'Warum werde ich geblockt?'",
    createdAt: "2026-02-18T11:45:00+01:00",
  },

  // Extra Kommentare verteilt (damit es “lebt”)
  {
    id: "c37",
    taskId: "t12",
    userId: "u2",
    message: "Für Tokens: Naming Convention bitte in Docs aufnehmen.",
    createdAt: "2026-02-12T10:05:00+01:00",
  },
  {
    id: "c38",
    taskId: "t15",
    userId: "u3",
    message: "Ich sehe in den Traces erhöhte Latenz bei /search.",
    createdAt: "2026-02-15T08:50:00+01:00",
  },
  {
    id: "c39",
    taskId: "t16",
    userId: "u11",
    message: "Index-Vorschlag: composite (tenant_id, created_at desc).",
    createdAt: "2026-02-16T09:10:00+01:00",
  },
  {
    id: "c40",
    taskId: "t19",
    userId: "u12",
    message: "Smoke Tests: Bitte priorisieren nach Umsatz-relevanten Flows.",
    createdAt: "2026-02-17T10:30:00+01:00",
  },

  // noch ein paar “kleine” für den Umfang
  {
    id: "c41",
    taskId: "t2",
    userId: "u4",
    message: "Deadline im Blick behalten – wir brauchen am 01.03 ein Preview.",
    createdAt: "2026-02-12T18:05:00+01:00",
  },
  {
    id: "c42",
    taskId: "t3",
    userId: "u1",
    message: "Bitte export als webp zusätzlich.",
    createdAt: "2026-02-13T08:35:00+01:00",
  },
  {
    id: "c43",
    taskId: "t18",
    userId: "u7",
    message: "CI: Falls flaky, bitte retries begrenzen.",
    createdAt: "2026-02-13T17:20:00+01:00",
  },
  {
    id: "c44",
    taskId: "t21",
    userId: "u10",
    message: "CTA Copy: Ich liefere 5 Varianten bis Freitag.",
    createdAt: "2026-02-16T12:05:00+01:00",
  },
  {
    id: "c45",
    taskId: "t22",
    userId: "u6",
    message: "Copy sollte zum Visual Stil passen – sonst wirkt’s inkonsistent.",
    createdAt: "2026-02-16T12:25:00+01:00",
  },

  // “Status” Kommentare
  {
    id: "c46",
    taskId: "t24",
    userId: "u13",
    message: "Cost Report abgeschlossen. Größter Treiber: egress + DB storage.",
    createdAt: "2026-01-20T16:30:00+01:00",
  },
  {
    id: "c47",
    taskId: "t10",
    userId: "u6",
    message: "Tokens sind freigegeben. Bitte nur noch über PR ändern.",
    createdAt: "2026-01-22T15:00:00+01:00",
  },

  // mehr “leben”
  {
    id: "c48",
    taskId: "t11",
    userId: "u1",
    message: "Bitte Button API konsistent zu existing utils halten.",
    createdAt: "2026-02-11T09:30:00+01:00",
  },
  {
    id: "c49",
    taskId: "t14",
    userId: "u4",
    message: "Risiko: Deployment Fenster nächste Woche ist eng.",
    createdAt: "2026-02-14T16:10:00+01:00",
  },
  {
    id: "c50",
    taskId: "t17",
    userId: "u7",
    message: "SLOs: erstmal 99.5% monthly für Core APIs?",
    createdAt: "2026-02-15T09:05:00+01:00",
  },
  {
    id: "c51",
    taskId: "t17",
    userId: "u4",
    message: "Ja, für Search evtl. 99.0% (weniger kritisch).",
    createdAt: "2026-02-15T09:20:00+01:00",
  },

  {
    id: "c52",
    taskId: "t25",
    userId: "u11",
    message: "Cache invalidation: erstmal TTL only, später tags.",
    createdAt: "2026-02-17T14:10:00+01:00",
  },
  {
    id: "c53",
    taskId: "t26",
    userId: "u13",
    message: "Lifecycle: 30d -> IA, 90d -> Glacier (oder equivalent).",
    createdAt: "2026-02-17T14:25:00+01:00",
  },
  {
    id: "c54",
    taskId: "t27",
    userId: "u11",
    message:
      "Right-sizing braucht Lastprofile – sonst riskieren wir throttling.",
    createdAt: "2026-02-18T09:05:00+01:00",
  },

  {
    id: "c55",
    taskId: "t31",
    userId: "u12",
    message: "Keyboard: Skip link ergänzen, dann passt’s.",
    createdAt: "2026-02-18T12:00:00+01:00",
  },
  {
    id: "c56",
    taskId: "t6",
    userId: "u4",
    message: "Bitte Zeitplan für MVP Features grob ins Board schreiben.",
    createdAt: "2026-02-18T13:00:00+01:00",
  },
  {
    id: "c57",
    taskId: "t7",
    userId: "u2",
    message: "Feed UI: ich brauche noch die Typo Scale aus dem Design System.",
    createdAt: "2026-02-18T13:10:00+01:00",
  },
  {
    id: "c58",
    taskId: "t12",
    userId: "u10",
    message: "Docs: Bitte auch 'Do/Don't' Beispiele hinzufügen.",
    createdAt: "2026-02-18T15:00:00+01:00",
  },
  {
    id: "c59",
    taskId: "t20",
    userId: "u7",
    message: "CI: parallelization prüfen, damit PR Checks < 10min bleiben.",
    createdAt: "2026-02-18T16:40:00+01:00",
  },
  {
    id: "c60",
    taskId: "t2",
    userId: "u5",
    message: "Ich habe den Hero Slot flexibilisiert (Aspect Ratio via props).",
    createdAt: "2026-02-18T17:15:00+01:00",
  },
  
];
