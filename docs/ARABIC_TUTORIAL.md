# بناء بحث عربي محلي باستخدام SerpApi وNext.js بدون كشف مفتاح API

> مشروع تطبيقي مستقل يشرح كيف يمكن لنفس الاستعلام العربي أن يعطي نتائج مختلفة حسب المدينة والدولة وإعدادات لغة Google، وكيف نبني ذلك بصورة آمنة في Next.js.

## الفكرة

عندما نقول «بحث عربي» من السهل أن نتعامل معه كأنه سياق واحد. لكنه ليس كذلك. المستخدم في بغداد، الرياض، القاهرة، أو الدار البيضاء قد يكتب نفس العبارة حرفيًا، بينما تتغير النتائج التي تعيدها Google بسبب الموقع الجغرافي، انحياز الدولة، وإعداد لغة الواجهة.

في هذا الدليل سنبني نموذجًا صغيرًا باستخدام SerpApi يقارن نفس الاستعلام العربي بين عدة أسواق. سنركز على أربع نقاط عملية:

1. كيف نحدد السياق المحلي باستخدام `location` و`gl` و`hl`.
2. لماذا يجب أن يبقى مفتاح SerpApi على الخادم وليس في المتصفح.
3. كيف نتعامل مع البحث الذي قد يستغرق وقتًا باستخدام `async=true` وSearch Archive.
4. كيف نحول الاستجابة إلى تجربة مفهومة للمطور، لا مجرد JSON كبير.

## ما الفرق بين location وgl وhl؟

هذه الثلاثة تبدو متشابهة، لكنها لا تعني الشيء نفسه:

- `location`: من أين نريد محاكاة صدور البحث. الأفضل استخدام مدينة محددة بدل دولة عامة.
- `gl`: انحياز الدولة في Google، مثل `iq` للعراق أو `sa` للسعودية.
- `hl`: لغة واجهة Google / locale، مثل `ar-iq` أو `ar-sa`.

مثال بغداد:

```ts
const context = {
  location: "Baghdad,Baghdad Governorate,Iraq",
  gl: "iq",
  hl: "ar-iq",
};
```

والنقطة المهمة هنا هي أن `hl` لا يساوي الموقع. يمكن لمستخدم داخل دولة معينة أن يستخدم واجهة Google بلغة مختلفة. لهذا السبب من الأفضل أن تتعامل معها كمدخلات منفصلة بدل خلطها تحت عنوان «اللغة».

## تثبيت SDK الرسمي

```bash
npm install serpapi
```

SDK الرسمي يدعم JavaScript وTypeScript و`async/await`، ويعطينا دوال مثل `getJson` و`getJsonBySearchId`.

## لا تستدع SerpApi من المتصفح مباشرة

هذا قرار أمني مهم. لو وضعت `SERPAPI_KEY` داخل React client component أو طلب JavaScript مباشر من المتصفح، سيصبح المفتاح قابلًا للرؤية للمستخدم.

في Next.js، الحل الأبسط هو أن تجعل المتصفح يتحدث مع Route Handler داخل تطبيقك، والـRoute Handler وحده يتحدث مع SerpApi.

مثال Environment Variable:

```env
SERPAPI_KEY=your_private_key
```

وملف `.env.local` يجب أن يكون ضمن `.gitignore`.

ثم على الخادم:

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

المتصفح لا يحتاج أبدًا إلى معرفة قيمة المفتاح.

## لماذا استخدمت async بدل الانتظار في Request واحدة؟

أثناء اختبار حقيقي على SerpApi، أخذ بحث محلي في بغداد حوالي 33 ثانية من البداية إلى اكتمال الاستجابة. هذا ليس خطأ بحد ذاته، لكنه غيّر قرار التصميم.

لو اعتمدت على Request واحدة طويلة، سيبدو التطبيق وكأنه متوقف، وقد تواجه timeouts أو تجربة مستخدم سيئة. SerpApi تدعم `async=true`: ترسل البحث أولًا، تحصل على Search ID، وبعدها تسترجع النتيجة من Search Archive عندما تجهز.

الإرسال:

```ts
const submitted = await getJson({
  engine: "google",
  api_key: process.env.SERPAPI_KEY!,
  async: true,
  q: "أفضل أدوات الذكاء الاصطناعي للمبرمجين",
  location: "Baghdad,Baghdad Governorate,Iraq",
  gl: "iq",
  hl: "ar-iq",
});

const searchId = submitted.search_metadata.id;
```

ثم الاسترجاع:

```ts
import { getJsonBySearchId } from "serpapi";

const archived = await getJsonBySearchId(searchId, {
  api_key: process.env.SERPAPI_KEY!,
});
```

