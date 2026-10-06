import { Code, ProofArticle, Section } from "@/components/ProofArticle";

export default function GuidePage(){
 return <ProofArticle dir="rtl" eyebrow="" title="بناء بحث عربي محلي باستخدام SerpApi وNext.js" intro="دليل قصير يشرح location وgl وhl، حماية مفتاح API، والتعامل مع البحث البطيء.">
  <Section title="الفكرة">
   <p>نفس العبارة العربية قد تعطي نتائج مختلفة في بغداد والرياض والقاهرة والدار البيضاء. لذلك أبقي نص البحث ثابتًا وأغيّر إعدادات المكان والدولة واللغة فقط.</p>
  </Section>
  <Section title="location وgl وhl">
   <ul><li><code>location</code>: المدينة أو الموقع الذي نريد محاكاة البحث منه.</li><li><code>gl</code>: انحياز الدولة في Google، مثل <code>iq</code> أو <code>sa</code>.</li><li><code>hl</code>: لغة وlocale واجهة Google، مثل <code>ar-iq</code> أو <code>ar-sa</code>.</li></ul>
   <Code>{`const context = {\n  location: "Baghdad,Baghdad Governorate,Iraq",\n  gl: "iq",\n  hl: "ar-iq",\n};`}</Code>
  </Section>
  <Section title="مفتاح SerpApi يبقى على الخادم">
   <p>إذا أرسلت المفتاح إلى browser code، يستطيع الزائر رؤيته. لذلك المتصفح يتحدث مع Route Handler داخل Next.js، والخادم وحده يقرأ <code>SERPAPI_KEY</code>.</p>
   <Code>{`import { getJson } from "serpapi";\n\nconst result = await getJson({\n  engine: "google",\n  api_key: process.env.SERPAPI_KEY!,\n  q: "أفضل أدوات الذكاء الاصطناعي للمبرمجين",\n  location: "Baghdad,Baghdad Governorate,Iraq",\n  gl: "iq",\n  hl: "ar-iq",\n});`}</Code>
  </Section>
  <Section title="ليش استخدمت async؟">
   <p>أحد اختبارات بغداد أخذ حوالي 33 ثانية. لهذا خليت live mode يبدأ البحث مع <code>async=true</code>، يأخذ Search ID، وبعدها يرجع إلى Search Archive حتى تجهز النتيجة.</p>
   <Code>{`const submitted = await getJson({\n  engine: "google",\n  api_key: process.env.SERPAPI_KEY!,\n  async: true,\n  q, location, gl, hl,\n});\n\nconst searchId = submitted.search_metadata.id;`}</Code>
   <p>كل مدينة لها حالتها الخاصة، لذلك مدينة بطيئة لا تمنع باقي النتائج من الظهور.</p>
  </Section>
  <Section title="النسخة العامة وحصة API">
   <p>الموقع العام يعرض نتائج SerpApi محفوظة مع وقت الالتقاط. هذا يخلي الزائر يشوف بيانات حقيقية بدون أربع طلبات جديدة كل مرة يفتح الصفحة. live mode يبقى موجودًا في الكود للاختبار.</p>
  </Section>
  <Section title="الخلاصة">
   <ul><li>RTL وحده لا يكفي للتوطين.</li><li>location وgl وhl لها أدوار مختلفة.</li><li>المفتاح يبقى على الخادم.</li><li>البحث البطيء يحتاج UI يتعامل مع الانتظار والفشل لكل مدينة بشكل مستقل.</li></ul>
  </Section>
  <Section title="English summary">
   <p dir="ltr">The demo runs the same Arabic query in Baghdad, Riyadh, Cairo, and Casablanca. The API key stays on the server, live searches can use async submission and Search Archive polling, and each city has separate location, gl, and hl settings.</p>
  </Section>
 </ProofArticle>
}