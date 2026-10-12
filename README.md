# استقدام360 — الموقع التسويقي

موقع صفحة واحدة (عربي RTL) لنظام استقدام360. ملفات ثابتة بلا خطوات بناء.

## التشغيل محلياً
```
python3 -m http.server 8000
```
ثم افتح http://localhost:8000

## ما تحتاج ضبطه قبل الإطلاق
1. **رقم الواتساب**: في `assets/js/main.js` عدّل `CONFIG.whatsapp` (صيغة دولية بلا + ولا مسافات، مثل `9665XXXXXXXX`). النموذج يرسل الطلب إلى هذا الرقم.
2. **شعار العايد**: ضع الملف في `assets/clients/alayed.png` (أو عدّل المسار في `index.html`). حتى يوضع الملف يظهر اسم "العايد" نصاً.
3. **الدومين**: عند تسجيل istiqdam360.com عدّل `og:url` و`og:image` في `index.html` إن اختلف العنوان.
4. **ضريبة القيمة المضافة**: الأسعار في قسم الأسعار لا تذكر الضريبة. أضف ما يناسبك.

## النشر
`.github/workflows/pages.yml` ينشر الموقع على GitHub Pages عند كل دفع إلى `main`.
فعّل Pages من Settings ‏→ Pages ‏→ Source: GitHub Actions.

## الهيكل
- `index.html` الصفحة
- `assets/css/styles.css` التنسيق (الألوان في `:root`)
- `assets/js/main.js` القائمة والتبويبات والنموذج
- `assets/logo/` الشعار بكل نسخه
- `assets/img/` لقطات النظام (ببيانات تجريبية) وصورة المشاركة
- `assets/fonts/` الخطوط (Kufam وIBM Plex Sans Arabic) مستضافة محلياً
