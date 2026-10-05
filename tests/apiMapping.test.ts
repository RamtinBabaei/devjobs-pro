import assert from "node:assert/strict";
import test from "node:test";
import {
  inferExperience,
  inferSkills,
  normalizeJobType,
  parseSalary,
  stripHtml,
} from "../src/api/remotiveMapper.ts";
import { safeHttpUrl } from "../src/utils/url.ts";

test("salary parser converts annual USD ranges to K values", () => {
  assert.deepEqual(parseSalary("$140,000 - $180,000"), {
    min: 140,
    max: 180,
    label: "$140,000 - $180,000",
  });

  assert.deepEqual(parseSalary("USD 95k - 125k"), {
    min: 95,
    max: 125,
    label: "USD 95k - 125k",
  });
});

test("salary parser does not mislabel hourly or non-USD compensation", () => {
  assert.deepEqual(parseSalary("$90 - $150 /hour"), {
    min: null,
    max: null,
    label: "$90 - $150 /hour",
  });

  assert.deepEqual(parseSalary("CAD 120,000 - 150,000"), {
    min: null,
    max: null,
    label: "CAD 120,000 - 150,000",
  });

  assert.deepEqual(parseSalary("$8,000 - $10,000 / month"), {
    min: null,
    max: null,
    label: "$8,000 - $10,000 / month",
  });
});

test("salary parser handles missing salary", () => {
  assert.deepEqual(parseSalary(""), {
    min: null,
    max: null,
    label: "Salary not listed",
  });
});

test("job type normalization handles API values", () => {
  assert.equal(normalizeJobType("full_time"), "Full-time");
  assert.equal(normalizeJobType("part-time"), "Part-time");
  assert.equal(normalizeJobType("contract"), "Contract");
  assert.equal(normalizeJobType("freelance"), "Freelance");
  assert.equal(normalizeJobType("internship"), "Internship");
});

test("skill inference extracts technologies without substring false positives", () => {
  const skills = inferSkills("Senior React TypeScript engineer using Next.js, GraphQL and Go");
  assert.ok(skills.includes("React"));
  assert.ok(skills.includes("TypeScript"));
  assert.ok(skills.includes("Next.js"));
  assert.ok(skills.includes("GraphQL"));
  assert.ok(skills.includes("Go"));

  const mongodbOnly = inferSkills("Build MongoDB-powered services");
  assert.equal(mongodbOnly.includes("Go"), false);
});

test("experience inference avoids inventing seniority when the title is ambiguous", () => {
  assert.equal(inferExperience("Junior Frontend Developer"), "Junior");
  assert.equal(inferExperience("Senior Software Engineer"), "Senior");
  assert.equal(inferExperience("Mid-level React Developer"), "Mid-level");
  assert.equal(inferExperience("Software Engineer"), "Not specified");
});

test("HTML descriptions are reduced to safe readable text", () => {
  assert.equal(
    stripHtml('<p>Hello &amp; welcome&nbsp;to <strong>DevJobs</strong>.</p><script>alert(1)</script>'),
    "Hello & welcome to DevJobs.",
  );
  assert.equal(stripHtml("Build &mdash; ship &hellip; learn"), "Build — ship … learn");
});

test("external URLs only allow http and https protocols", () => {
  assert.equal(safeHttpUrl("javascript:alert(1)"), null);
  assert.equal(safeHttpUrl("not a url"), null);
  assert.equal(safeHttpUrl("https://remotive.com/remote-jobs")?.startsWith("https://"), true);
});
