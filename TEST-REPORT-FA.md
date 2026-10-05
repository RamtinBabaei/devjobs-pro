# گزارش نهایی تست — DevJobs Pro v2.1.1

این گزارش مربوط به نسخه‌ی GitHub-ready پروژه است.

## نتیجه تست‌های اجرایی

فرمان اجراشده در محیط بررسی:

```bash
node --experimental-strip-types --test tests/run.ts
```

نتیجه:

- 17 تست
- 17 پاس
- 0 شکست
- 0 تست Skip شده

موارد تست‌شده شامل:

- تبدیل Salary سالانه USD به مقادیر قابل فیلتر
- جلوگیری از تبدیل اشتباه Salary ساعتی، ماهانه و ارزهای غیر USD
- مدیریت Salary خالی
- Job Type normalization
- Skill inference بدون false-positive برای عبارت‌هایی مثل MongoDB / Go
- Experience inference بدون حدس زدن Seniority برای عنوان مبهم
- پاک‌سازی HTML و decode کردن entityهای رایج
- رد کردن URLهای ناامن مثل `javascript:`
- سلامت و یکتایی Demo Data و جلوگیری از تداخل ID با Live API
- Runtime validation برای LocalStorage snapshots
- رد کردن timestamp و salary نامعتبر در داده ذخیره‌شده
- Search بر اساس title/company/skills/location
- مستقل بودن Location و Work Mode filters
- Salary filter
- Salary sort
- Tech Stack filter
- ترکیب Job Type + Experience filters
- حفظ ترتیب API در حالت `Most relevant`

## TypeScript source audit

به دلیل اینکه محیط تولید این فایل امکان دانلود dependencyها از npm را نداشت، `npm install` در این محیط کامل نشد. برای اینکه Source بدون بررسی رها نشود، تمام فایل‌های `src` و `vite.config.ts` با TypeScript در حالت `strict` و declarationهای موقت فقط برای audit بررسی شدند.

نتیجه:

```text
PASS — no internal TypeScript errors detected in project source
```

Declarationهای موقت خارج از پروژه قرار داشتند و داخل ZIP نهایی نیستند.

> روی سیستم واقعی خودت بعد از `npm install` حتماً `npm run check` را اجرا کن. این دستور با dependencyهای واقعی، unit tests + TypeScript + production build را اجرا می‌کند.

## Static integrity audit

نتایج:

```text
Relative import audit: PASS (29 files scanned)
package.json audit: PASS
GitHub Actions YAML audit: PASS
HTML/favicon audit: PASS
```

همچنین Source برای الگوهای پرریسک/موقت بررسی شد:

- TODO / FIXME رهاشده: ندارد
- `@ts-ignore`: ندارد
- placeholderهایی مثل YOUR_NAME / YOUR_EMAIL: ندارد
- `dangerouslySetInnerHTML`: ندارد
- URL نمونه `example.com`: ندارد

## Production check روی سیستم مقصد

بعد از Extract:

```bash
npm install
npm run check
```

`npm run check` باید این سه مرحله را پشت سر هم اجرا کند:

```bash
npm test
npm run typecheck
npm run build
```

GitHub Actions هم قبل از Deploy همین Check را اجرا می‌کند؛ بنابراین اگر Check شکست بخورد، نسخه خراب Deploy نمی‌شود.
