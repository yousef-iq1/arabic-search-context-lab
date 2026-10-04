import { Code, ProofArticle, Section } from "@/components/ProofArticle";

export default function GuidePage(){
 return <ProofArticle dir="rtl" eyebrow="دليل تقني مستقل" title="بناء بحث عربي محلي باستخدام SerpApi وNext.js" intro="كيف تجعل الموقع الجغرافي، انحياز الدولة، ولغة Google مدخلات صريحة — مع إبقاء مفتاح API على الخادم والتعامل مع البحث البطيء بدون تجميد الواجهة.">
  <Section title="الفكرة">
   <p>«البحث العربي» ليس سياقًا واحدًا. المستخدم في بغداد والرياض والقاهرة والدار البيضاء قد يكتب العبارة نفسها حرفيًا، بينما تتغير النتائج بسبب الموقع الجغرافي، انحياز الدولة، وإعداد لغة واجهة Google.</p>
   <p>المشروع يقارن نفس الاستعلام العربي بين عدة أسواق ويُبقي الاستعلام ثابتًا حتى يكون السياق هو المتغير الذي ندرسه.</p>
  </Section>
  <Section title="location و gl و hl ليست الشيء نفسه">
   <ul><li><code>location</code>: من أين نريد محاكاة صدور البحث، ويفضل تحديده على مستوى المدينة.</li><li><code>gl</code>: انحياز الدولة في Google، مثل <code>iq</code> أو <code>sa</code>.</li><li><code>hl</code>: لغة/locale واجهة Google، مثل <code>ar-iq</code> أو <code>ar-sa</code>.</li></ul>
   <Code>{`const context = {\n  location: "Baghdad,Baghdad Governorate,Iraq",\n  gl: "iq",\n  hl: "ar-iq",\n};`}</Code>
  </Section>
  <Section title="مفتاح SerpApi يبقى server-side">
   <p>استدعاء SerpApi مباشرة من browser code سيكشف المفتاح. لذلك المتصفح يتحدث مع Route Handler داخل Next.js، والخادم وحده يقرأ <code>SERPAPI_KEY</code> من environment variable.</p>
   <Code>{`import { getJson } from "serpapi";\n\nconst result = await getJson({\n  engine: "google",\n  api_key: process.env.SERPAPI_KEY!,\n  q: "أفضل أدوات الذكاء الاصطناعي للمبرمجين",\n  location: "Baghdad,Baghdad Governorate,Iraq",\n  gl: "iq",\n  hl: "ar-iq",\n});`}</Code>
  </Section>
  <Section title="لماذا استخدمت async بدل Request طويلة؟">
   <p>أثناء اختبار حقيقي أخذ بحث محلي في بغداد قرابة 33 ثانية من البداية إلى اكتمال النتيجة. بدل أن أفترض أن كل search لحظي، عدّلت التصميم ليستخدم <code>async=true</code> ثم يسترجع النتيجة بواسطة Search ID من Search Archive.</p>
   <Code>{`const submitted = await getJson({\n  engine: "google",\n  api_key: process.env.SERPAPI_KEY!,\n  async: true,\n  q, location, gl, hl,\n});\n\nconst searchId = submitted.search_metadata.id;`}</Code>
   <p>الواجهة تعرض progress وتسمح لكل سوق أن يكتمل بشكل مستقل، بدل أن يؤدي سوق بطيء أو فاشل إلى إسقاط المقارنة كلها.</p>
  </Section>
  <Section title="كيف أحمي quota في نسخة عامة؟">
   <p>النسخة النهائية العامة مصممة لاستخدام real snapshots محفوظة مع وقت الالتقاط بدل تشغيل أربعة searches جديدة لكل زائر. لا توجد بيانات وهمية: أي snapshot يجب أن تأتي من response حقيقية وتُوسم بوضوح بأنها snapshot. Live mode يبقى في source للاختبار أو demo مضبوط.</p>
  </Section>
  <Section title="ماذا تعلمت؟">
   <ul><li>Localization قرار هندسي، وليس مجرد RTL.</li><li>ملاحظة latency حقيقية يجب أن تغيّر architecture عندما تستدعي ذلك.</li><li>المطور يحتاج أن يرى parameters والنتائج معًا حتى يفهم سبب الاختلاف.</li><li>الـAPI demo يصبح Developer Education عندما يشرح السبب، trade-offs، والأمان.</li></ul>
  </Section>
  <Section title="English summary">
   <p dir="ltr">Arabic Search Context Lab compares the same Arabic query across Baghdad, Riyadh, Cairo, and Casablanca. The integration keeps the API key server-side, uses asynchronous search submission plus Search Archive polling, tolerates partial market failures, and exposes localization parameters so developers can understand the difference between geographic origin, country bias, and Google interface language.</p>
  </Section>
 </ProofArticle>
}
