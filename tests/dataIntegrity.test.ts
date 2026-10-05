import assert from "node:assert/strict";
import test from "node:test";
import { jobs } from "../src/data/jobs.ts";
import { safeHttpUrl } from "../src/utils/url.ts";

test("demo jobs have unique IDs and complete portfolio-safe data", () => {
  const ids = jobs.map((job) => job.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id < 0), "demo IDs should not collide with live API IDs");

  for (const job of jobs) {
    assert.ok(job.title.trim().length > 0);
    assert.ok(job.company.trim().length > 0);
    assert.ok(job.skills.length > 0);
    assert.ok(job.description.trim().length > 0);
    assert.ok(job.responsibilities.length > 0);
    assert.ok(job.requirements.length > 0);
    assert.ok(job.benefits.length > 0);
    assert.equal(job.source, "demo");
    assert.ok(safeHttpUrl(job.website));
    assert.ok(safeHttpUrl(job.applyUrl));

    if (job.salaryMin !== null && job.salaryMax !== null) {
      assert.ok(job.salaryMin <= job.salaryMax);
    }
  }
});

import { isApplicationRecordArray, isJobArray } from "../src/utils/typeGuards.ts";

test("storage guards accept valid data and reject malformed snapshots", () => {
  assert.equal(isJobArray(jobs), true);
  assert.equal(isJobArray([{ id: 1, title: "Broken" }]), false);

  const now = new Date().toISOString();
  assert.equal(
    isApplicationRecordArray([
      { job: jobs[0], status: "Applied", appliedAt: now, updatedAt: now },
    ]),
    true,
  );
  assert.equal(
    isApplicationRecordArray([
      { job: jobs[0], status: "Unknown", appliedAt: now, updatedAt: now },
    ]),
    false,
  );
  assert.equal(
    isApplicationRecordArray([
      { job: jobs[0], status: "Applied", appliedAt: "not-a-date", updatedAt: now },
    ]),
    false,
  );

  const invalidSalaryJob = { ...jobs[0], salaryMin: Number.POSITIVE_INFINITY };
  assert.equal(isJobArray([invalidSalaryJob]), false);
});
