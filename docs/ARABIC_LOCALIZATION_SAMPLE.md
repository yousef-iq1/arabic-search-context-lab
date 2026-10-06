# SerpApi Google Search API: Arabic Localization Sample

**Purpose:** show a small Arabic docs sample while keeping code names and familiar technical terms unchanged.

This is an **independent localization sample**, not an official SerpApi translation.

## Localization principles

1. Keep parameter names and code values exactly as the API expects: `location`, `gl`, `hl`, `async`, `no_cache`, `output`.
2. Use Modern Standard Arabic for reusable regional documentation.
3. Keep familiar developer terms such as API, JSON, HTML, Markdown, cache and SDK when translating them would make the documentation harder to scan.
4. Translate the **behavior**, not the syntax.
5. Make distinctions explicit when an English term can be misunderstood in Arabic. For example, `hl` is best explained as the Google interface language/locale instead of simply "لغة النتائج".
6. Use an example from an Arabic-speaking market so the reader can immediately connect the parameter to a real use case.

## Localized parameter sample

### `q` - مطلوب
يحدد عبارة البحث التي تريد إرسالها إلى Google. يمكنك استخدام استعلام عادي أو معاملات بحث Google المعتادة مثل `site:` و`intitle:` و`inurl:`.

### `location` - اختياري
يحدد الموقع الجغرافي الذي تريد محاكاة انطلاق البحث منه. للحصول على سياق أقرب إلى مستخدم حقيقي، يُفضَّل تحديد الموقع على مستوى المدينة.

إذا استخدمت `location` وحده، فقد تتأثر بعض النتائج أيضًا بدولة الـproxy. عندما تحتاج انحيازًا أوضح لدولة محددة، استخدم `gl` إلى جانب `location`.

### `gl` - اختياري
يحدد الدولة التي تريد إعطاءها انحيازًا في بحث Google باستخدام رمز دولة من حرفين، مثل `iq` للعراق أو `sa` للسعودية.

### `hl` - اختياري
يحدد لغة/locale واجهة Google المستخدمة في البحث. يمكن أن تكون القيمة رمز لغة مثل `ar` أو قيمة مرتبطة بمنطقة مثل `ar-iq` للعربية في العراق.

أتعمد عدم تسميته "لغة النتائج" لأن ذلك قد يوحي بأنه يفلتر صفحات النتائج إلى لغة واحدة. عندما يريد المطور تقييد لغات النتائج، يوجد `lr` كمدخل منفصل.

### `async` - اختياري
- `false` (الافتراضي): يبقى اتصال HTTP مفتوحًا إلى أن تجهز النتيجة.
- `true`: يرسل التطبيق البحث إلى SerpApi أولًا، ثم يسترجع النتيجة لاحقًا باستخدام **Search Archive API** ومعرّف البحث.

لا تستخدم `async` و`no_cache` معًا في الطلب نفسه.

### `no_cache` - اختياري
عندما تكون قيمته `true`، يجبر SerpApi على جلب نتيجة جديدة بدل استخدام نتيجة cached مطابقة للطلب. التوثيق الحالي يذكر أن cache للطلبات المتطابقة تنتهي تقريبًا بعد ساعة وأن النتائج cached لا تُحسب كبحث جديد من حصة الشهر.

### `output` - اختياري
- `json` - بيانات منظمة بصيغة JSON، وهي القيمة الافتراضية.
- `html` - HTML الخام.
- `md` - Markdown مهيأ لاستخدامات LLMs وAI agents.

## Mini Arabic quick-start

```ts
import { getJson } from "serpapi";

const result = await getJson({
  engine: "google",
  api_key: process.env.SERPAPI_KEY!,
  q: "أفضل أدوات الذكاء الاصطناعي للمبرمجين",
  location: "Baghdad,Baghdad Governorate,Iraq",
  gl: "iq",
  hl: "ar-iq",
});
```

## Terminology decisions

| Developer concept | Arabic treatment | Reason |
|---|---|---|
| API | API / واجهة برمجة التطبيقات عند أول ذكر فقط | Developers scan "API" faster |
| locale | locale + شرح عربي | More precise than reducing it to "language" |
| cache | cache / التخزين المؤقت | Common developer term; explain behavior once |
| server-side | server-side / على الخادم | Keeps framework/security language recognizable |
| Search Archive API | Keep product name | It is a named SerpApi API |
| country bias | انحياز الدولة | Distinguishes `gl` from `location` |
| interface language | لغة واجهة Google | Avoids confusing `hl` with language filtering |

## Validation boundary

If this became production documentation, I would review the terms with developers from several Arabic-speaking markets and keep one shared glossary across docs, pages, video captions, and support.
