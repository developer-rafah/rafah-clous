// ✅ ضع رابط Apps Script الأساسي هنا مرة واحدة
const SCRIPT_BASE = "https://script.google.com/macros/s/AKfycbxprw0OStSGKJmWU_XFuTCcFrdtPcKn9h634COxca46y-7DqiuSw5cAZNhbnsYWHZwm/exec";

// صفحات النظام داخل Apps Script
function urlStaff(){ return `${SCRIPT_BASE}?page=staff`; }
function urlAgent(){ return `${SCRIPT_BASE}?page=agent`; }

// Register Service Worker (للـ PWA)
(async function registerSW(){
  if (!("serviceWorker" in navigator)) return;
  try{
    await navigator.serviceWorker.register("/sw.js", { scope: "/" });
  }catch(e){
    // ما نوقف التطبيق لو فشل
    console.warn("SW register failed", e);
  }
})();

// مساعد: فتح رابط داخل تبويب جديد (للتحقق)
function openInNewTab(url){ window.open(url, "_blank", "noopener"); }

// expose for pages
window.PWA_WRAPPER = { SCRIPT_BASE, urlStaff, urlAgent, openInNewTab };
