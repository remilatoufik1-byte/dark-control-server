import { useEffect, useMemo, useRef, useState } from "react";

export default function Home() {
  // =========================
  // إعدادات عامة
  // =========================
  const [lang, setLang] = useState("ar"); // 'ar' | 'en'
  const [username, setUsername] = useState("");
  const [usernameReady, setUsernameReady] = useState(false);

  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]); // [{sender:'user'|'bot', text, ts}]
  const [loading, setLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  const printableRef = useRef(null);

  // نصوص واجهة ثنائية اللغة
  const t = useMemo(() => {
    const tr = {
      ar: {
        title: "💻 Dark Control",
        subtitle: "محادثتك مع الذكاء الاصطناعي",
        start: "ابدأ المحادثة الآن...",
        placeholder: "اكتب رسالتك هنا...",
        send: "إرسال",
        sending: "جارٍ الإرسال...",
        clear: "مسح الكل",
        ttsOn: "تشغيل تحويل النص إلى صوت",
        ttsOff: "إيقاف تحويل النص إلى صوت",
        langToggle: "EN",
        print: "طباعة / حفظ PDF",
        yourName: "اسمك",
        saveName: "ابدأ",
        nameHint: "أدخل اسمك للبدء. سيتم حفظه للاستخدام لاحقًا.",
        alertEnterMessage: "الرجاء إدخال رسالة قبل الإرسال",
        errorServer: "خطأ في الاتصال بالخادم",
        errorGeneral: "حدث خطأ في المعالجة",
      },
      en: {
        title: "💻 Dark Control",
        subtitle: "Your conversation with AI",
        start: "Start the conversation...",
        placeholder: "Type your message...",
        send: "Send",
        sending: "Sending...",
        clear: "Clear",
        ttsOn: "Enable Text-to-Speech",
        ttsOff: "Disable Text-to-Speech",
        langToggle: "ع",
        print: "Print / Save PDF",
        yourName: "Your name",
        saveName: "Start",
        nameHint: "Enter your name to begin. It will be saved for later.",
        alertEnterMessage: "Please enter a message before sending",
        errorServer: "Failed to reach server",
        errorGeneral: "Processing error",
      },
    };
    return tr[lang];
  }, [lang]);

  const direction = lang === "ar" ? "rtl" : "ltr";
  const alignUser = lang === "ar" ? "text-right" : "text-left";
  const alignBot = lang === "ar" ? "text-left" : "text-right";

  // =========================
  // تخزين محلي (اسم المستخدم + المحادثة + اللغة + تفضيل TTS)
  // =========================
  useEffect(() => {
    try {
      const savedName = localStorage.getItem("dc_username");
      if (savedName) {
        setUsername(savedName);
        setUsernameReady(true);
      }
      const savedChat = localStorage.getItem("dc_chat");
      if (savedChat) setChat(JSON.parse(savedChat));
      const savedLang = localStorage.getItem("dc_lang");
      if (savedLang) setLang(savedLang);
      const savedTts = localStorage.getItem("dc_tts");
      if (savedTts) setTtsEnabled(savedTts === "1");
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("dc_chat", JSON.stringify(chat));
    } catch {}
  }, [chat]);

  useEffect(() => {
    try {
      localStorage.setItem("dc_lang", lang);
    } catch {}
  }, [lang]);

  useEffect(() => {
    try {
      localStorage.setItem("dc_tts", ttsEnabled ? "1" : "0");
    } catch {}
  }, [ttsEnabled]);

  // =========================
  // إشعار صوتي بسيط (Web Audio API) عند وصول رد
  // =========================
  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
      osc.stop(ctx.currentTime + 0.3);
    } catch {}
  };

  // =========================
  // TTS (SpeechSynthesis API)
  // =========================
  const speak = (text, langCode) => {
    if (!ttsEnabled) return;
    try {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = langCode === "ar" ? "ar" : "en-US";
      // اختيار صوت مناسب إن وجد
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v =>
        langCode === "ar"
          ? v.lang.toLowerCase().startsWith("ar")
          : v.lang.toLowerCase().startsWith("en")
      );
      if (preferred) utter.voice = preferred;
      window.speechSynthesis.cancel(); // أوقف أي نطق سابق
      window.speechSynthesis.speak(utter);
    } catch {}
  };

  // =========================
  // إرسال رسالة
  // =========================
  const sendMessage = async () => {
    if (!input.trim()) {
      alert(t.alertEnterMessage);
      return;
    }

    const userText = input.trim();
    const userMsg = { sender: "user", text: userText, ts: Date.now() };
    setChat(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `${username ? `(${username}) ` : ""}${userText}`,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const botMsg = { sender: "bot", text: data.reply, ts: Date.now() };
        setChat(prev => [...prev, botMsg]);
        playBeep();
        speak(data.reply, lang);
      } else {
        const errMsg = { sender: "bot", text: data.error || t.errorGeneral, ts: Date.now() };
        setChat(prev => [...prev, errMsg]);
        playBeep();
        speak(errMsg.text, lang);
      }
    } catch (e) {
      const errMsg = { sender: "bot", text: t.errorServer, ts: Date.now() };
      setChat(prev => [...prev, errMsg]);
      playBeep();
      speak(errMsg.text, lang);
    } finally {
      setLoading(false);
    }
  };

  // إدخال بالـ Enter
  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) sendMessage();
    }
  };

  // مسح المحادثة
  const clearChat = () => {
    setChat([]);
    try { localStorage.removeItem("dc_chat"); } catch {}
  };

  // حفظ/بدء الاسم
  const startWithName = () => {
    if (!username.trim()) return;
    setUsernameReady(true);
    try { localStorage.setItem("dc_username", username.trim()); } catch {}
  };

  // طباعة/حفظ PDF
  const printAsPdf = () => {
    window.print();
  };

  // =========================
  // واجهة المستخدم
  // =========================
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4"
         style={{ direction }}>
      {/* رأس الصفحة */}
      <div className="max-w-3xl mx-auto flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold">{t.title}</h1>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(prev => prev === "ar" ? "en" : "ar")}
              className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600"
              title="Toggle Language"
            >
              {t.langToggle}
            </button>

            <button
              onClick={() => setTtsEnabled(v => !v)}
              className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600"
              title="Toggle TTS"
            >
              {ttsEnabled ? t.ttsOff : t.ttsOn}
            </button>

            <button
              onClick={printAsPdf}
              className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700"
              title="Print / Save as PDF"
            >
              {t.print}
            </button>

            <button
              onClick={clearChat}
              className="px-3 py-1 rounded bg-red-600 hover:bg-red-700"
            >
              {t.clear}
            </button>
          </div>
        </div>

        <p className="text-gray-400">{t.subtitle}</p>

        {/* صندوق المحادثة */}
        <div className="bg-gray-800 rounded-lg shadow p-4">
          <div className="h-[65vh] overflow-y-auto border border-gray-700 rounded p-3 space-y-2" ref={printableRef}>
            {chat.length === 0 && (
              <p className="text-gray-400 text-center">{t.start}</p>
            )}

            {chat.map((m, i) => (
              <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap break-words p-3 rounded-lg shadow
                  ${m.sender === "user" ? "bg-blue-600" : "bg-gray-700"}
                  ${m.sender === "user" ? alignUser : alignBot}`}
                >
                  <div className="text-xs opacity-70 mb-1">
                    {m.sender === "user" ? (lang === "ar" ? "أنت" : "You") : (lang === "ar" ? "المساعد" : "Assistant")}
                  </div>
                  <div>{m.text}</div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-gray-400 text-center">{t.sending}</div>
            )}
          </div>

          {/* إدخال الرسالة */}
          <div className="mt-3 flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={t.placeholder}
              className="flex-1 p-3 rounded bg-gray-700 border border-gray-600 outline-none"
              rows={2}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? t.sending : t.send}
            </button>
          </div>
        </div>
      </div>

      {/* طبقة إدخال الاسم (Modal بسيط) */}
      {!usernameReady && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-2">{t.title}</h2>
            <p className="text-gray-400 mb-4">{t.nameHint}</p>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t.yourName}
              className="w-full p-3 rounded bg-gray-700 border border-gray-600 outline-none mb-4"
            />
            <button
              onClick={startWithName}
              className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700"
              disabled={!username.trim()}
            >
              {t.saveName}
            </button>
          </div>
        </div>
      )}
    </div>
  );
  }
