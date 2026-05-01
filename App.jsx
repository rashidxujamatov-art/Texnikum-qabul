// Telegram Bot Sozlamalari
const BOT_TOKEN = "8155144504:AAFmXM2svPCQZwF2J2bxW0VtGE1fBqtZFKg";
const CHAT_ID = "-1003917622237";

const professions = [
  {
    id: 'machinery',
    title: "Mashinasozlik texnologiyasi",
    desc: "Kelajak sanoatini boshqaring! CNC stanoklarini dasturlash va metallga ishlov berish sirlarini o'rganing.",
    icon: "⚙️",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 'welding',
    title: "Payvandlash texnologiyasi",
    desc: "Yuqori texnologiyali payvandlash — bu yuqori daromad, yuqori mas’uliyat va professionallik.",
    icon: "⚡",
    color: "from-orange-500 to-yellow-500"
  },
  {
    id: 'electronics',
    title: "Elektr va Elektronika",
    desc: "Har bir kelajak bitta impulsdan boshlanadi. Elektr va elektronika bu dunyoning tili.",
    icon: "🔌",
    color: "from-purple-500 to-indigo-500"
  },
  {
    id: 'design',
    title: "Grafik dizayn",
    desc: "G‘oya yetarli emas. Uni ko‘rinadigan va esda qoladigan shaklga aylantirish kerak.",
    icon: "🎨",
    color: "from-pink-500 to-rose-500"
  },
  {
    id: 'auto',
    title: "Avtomobillarga xizmat ko'rsatish",
    desc: "Zamonaviy avtomobillar sizning qo'lingizda! Eng yangi diagnostika usullarini o'zlashtiring.",
    icon: "🚗",
    color: "from-green-500 to-emerald-500"
  },
  {
    id: 'it',
    title: "Axborot texnologiyalari",
    desc: "IT bu raqamli dunyoni boshqarish ko‘nikmasi. Dasturlash va xavfsizlik sirlari.",
    icon: "💻",
    color: "from-blue-600 to-blue-400"
  }
];

