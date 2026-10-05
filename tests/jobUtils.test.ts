import assert from "node:assert/strict";
import test from "node:test";
import { jobs } from "../src/data/jobs.ts";
import {
  DEFAULT_FILTERS,
  filterAndSortJobs,
  matchesSalaryFilter,
} from "../src/utils/jobUtils.ts";

test("search matches title, company and skills", () => {
  const result = filterAndSortJobs(jobs, { ...DEFAULT_FILTERS, search: "React" });
  assert.ok(result.length >= 1);
  assert.ok(
    result.every((job) =>
      `${job.title} ${job.company} ${job.location} ${job.skills.join(" ")}`
        .toLowerCase()
        .includes("react"),
    ),
  );
});

test("location and work mode are independent", () => {
  const result = filterAndSortJobs(jobs, {
    ...DEFAULT_FILTERS,
    location: "San Francisco, CA",
    workMode: "Hybrid",
  });

  assert.equal(result.length, 1);
  assert.equal(result[0]?.company, "Stripe Labs");
});

test("salary filter excludes roles with unknown normalized annual salary", () => {
  const job = { ...jobs[0], salaryMin: null, salaryMax: null };
  assert.equal(matchesSalaryFilter(job, "$150K+"), false);
});

test("salary sort places a known high salary first", () => {
  const result = filterAndSortJobs(jobs, { ...DEFAULT_FILTERS, sort: "salary-high" });
  assert.ok((result[0]?.salaryMax ?? 0) >= (result.at(-1)?.salaryMax ?? 0));
});

test("tech filter only returns matching skills", () => {
  const result = filterAndSortJobs(jobs, { ...DEFAULT_FILTERS, techStack: "React" });
  assert.ok(result.length > 0);
  assert.ok(result.every((job) => job.skills.includes("React")));
});

test("job type and experience filters can be combined", () => {
  const result = filterAndSortJobs(jobs, {
    ...DEFAULT_FILTERS,
    jobType: "Full-time",
    experience: "Junior",
  });

  assert.ok(result.length > 0);
  assert.ok(result.every((job) => job.type === "Full-time" && job.experience === "Junior"));
});


test("default relevant sort preserves upstream order apart from featured jobs", () => {
  const input = [
    { ...jobs[1], featured: false },
    { ...jobs[2], featured: false },
    { ...jobs[0], featured: false },
  ];

  const result = filterAndSortJobs(input, DEFAULT_FILTERS);
  assert.deepEqual(
    result.map((job) => job.id),
    input.map((job) => job.id),
  );
});