قيمة `search_metadata.status` قد تكون `Queued` أو `Processing` أو `Success` أو حالة خطأ، لذلك واجهة جيدة يجب أن تتعامل مع هذه الحالات بدل افتراض أن النتيجة جاهزة فورًا.

## مقارنة أكثر من سوق

نفس الاستعلام يبقى ثابتًا. الذي يتغير هو context:

```ts
const markets = {
  baghdad: { location: "Baghdad,Baghdad Governorate,Iraq", gl: "iq", hl: "ar-iq" },
  riyadh: { location: "Riyadh,Riyadh Province,Saudi Arabia", gl: "sa", hl: "ar-sa" },
  cairo: { location: "Cairo,Cairo Governorate,Egypt", gl: "eg", hl: "ar-eg" },
  casablanca: { location: "Casablanca,Casablanca-Settat,Morocco", gl: "ma", hl: "ar-ma" },
};
```

ثم نرسل نفس `q` لكل سوق. عند رجوع النتائج لا نحتاج عرض كل شيء. للمقارنة التعليمية يكفي عادةً:

- أول عدة `organic_results`.
- `related_questions`.
- `search_parameters.google_domain`.
- `search_parameters.location_used`.
- `search_metadata.total_time_taken`.

بهذه الطريقة يرى المطور ما تغيّر ولماذا، بدل أن يواجه payload كبيرًا بلا سياق.

## لا تجعل فشل مدينة واحدة يلغي الجميع

إذا كنت تقارن أربع مدن، فمن غير الجيد أن يؤدي failure واحد إلى إخفاء ثلاثة نجاحات. استخدم `Promise.allSettled` عند الإرسال أو القراءة، واحتفظ بنتيجة كل سوق بشكل مستقل.

الفكرة:

```ts
const settled = await Promise.allSettled(
  selectedMarkets.map((market) => runSearch(market))
);
```

بعدها اعرض النتائج المكتملة فورًا، وأظهر حالة الانتظار أو الخطأ فقط للسوق المتأثر.

هذا مهم في Developer Experience: المستخدم يهتم بما نجح بقدر اهتمامه بما فشل.

## كيف أحمي الـquota في نسخة Portfolio عامة؟

الحساب المجاني محدود. لذلك لا أريد أن كل شخص يفتح الصفحة يستهلك أربع عمليات بحث حية.

الحل الذي اخترته للمشروع العام:

- أجري عمليات بحث حقيقية بنفسي.
- أحفظ نسخة normalized من النتائج كـsnapshots.
- أعرض تاريخ الالتقاط بوضوح.
- أكتب في الواجهة أنها `snapshot` وليست live.
- أبقي live mode موجودًا في source code ويمكن تشغيله server-side للاختبار أو demo مباشر.

هذا أفضل من اختراع بيانات وهمية، وأفضل من ترك API key/quota مفتوحين لكل زائر.

## ماذا تعلمت من التجربة؟

أكثر شيء مهم لم يكن مجرد نجاح أول request. التجربة أجبرتني على تغيير التصميم:

- latency الحقيقي دفعني إلى async architecture.
- متطلبات CORS والأمان أكدت أن التكامل يجب أن يكون server-side.
- `location` و`gl` و`hl` يجب شرحها منفصلة لأن كل واحدة تؤثر على السياق بطريقة مختلفة.
- المقارنة بين الأسواق تصبح مفيدة فقط عندما نعرض للمطور parameters والنتائج جنبًا إلى جنب.

بهذا الشكل ما تكون الصفحة مجرد demo؛ المطور يقدر يفهم ليش النتيجة تغيرت وشلون يطبق نفس الفكرة.

## الخطوة التالية

يمكن توسيع نفس الفكرة إلى use cases أقرب للعمل الحقيقي:

- مقارنة نتائج وظائف المطورين بين مدن عربية.
- مراقبة حضور شركة أو منتج في نتائج بحث محلية مختلفة.
- بناء dataset لمقارنة الأسئلة المرتبطة في عدة أسواق.
- استخدام Markdown output مع AI agent يحتاج بيانات بحث حية بحجم tokens أقل.

لهذا المشروع أبقيت الفكرة محدودة: نفس البحث، مدن مختلفة، وشرح واضح للإعدادات.

---

### English summary

Arabic Search Context Lab compares the exact same Arabic query across Baghdad, Riyadh, Cairo, and Casablanca using SerpApi. The integration keeps the API key server-side, uses asynchronous search submission and Search Archive polling for slower requests, tolerates partial market failures, and exposes `location`, `gl`, and `hl` so developers can understand why local search context changes.

### Official references

- SerpApi Google Search API documentation
- SerpApi JavaScript/TypeScript integration documentation
- SerpApi Search Archive API documentation
- SerpApi guidance on frontend CORS and secure API-key storage