const App = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedProf, setSelectedProf] = React.useState("");
  const [status, setStatus] = React.useState({ type: '', message: '' });
  const [formData, setFormData] = React.useState({
    fullname: "", viloyat: "", tuman: "", mfy: "", kocha: "", uy: "", 
    school_info: "", language: "O'zbek tili", foreign_language: "Ingliz tili",
    birthdate: "", passport: "", father_name: "",
    father_phone: "", mother_name: "", mother_phone: "",
    extra_info: ""
  });

  const [jsPDFLoaded, setJsPDFLoaded] = React.useState(false);

  React.useEffect(() => {
    if (window.jspdf) {
      setJsPDFLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.async = true;
    script.onload = () => setJsPDFLoaded(true);
    document.body.appendChild(script);
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openModal = (profTitle) => {
    setSelectedProf(profTitle);
    setIsModalOpen(true);
    setStatus({ type: '', message: '' });
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  const generatePDFBlob = async () => {
    if (!window.jspdf) return null;
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const today = new Date();
    const formattedDate = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;

    doc.setFontSize(10);
    doc.text("Samarqand shahar 4-son texnikum", 140, 20);
    doc.text("direktori, professor I. Ergashevga", 140, 25);
    doc.text("Yashovchi:", 140, 32);
    doc.text(`${formData.viloyat} vil., ${formData.tuman} tum.,`, 140, 37);
    doc.text(`${formData.mfy} MFY, ${formData.kocha} k., ${formData.uy}-uy`, 140, 42);
    doc.text("tomonidan", 185, 49);
    doc.text(`${formData.fullname}`, 140, 54);

    doc.setFontSize(18);
    doc.text("ARIZA", 105, 75, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Meni texnikumning kunduzgi ta'lim shaklining ${selectedProf}`, 20, 90);
    doc.text("mutaxassisligiga o'qishga qabul qilishingizni so'rayman.", 20, 97);

    let y = 115;
    const addDataLine = (label, value) => {
      doc.text(`${label}: ${value}`, 20, y);
      doc.setDrawColor(180, 180, 180);
      doc.line(20, y + 1, 190, y + 1);
      y += 12;
    };

    addDataLine("Tugallangan maktab/sinf", formData.school_info);
    addDataLine("Ta'lim tili", formData.language);
    addDataLine("Chet tili", formData.foreign_language);
    addDataLine("Tug'ilgan sana", formData.birthdate);
    addDataLine("Pasport ma'lumotlari", formData.passport);
    addDataLine("Otasining ismi", formData.father_name);
    addDataLine("Otasi telefon raqami", formData.father_phone);
    addDataLine("Onasining ismi", formData.mother_name);
    addDataLine("Onasi telefon raqami", formData.mother_phone);

    y += 10;
    doc.text("Qo'shimcha izohlar:", 20, y);
    const extraLines = doc.splitTextToSize(formData.extra_info || "Mavjud emas", 170);
    doc.text(extraLines, 20, y + 8);

    y = 260;
    doc.text(`Sana: ${formattedDate} yil`, 20, y);
    doc.text("Imzo: ________________", 130, y);

    return doc.output('blob');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jsPDFLoaded) {
      setStatus({ type: 'error', message: 'Hujjat generatori yuklanmoqda...' });
      return;
    }
    
    setStatus({ type: 'loading', message: 'Ariza yuborilmoqda...' });

    try {
      const pdfBlob = await generatePDFBlob();
      const tgFormData = new FormData();
      tgFormData.append('chat_id', CHAT_ID);
      tgFormData.append('document', pdfBlob, `Ariza_${formData.fullname}.pdf`);
      tgFormData.append('caption', `🔔 YANGI ARIZA!\n\n👤 F.I.Sh: ${formData.fullname}\n🎓 Yo'nalish: ${selectedProf}`);

      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
        method: 'POST',
        body: tgFormData
      });

      if (response.ok) {
        setStatus({ type: 'success', message: "Arizangiz muvaffaqiyatli yuborildi!" });
        setTimeout(closeModal, 3000);
      } else {
        throw new Error('Xatolik');
      }
    } catch (err) {
      setStatus({ type: 'error', message: "Xatolik yuz berdi." });
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-600 font-sans">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[180px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[180px] rounded-full"></div>
      </div>

      <nav className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 py-5 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-xl flex items-center justify-center font-bold">4</div>
          <span className="font-black tracking-tighter text-xl">KOICA SAMARKAND</span>
        </div>
        <div className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-widest text-slate-500">
          <a href="#kasblar" className="hover:text-blue-500">Yo'nalishlar</a>
          <a href="#aloqa" className="hover:text-blue-500">Bog'lanish</a>
        </div>
      </nav>

      <header className="relative z-10 pt-24 pb-32 px-6 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-10">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
            Qabul Mavsumi 2026-2027
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-10 leading-[1] tracking-tighter">
            Samarqand Shahri <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">4-son Texnikumi</span>
          </h1>
          <p className="max-w-3xl mx-auto text-slate-400 text-lg mb-14">
            Xalqaro ta'lim standartlari va Janubiy Koreya universitetlari bilan hamkorlikda kelajak kasblarini egallang.
          </p>
          <a href="#kasblar" className="inline-flex items-center gap-4 px-14 py-6 bg-blue-600 hover:bg-blue-500 rounded-[2rem] font-black text-xl transition-all shadow-2xl shadow-blue-600/40">
            O'QISHGA KIRISH 🚀
          </a>
      </header>

      <section id="kasblar" className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {professions.map((prof) => (
            <div key={prof.id} className="bg-white/5 border border-white/5 p-12 rounded-[3rem] hover:scale-[1.02] transition-transform">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${prof.color} flex items-center justify-center mb-10 text-3xl`}>
                {prof.icon}
              </div>
              <h3 className="text-2xl font-black mb-5">{prof.title}</h3>
              <p className="text-slate-400 text-sm mb-12">{prof.desc}</p>
              <button onClick={() => openModal(prof.title)} className="w-full py-5 bg-white/5 hover:bg-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                Hozir Ariza Berish
              </button>
            </div>
          ))}
        </div>
      </section>

      {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-950/98 backdrop-blur-2xl" onClick={closeModal} />
            <div className="relative z-10 bg-slate-900 border border-white/10 w-full max-w-5xl rounded-[3rem] p-8 md:p-12 overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-black">Ariza Formasi</h3>
                <button onClick={closeModal} className="w-12 h-12 bg-white/5 hover:bg-red-500/20 rounded-full flex items-center justify-center font-bold">X</button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-black">
                  <div className="space-y-6">
                    <input required name="fullname" placeholder="F.I.Sh" value={formData.fullname} onChange={handleChange} className="w-full bg-white border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500" />
                    <div className="grid grid-cols-2 gap-4">
                      <input required name="viloyat" placeholder="Viloyat" value={formData.viloyat} onChange={handleChange} className="w-full bg-white border border-white/10 rounded-2xl px-6 py-4 outline-none" />
                      <input required name="tuman" placeholder="Tuman" value={formData.tuman} onChange={handleChange} className="w-full bg-white border border-white/10 rounded-2xl px-6 py-4 outline-none" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <input required name="mfy" placeholder="MFY" value={formData.mfy} onChange={handleChange} className="bg-white border border-white/10 rounded-2xl px-4 py-4 outline-none" />
                      <input required name="kocha" placeholder="Ko'cha" value={formData.kocha} onChange={handleChange} className="bg-white border border-white/10 rounded-2xl px-4 py-4 outline-none" />
                      <input required name="uy" placeholder="Uy" value={formData.uy} onChange={handleChange} className="bg-white border border-white/10 rounded-2xl px-4 py-4 outline-none" />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <input required type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} className="w-full bg-white border border-white/10 rounded-2xl px-6 py-4 outline-none" />
                    <input required name="passport" placeholder="Pasport (AB1234567)" value={formData.passport} onChange={handleChange} className="w-full bg-white border border-white/10 rounded-2xl px-6 py-4 outline-none" />
                    <input required name="school_info" placeholder="Maktab va sinf" value={formData.school_info} onChange={handleChange} className="w-full bg-white border border-white/10 rounded-2xl px-6 py-4 outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/5 pt-8 text-black">
                  <div className="space-y-4">
                    <input required name="father_name" placeholder="Otasining ismi" value={formData.father_name} onChange={handleChange} className="w-full bg-white border border-white/10 rounded-2xl px-6 py-4 outline-none" />
                    <input required name="father_phone" placeholder="Otasining telefoni" value={formData.father_phone} onChange={handleChange} className="w-full bg-white border border-white/10 rounded-2xl px-6 py-4 outline-none" />
                  </div>
                  <div className="space-y-4">
                    <input required name="mother_name" placeholder="Onasining ismi" value={formData.mother_name} onChange={handleChange} className="w-full bg-white border border-white/10 rounded-2xl px-6 py-4 outline-none" />
                    <input required name="mother_phone" placeholder="Onasining telefoni" value={formData.mother_phone} onChange={handleChange} className="w-full bg-white border border-white/10 rounded-2xl px-6 py-4 outline-none" />
                  </div>
                </div>

                <div className="pt-6">
                  {status.message && (
                    <div className={`mb-6 p-4 rounded-2xl text-sm font-bold ${status.type === 'error' ? 'text-red-500 bg-red-500/10' : 'text-blue-400 bg-blue-500/10'}`}>
                      {status.message}
                    </div>
                  )}
                  <button type="submit" disabled={status.type === 'loading'} className="w-full py-6 bg-blue-600 hover:bg-blue-500 rounded-[2rem] font-black text-xl disabled:opacity-50 transition-all flex items-center justify-center gap-4">
                    ARIZANI YUBORISH 📄
                  </button>
                </div>
              </form>
            </div>
          </div>
      )}

      <footer id="aloqa" className="bg-black/40 border-t border-white/5 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <h4 className="font-black text-xl mb-6">KOICA SAMARKAND</h4>
            <p className="text-slate-500">Samarqand shahar, Spitamen shoh ko'chasi, 264A uy.</p>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-blue-500 mb-6">Aloqa</h4>
            <p className="text-slate-400">+998 93 347 74 48</p>
            <p className="text-slate-400">+998 91 526 67 14</p>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-blue-500 mb-6">Ish vaqti</h4>
            <p className="text-slate-400">Dush - Juma: 09:00 - 18:00</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// React komponentni DOM ga chiqarish
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
