# راهنمای DevJobs Pro v2.1.1

این نسخه برای Portfolio یک Frontend Developer طراحی شده و فقط یک UI ثابت نیست. پروژه شامل Routing، API واقعی، Cache، Search/Filter، Saved Jobs، Application Tracker و تست است.

## معماری

- `src/api` — دریافت Jobهای Remotive و تبدیل داده خارجی به مدل داخلی پروژه
- `src/context` — مدیریت Saved Jobs، Application Tracker و preferenceهای کاربر
- `src/pages` — صفحات Jobs، Saved، Applications و 404
- `src/components/jobs` — Job list، card، filters و details
- `src/components/layout` — Sidebar، Topbar و App Shell
- `src/hooks` — Hook امن‌تر برای localStorage
- `src/utils` — Search / Filter / Sort، URL safety و runtime type guards
- `tests` — تست منطق اصلی و سلامت داده‌های Demo

## جریان داده

1. `JobsPage` با TanStack Query تابع `fetchJobs()` را صدا می‌زند.
2. ابتدا cache شش‌ساعته بررسی می‌شود.
3. در صورت نیاز Request به Remotive Public API ارسال می‌شود.
4. داده API validate و normalize می‌شود.
5. URLهای خارجی فقط با پروتکل HTTP/HTTPS پذیرفته می‌شوند.
6. Salary فقط وقتی با اطمینان annual USD باشد برای فیلتر عددی normalize می‌شود.
7. اگر API در دسترس نباشد Demo Data نمایش داده می‌شود.
8. Search و Filter داخل URL ذخیره می‌شوند.
9. Saved Jobs و Applications در localStorage ذخیره می‌شوند و قبل از استفاده runtime validation می‌شوند.
10. Demo IDها منفی هستند تا با IDهای Live API تداخل نکنند.

## صفحات

### Jobs

- Search
- Location
- Work Mode
- Experience
- Salary
- Job Type
- Tech Stack
- Sorting
- Saved Jobs
- Job details
- Original source link
- Mark as applied

### Saved

Jobهایی که کاربر bookmark کرده است. حتی snapshot ذخیره‌شده می‌تواند برای نمایش جزئیات استفاده شود اگر Job دیگر در fetch جدید API وجود نداشته باشد.

### Applications

Tracker چهارمرحله‌ای:

- Applied
- Interview
- Offer
- Rejected

باز کردن لینک Job به‌تنهایی آن را Applied نمی‌کند؛ کاربر باید عمداً `Mark as applied` را انتخاب کند.

## Remotive

Live data از API عمومی Remotive دریافت می‌شود. پروژه Remotive را به عنوان Source معرفی می‌کند و برای هر Job به listing اصلی لینک می‌دهد.

API:

```text
https://remotive.com/api/remote-jobs?category=software-dev&limit=30
```

## GitHub Pages

از `HashRouter` استفاده شده تا Routeهای داخلی روی GitHub Pages پس از Refresh به 404 تبدیل نشوند.

## اجرای استاندارد قبل از Push

```bash
npm install
npm run check
```

بعد از اولین `npm install` فایل `package-lock.json` را هم Commit کن.
