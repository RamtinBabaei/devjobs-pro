# گزارش Code Review و Audit — DevJobs Pro v2.1.1

پروژه برای انتشار Portfolio/GitHub از نظر معماری، داده خارجی، TypeScript، state، routing، persistence، accessibility پایه، تست و deployment بازبینی شد.

## محدوده بررسی

حدود 3 هزار خط Source/Test در این بخش‌ها مرور شد:

- React app bootstrap و providers
- React Router routes و GitHub Pages routing
- TanStack Query configuration
- Remotive API request/cache/fallback
- API runtime validation و mapping
- Search / Filter / Sort
- Salary parsing
- Saved Jobs و localStorage
- Application Tracker
- Job Details و external links
- Sidebar / Mobile Drawer / Topbar
- Runtime type guards
- Demo Data
- Unit tests
- TypeScript configs
- Vite config
- GitHub Actions deployment
- README و مستندات

## مشکلات و ضعف‌هایی که اصلاح شدند

1. **Salary parsing اشتباه**
   - Rateهای ساعتی/ماهانه/هفتگی/روزانه دیگر به اشتباه Annual USD K تبدیل نمی‌شوند.
   - ارزهای مشخص غیر USD برای فیلتر عددی USD normalize نمی‌شوند.

2. **Skill detection false-positive**
   - تشخیص `Go` دیگر از داخل کلماتی مثل `MongoDB` فعال نمی‌شود.

3. **Experience fabrication**
   - عنوان‌های مبهم به شکل ساختگی Mid/Senior فرض نمی‌شوند و `Not specified` می‌گیرند.

4. **External data safety**
   - Payload API به عنوان `unknown` دریافت و runtime validate می‌شود.
   - Jobهای malformed حذف می‌شوند.
   - URLهای خارجی فقط `http` و `https` پذیرفته می‌شوند.

5. **HTML/API description cleanup**
   - script/style/tagها حذف می‌شوند.
   - HTML entityهای رایج decode می‌شوند.
   - `dangerouslySetInnerHTML` استفاده نشده است.

6. **API timeout cleanup**
   - Abort timeout در `finally` پاک می‌شود.

7. **API fallback**
   - قطعی API باعث Crash شدن UI نمی‌شود.
   - Demo Dataset با پیام واضح جایگزین می‌شود.

8. **Remotive data accuracy**
   - برای Live Jobها مسئولیت، requirement یا benefit ساختگی به employer نسبت داده نمی‌شود.
   - کاربر برای جزئیات تأییدشده به original listing هدایت می‌شود.

9. **Remotive attribution**
   - Source در UI و README مشخص است.
   - Live listing به منبع اصلی لینک می‌شود.

10. **Demo/live ID collision**
    - Demo IDها منفی شدند تا با IDهای عددی Live API تداخل نداشته باشند.
    - LocalStorage schema برای Saved/Applications به v4 ارتقا یافت.

11. **Location accuracy**
    - برای Remote Jobها محدودیت location دیگر پنهان نیست و همراه Work Mode نمایش داده می‌شود.

12. **Default sorting**
    - `Most relevant` دیگر به شکل مخفی بر اساس Salary مرتب نمی‌کند؛ ترتیب upstream API حفظ می‌شود (به جز featured demo role).

13. **URL filters**
    - URL query values validate می‌شوند و مقدارهای غیرمجاز به default برمی‌گردند.

14. **Location / Work Mode bug**
    - این دو Filter مستقل هستند و هر کدام فیلد صحیح را بررسی می‌کنند.

15. **Advanced filters**
    - Salary / Job Type / Tech Stack واقعی و functional هستند.

16. **Saved Jobs**
    - Saved snapshots validate می‌شوند.
    - Job ذخیره‌شده حتی اگر در fetch جدید API نباشد می‌تواند detail داشته باشد.

17. **Application Tracker honesty**
    - باز کردن original listing به صورت خودکار Job را Applied نمی‌کند.
    - فقط `Mark as applied` صریح، Application Record ایجاد می‌کند.

18. **LocalStorage resilience**
    - read/write failure کنترل می‌شود.
    - malformed data پاک/رد می‌شود.
    - تغییرات storage بین tabها sync می‌شوند.

19. **Job Card accessibility**
    - nested interactive control حذف شد.
    - Select Job و Save دو control مجزا هستند.

20. **Company Logo resilience**
    - خراب شدن Remote Logo با React state مدیریت می‌شود و fallback mark نمایش داده می‌شود.

21. **Mobile navigation**
    - body scroll هنگام Drawer قفل می‌شود.
    - Escape drawer را می‌بندد.

22. **Job Detail tabs**
    - tab/tab-panel relationship با `aria-controls` و `aria-labelledby` مشخص شده است.

23. **Informational popovers**
    - semantics از modal dialog اشتباه به informational region تغییر کرد.

24. **GitHub Pages**
    - HashRouter از 404 شدن routeها بعد از refresh جلوگیری می‌کند.
    - Workflow قبل از deploy، `npm run check` را اجرا می‌کند.

25. **Dependency drift**
    - نسخه packageها exact pin شده‌اند.
    - بعد از اولین `npm install` باید `package-lock.json` هم commit شود.

## مواردی که عمداً خارج از Scope v2 هستند

این‌ها Bug نیستند و در README شفاف شده‌اند:

- Authentication واقعی
- Backend / Database
- Sync بین دستگاه‌ها
- ارسال Email Job Alert
- ثبت واقعی Application در سایت کارفرما

این نسخه Saved/Application data را فقط در browser همان دستگاه نگه می‌دارد.

## نتیجه

نسخه v2.1.1 برای Portfolio از نظر Source-level audit، تست منطق، داده خارجی، URL safety، persistence و deployment workflow تمیز شده است. با این حال هیچ Code Review حرفه‌ای نمی‌تواند «صفر باگ در تمام مرورگرها و محیط‌ها» را تضمین کند؛ آخرین Gate قبل از Push باید `npm run check` روی سیستم خودت و GitHub Actions باشد.
