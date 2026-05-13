import React, { useState, useRef, useEffect } from 'react';
import { 
  Settings, ChevronLeft, ChevronRight,
  Home, Calendar as CalendarIcon, Map as MapIcon, Wallet, Navigation,
  Edit2, Trash2, Plus, Save, X, MapPin, Ticket, Clock, 
  ClipboardList, Check, QrCode, Bed, Plane, GripVertical
} from 'lucide-react';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const DOC_REF = doc(db, 'trips', 'main');

const DAY4 = {
  id: 'd4_jungfrau',
  date: '2026-06-08',
  title: 'Day 4',
  dayTheme: '少女峰登頂 ＋ 瀑布小鎮與懸崖村健行',
  events: [
    {
      id: 'e4_1', time: '08:14', title: '搭車上少女峰',
      subtitle: 'Grindelwald → Jungfraujoch Top of Europe',
      location: 'Grindelwald',
      note: '❶ 艾格快線 Eiger Express\nGrindelwald Terminal → Eigergletscher（約 15 分鐘）\n\n❷ 少女峰登山鐵路 Jungfrau Railway\nEigergletscher → Jungfraujoch（約 26 分鐘，紅色齒軌列車）',
      businessHours: '', ticket: ''
    },
    {
      id: 'e4_2', time: '', title: '少女峰頂景點巡遊',
      subtitle: 'Top of Europe 3,454m',
      location: 'Jungfraujoch',
      note: '❶ 斯芬克斯觀景台 Sphinx Observatorium — 搭高速電梯，途經少女峰全景體驗 360° 影片\n❷ 嬉雪樂園 Snow Fun Park — 11:00-16:00，套票 CHF 50 / 單項 CHF 20\n❸ 阿萊奇冰川 Aletsch Glacier — ⚠️ 請勿離開標記步道\n❹ 阿爾卑斯山震撼體驗館 Alpine Sensation（斯芬克斯→冰宮連接通道）\n❺ 冰宮 Ice Palace\n❻ 普拉特展望台 Plateau — 瑞士國旗地標\n\n📮 明信片：Top of Europe 商店購票，使用最高郵筒，蓋 Jungfraujoch 專屬郵戳\n🔖 護照蓋章：大廳旅遊櫃台旁自助蓋章台',
      businessHours: 'Snow Fun Park 11:00 – 16:00',
      ticket: 'Snow Fun CHF 50（套票）'
    },
    {
      id: 'e4_3', time: '12:15', title: '下山前往勞特布龍嫩',
      subtitle: 'Jungfraujoch → Lauterbrunnen',
      location: 'Kleine Scheidegg',
      note: '❶ 少女峰頂 → 小夏戴克 Kleine Scheidegg（約 35 分，紅色齒軌火車）\n❷ 小夏戴克 → 勞特布龍嫩 Lauterbrunnen（約 45 分，黃綠 WAB 火車，坐左側窗邊）\n\n⚠️ 小夏戴克是唯一分流點，請確認月台往「Lauterbrunnen」方向',
      businessHours: '', ticket: ''
    },
    {
      id: 'e4_4', time: '', title: '特呂默爾河瀑布 Trümmelbachfälle',
      subtitle: '世界級洞穴瀑布',
      location: 'Lauterbrunnen',
      note: '搭 141 巴士約 7 分鐘｜世界上唯一可進入的冰蝕洞穴瀑布\n⚠️ 任何 Pass 均無折扣\n建議停留 1 小時，17:00 關門',
      businessHours: '關門 17:00', ticket: 'CHF 16（無 Pass 折扣）'
    },
    {
      id: 'e4_5', time: '', title: '穆倫瀑布 Mürrenbach Falls ＋ 纜車上山',
      subtitle: 'Stechelberg → Mürren',
      location: 'Stechelberg',
      note: '搭 141 巴士至終點站 Stechelberg, Schilthornbahn\n下車即達，瀑布在纜車站後方山壁\n\n纜車：Stechelberg → Mürren（途經 Gimmelwald 請勿下車，直坐到第二站 Mürren）',
      businessHours: '', ticket: '半價 CHF 10（Swiss Travel Pass 50% 折扣）'
    },
    {
      id: 'e4_6', time: '', title: 'Mürren ＆ Gimmelwald 健行',
      subtitle: '懸崖村漫步',
      location: 'Mürren',
      note: '❶ 🌷 鮮花谷 — Allmendhubel 地面纜車（Swiss Travel Pass 50% 折扣）\n❷ 🪵 斷木地景\n\n下坡健行：Mürren → Gimmelwald（吉梅爾瓦爾德）\n🏠 特別景點：誠實商店\n\n纜車下山：Gimmelwald → Stechelberg',
      businessHours: '', ticket: 'Allmendhubel 纜車 STP 50% 折扣'
    },
    {
      id: 'e4_7', time: '', title: '施陶河瀑 Staubbachfall ＋ 返回格林德瓦',
      subtitle: 'Lauterbrunnen → Grindelwald',
      location: 'Lauterbrunnen',
      note: '搭 141 巴士在 Lauterbrunnen, Kirche（教堂站）下車\n沿主街漫步 10 分鐘回火車站，欣賞施陶河瀑\n\n返程：Lauterbrunnen → Zweilütschinen → Grindelwald\n⚠️ Zweilütschinen 換車請確認往「Grindelwald」方向，切勿誤搭往 Interlaken！',
      businessHours: '', ticket: ''
    }
  ]
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home'); 
  const [tripTitle, setTripTitle] = useState('Switzerland 遊記');
  const [tripSubtitle, setTripSubtitle] = useState('Viaggio · 瑞士之旅');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const [tempSubtitle, setTempSubtitle] = useState('');
  const [flightInfo, setFlightInfo] = useState('');

  const [days, setDays] = useState([
    {
      id: 'd1', date: '2026-06-10', title: 'Day 1',
      events: [
        { id: 'e1', time: '', title: '抵達蘇黎世機場', location: 'Zurich', note: '出關後先去開通 Swiss Travel Pass', businessHours: '', ticket: '免費' },
        { id: 'e2', time: '14:00', title: '市區觀光與蘇黎世湖', location: 'Zurich', note: '湖畔散步，適應時差', businessHours: '全天開放', ticket: '' }
      ]
    },
    {
      id: 'd2', date: '2026-06-11', title: 'Day 2',
      events: [
        { id: 'e3', time: '09:00', title: '出發前往格林德瓦', location: 'Grindelwald', note: '夢幻山坡漫步', businessHours: '', ticket: '' },
        { id: 'e4', time: '11:30', title: '少女峰登山齒軌列車', location: 'Jungfraujoch', note: '記得帶保暖外套跟墨鏡！山上氣溫大約 0 度', businessHours: '08:00 - 16:20', ticket: '190 (半價卡)' }
      ]
    },
    {
      id: 'd3', date: '2026-06-12', title: 'Day 3',
      events: [
        { id: 'e5', time: '10:00', title: '搭乘冰河列車', location: 'Glacier Express', note: '世界最慢的快車，沿途風景超美', businessHours: '', ticket: '49' }
      ]
    }
  ]);

  const [prepItems, setPrepItems] = useState([
    { id: 1, text: '護照 (效期需六個月以上)', done: true },
    { id: 2, text: '列印電子機票與住宿憑證', done: true },
    { id: 3, text: '開通網卡或 eSIM', done: false },
    { id: 4, text: '萬用轉接頭與行動電源', done: false },
    { id: 5, text: '兌換歐元與瑞士法郎現金', done: false },
    { id: 6, text: '個人常備藥品與高山症藥', done: false },
  ]);

  const [tickets, setTickets] = useState([
    { id: 't1', type: 'Pass', category: '交通', timeInfo: '連續 8 天', title: 'Swiss Travel Pass', note: '已開通，存於 Apple Wallet' },
    { id: 't2', type: 'Ticket', category: '景點', timeInfo: '06/11 11:30', title: '少女峰登山齒軌列車', note: '預訂代號: GRD-982X' }
  ]);

  const [accommodations, setAccommodations] = useState([
    { id: 'a1', dateStr: '6/10 - 6/11 (1晚)', location: 'Zurich', name: 'Hotel Schweizerhof Zürich', address: 'Bahnhofplatz 7, 8001 Zürich', timeInfo: 'Check-in: 15:00 / Out: 12:00', bookingRef: 'AGD-882910', voucherNote: '已全額付款，含雙人早餐。' },
    { id: 'a2', dateStr: '6/11 - 6/13 (2晚)', location: 'Grindelwald', name: 'Belvedere Swiss Quality Hotel', address: 'Dorfstrasse 53, 3818 Grindelwald', timeInfo: 'Check-in: 14:00 / Out: 11:00', bookingRef: 'BKG-44592', voucherNote: '需現場支付城市稅。' }
  ]);

  const [activeDayId, setActiveDayId] = useState('d2');
  const [isEditingDay, setIsEditingDay] = useState(false);
  const [editDayDate, setEditDayDate] = useState('');

  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragged, setDragged] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const saveTimer = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const snap = await getDoc(DOC_REF);
        if (snap.exists()) {
          const data = snap.data();
          if (data.days) {
            const loadedDays = data.days;
            const hasDay4 = loadedDays.some(d => d.id === 'd4_jungfrau');
            setDays(hasDay4 ? loadedDays : [...loadedDays, DAY4]);
          }
          if (data.prepItems) setPrepItems(data.prepItems);
          if (data.tickets) setTickets(data.tickets);
          if (data.accommodations) setAccommodations(data.accommodations);
          if (data.tripTitle) setTripTitle(data.tripTitle);
          if (data.tripSubtitle) setTripSubtitle(data.tripSubtitle);
          if (data.flightInfo) setFlightInfo(data.flightInfo);
          if (data.activeDayId) setActiveDayId(data.activeDayId);
        }
      } catch (e) {
        console.error('讀取資料失敗', e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (loading) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setDoc(DOC_REF, {
        days, prepItems, tickets, accommodations,
        tripTitle, tripSubtitle, flightInfo, activeDayId
      }).catch(e => console.error('儲存失敗', e));
    }, 1000);
  }, [days, prepItems, tickets, accommodations, tripTitle, tripSubtitle, flightInfo, activeDayId]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragged(false);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    setDragged(true);
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const activeDayIndex = days.findIndex(d => d.id === activeDayId);
  const activeDay = days[activeDayIndex] || days[0];

  const formatShortDate = (dateStr) => {
    if (!dateStr) return { day: '00', month: '00月', week: 'N/A' };
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = `${date.getMonth() + 1}月`;
    const weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const week = weeks[date.getDay()];
    return { day, month, week };
  };

  const handleAddDay = () => {
    const lastDate = days.length > 0 ? new Date(days[days.length - 1].date) : new Date();
    if (days.length > 0) lastDate.setDate(lastDate.getDate() + 1);
    const newDay = {
      id: `d${Date.now()}`,
      date: lastDate.toISOString().split('T')[0],
      title: `Day ${days.length + 1}`,
      events: []
    };
    setDays([...days, newDay]);
    setActiveDayId(newDay.id);
  };

  const saveTitle = () => {
    setTripTitle(tempTitle);
    setTripSubtitle(tempSubtitle);
    setIsEditingTitle(false);
  };

  const openEditDay = () => {
    if (!activeDay) return;
    setEditDayDate(activeDay.date);
    setIsEditingDay(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#E30613] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#999999] text-sm">載入行程中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111] font-sans pb-28">
      <header className="px-5 pt-10 pb-4 sticky top-0 z-30 bg-[#FAFAFA]/90 backdrop-blur-md flex items-start justify-between">
        <div className="flex-1">
          {isEditingTitle ? (
            <div className="space-y-2 bg-white p-3 rounded-xl border border-[#EEEEEE] shadow-sm">
              <input className="w-full bg-transparent border-b border-[#EEEEEE] focus:outline-none focus:border-[#E30613] text-sm text-[#666666]" value={tempSubtitle} onChange={(e) => setTempSubtitle(e.target.value)} placeholder="副標題 (如: Viaggio)"/>
              <input className="w-full bg-transparent border-b border-[#EEEEEE] focus:outline-none focus:border-[#E30613] font-serif text-2xl" value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} placeholder="主標題"/>
              <div className="flex justify-end pt-2">
                <button onClick={saveTitle} className="bg-[#E30613] text-white px-4 py-1.5 text-sm rounded-lg shadow-sm hover:bg-[#C80511] transition-colors">完成</button>
              </div>
            </div>
          ) : (
            <div onClick={activeTab === 'home' ? () => { setTempTitle(tripTitle); setTempSubtitle(tripSubtitle); setIsEditingTitle(true); } : undefined}>
  <p className="text-xs tracking-wider text-[#666666] mb-1">{tripSubtitle}</p>
  <h1 className="text-3xl font-serif tracking-wide text-[#111111]">{tripTitle}</h1>
</div>
          )}
        </div>
        
      </header>

      <main className="max-w-md mx-auto">
        {activeTab === 'itinerary' && (
          <div className="px-5 space-y-6">
            <div className="relative">
              <div ref={scrollRef} onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x cursor-grab active:cursor-grabbing" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {days.map((day, idx) => {
                  const { day: d, month, week } = formatShortDate(day.date);
                  const isActive = activeDayId === day.id;
                  return (
                    <button key={day.id} onClick={() => { if (dragged) return; setActiveDayId(day.id); }} className={`relative shrink-0 snap-start w-[76px] h-[90px] rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${isActive ? 'bg-[#E30613] text-white scale-105 shadow-[0_4px_12px_rgba(227,6,19,0.3)]' : 'bg-white border border-[#EEEEEE] text-[#111111] shadow-sm hover:border-[#E30613]/50'}`}>
                      {isActive && (
                        <div onClick={(e) => { e.stopPropagation(); if (dragged) return; openEditDay(); }} className="absolute top-1.5 right-1.5 w-5 h-5 flex items-center justify-center bg-white/25 rounded-full hover:bg-white/40 transition-colors">
                          <Edit2 size={10} className="text-white" />
                        </div>
                      )}
                      <span className={`text-[10px] font-bold tracking-widest mb-1 ${isActive ? 'text-white' : 'text-[#666666]'}`}>DAY {idx+1}</span>
                      <span className="text-[22px] font-serif leading-none mb-1">{d}</span>
                      <span className={`text-[9px] whitespace-nowrap ${isActive ? 'text-white opacity-90' : 'text-[#999999]'}`}>{month} {week}</span>
                    </button>
                  );
                })}
                <button onClick={() => { if (dragged) return; handleAddDay(); }} className="shrink-0 snap-start w-[76px] h-[90px] rounded-2xl flex items-center justify-center bg-transparent border-2 border-dashed border-[#DDDDDD] text-[#999999] hover:text-[#E30613] hover:border-[#E30613]/50 transition-colors">
                  <Plus size={20} />
                </button>
              </div>
            </div>
            
            <DayThemeEditor activeDay={activeDay} days={days} setDays={setDays} />
            {activeDay ? (
              <DayItineraryCard day={activeDay} days={days} setDays={setDays} />
            ) : (
              <div className="text-center py-10 bg-white rounded-[28px] border border-[#EEEEEE] shadow-sm">
                <p className="text-[#999999] text-sm">目前無任何天數，請點擊上方 + 號新增</p>
              </div>
            )}
            {isEditingDay && activeDay && (
              <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-5 backdrop-blur-sm">
                <div className="bg-white rounded-[24px] p-6 w-full max-w-sm shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="text-lg font-medium text-[#111111]">編輯天數 (Day {activeDayIndex + 1})</h3>
                    <button onClick={() => setIsEditingDay(false)} className="text-[#999999] hover:text-[#111111]"><X size={20}/></button>
                  </div>
                  <div className="mb-6">
                    <label className="block text-xs text-[#666666] mb-2">修改日期</label>
                    <input type="date" value={editDayDate} onChange={(e) => setEditDayDate(e.target.value)} className="w-full bg-[#FAFAFA] border border-[#EEEEEE] rounded-xl p-3 text-sm focus:outline-none focus:border-[#E30613] focus:ring-1 focus:ring-[#E30613] text-[#111111]"/>
                  </div>
                  <div className="flex justify-between items-center">
                    <button onClick={() => { const newDays = days.filter(d => d.id !== activeDay.id); setDays(newDays); setIsEditingDay(false); setActiveDayId(newDays[0]?.id || null); }} className="px-4 py-2.5 text-xs text-[#E30613] bg-[#FEF2F2] rounded-xl hover:bg-[#FCA5A5] transition-colors flex items-center gap-1">
                      <Trash2 size={14}/> 刪除此天
                    </button>
                    <button onClick={() => { setDays(days.map(d => d.id === activeDay.id ? { ...d, date: editDayDate } : d)); setIsEditingDay(false); }} className="px-6 py-2.5 text-xs text-white bg-[#E30613] rounded-xl shadow-[0_2px_8px_rgba(227,6,19,0.3)] hover:bg-[#C80511] transition-colors">
                      儲存修改
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === 'home' && <HomeMenuTab setActiveTab={setActiveTab} />}
        {activeTab === 'wallet' && <WalletTab />}
        {activeTab === 'map' && <MapTab />}
        {activeTab === 'prep' && <PrepTab items={prepItems} setItems={setPrepItems} onBack={() => setActiveTab('itinerary')} />}
        {activeTab === 'tickets' && <TicketsTab tickets={tickets} setTickets={setTickets} />}
        {activeTab === 'accommodation' && <AccommodationTab accommodations={accommodations} setAccommodations={setAccommodations} />}
        {activeTab === 'flights' && <FlightsTab flightInfo={flightInfo} setFlightInfo={setFlightInfo} onBack={() => setActiveTab('itinerary')} />}
      </main>

      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <style dangerouslySetInnerHTML={{__html: `.scrollbar-hide::-webkit-scrollbar { display: none; }`}} />
    </div>
  );
};

const DayThemeEditor = ({ activeDay, days, setDays }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTheme, setTempTheme] = useState('');

  if (!activeDay) return null;

  const handleEdit = () => {
    setTempTheme(activeDay.dayTheme || '');
    setIsEditing(true);
  };

  const handleSave = () => {
    setDays(days.map(d => d.id === activeDay.id ? { ...d, dayTheme: tempTheme } : d));
    setIsEditing(false);
  };

  return (
    <div className="px-1">
      {isEditing ? (
        <div className="flex items-center gap-2 bg-white border border-[#E30613]/30 rounded-xl px-3 py-2 shadow-sm">
          <input
            autoFocus
            type="text"
            value={tempTheme}
            onChange={e => setTempTheme(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            placeholder="輸入當天重點行程..."
            className="flex-1 text-sm text-[#111111] bg-transparent focus:outline-none"
          />
          <button onClick={handleSave} className="text-[#E30613] text-xs font-medium shrink-0">完成</button>
        </div>
      ) : (
        <div onClick={handleEdit} className="flex items-center gap-2 cursor-pointer group">
          {activeDay.dayTheme ? (
            <p className="font-serif text-xl text-[#111111] group-hover:text-[#E30613] transition-colors">
  {activeDay.dayTheme}
</p>
          ) : (
            <p className="font-serif text-base text-[#CCCCCC] group-hover:text-[#E30613] transition-colors flex items-center gap-1">
              <Plus size={13}/> 新增當天重點
            </p>
          )}
          <Edit2 size={12} className="text-[#CCCCCC] group-hover:text-[#E30613] transition-colors shrink-0"/>
        </div>
      )}
    </div>
  );
};

const DayItineraryCard = ({ day, days, setDays }) => {
  const [editingEventId, setEditingEventId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const dragRef = useRef(null);

  const deleteEvent = (eventId) => {
    setDays(days.map(d => d.id === day.id ? { ...d, events: d.events.filter(e => e.id !== eventId) } : d));
  };

  const reorder = (fromId, toId) => {
    if (!fromId || fromId === toId) return;
    const events = [...day.events];
    const fromIdx = events.findIndex(e => String(e.id) === String(fromId));
    const toIdx = events.findIndex(e => String(e.id) === String(toId));
    if (fromIdx < 0 || toIdx < 0) return;
    const [moved] = events.splice(fromIdx, 1);
    events.splice(toIdx, 0, moved);
    setDays(days.map(d => d.id === day.id ? { ...d, events } : d));
  };

  const onDragStart = (e, id) => { dragRef.current = id; setDraggingId(id); e.dataTransfer.effectAllowed = 'move'; };
  const onDragOver = (e, id) => { e.preventDefault(); setDragOverId(id); };
  const onDrop = (e, id) => { e.preventDefault(); reorder(dragRef.current, id); dragRef.current = null; setDraggingId(null); setDragOverId(null); };
  const onDragEnd = () => { dragRef.current = null; setDraggingId(null); setDragOverId(null); };

  const onTouchStart = (e, id) => { dragRef.current = id; setDraggingId(id); };
  const onTouchMove = (e) => {
    if (!dragRef.current) return;
    e.preventDefault();
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const row = el?.closest('[data-event-id]');
    if (row) setDragOverId(row.dataset.eventId);
  };
  const onTouchEnd = () => {
    if (dragRef.current && dragOverId) reorder(dragRef.current, dragOverId);
    dragRef.current = null;
    setDraggingId(null);
    setDragOverId(null);
  };

  return (
    <div className="bg-white rounded-[28px] shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-[#EEEEEE] p-6 pt-5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="flex items-center gap-2 text-lg font-medium tracking-wide text-[#111111]">
          <CalendarIcon size={18} className="text-[#E30613]" /> 今日行程
        </h2>
      </div>
      <div className="space-y-0">
        {day.events.map((event, idx) => (
          <div
            key={event.id}
            data-event-id={String(event.id)}
            draggable
            onDragStart={(e) => onDragStart(e, event.id)}
            onDragOver={(e) => onDragOver(e, event.id)}
            onDrop={(e) => onDrop(e, event.id)}
            onDragEnd={onDragEnd}
            className={`flex gap-4 transition-all ${
              idx !== day.events.length - 1 ? 'border-b border-dashed border-[#EEEEEE] pb-6 mb-6' : 'pb-2'
            } ${String(draggingId) === String(event.id) ? 'opacity-40' : ''}
            ${String(dragOverId) === String(event.id) ? 'bg-[#FEF2F2] rounded-xl' : ''}`}
          >
            <div className="flex flex-col items-center gap-2 shrink-0 pt-0.5">
              <span className="font-serif text-[#111111] text-lg font-medium w-12 text-left">{event.time ? event.time : '—'}</span>
              <div
                onTouchStart={(e) => { e.stopPropagation(); onTouchStart(e, event.id); }}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                className="text-[#DDDDDD] hover:text-[#999999] cursor-grab active:cursor-grabbing touch-none select-none"
              >
                <GripVertical size={16}/>
              </div>
            </div>
            <div className="flex-1">
              {editingEventId === event.id ? (
                <EventEditForm event={event} dayId={day.id} days={days} setDays={setDays} onClose={() => setEditingEventId(null)} />
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-2">
                      <h3 className="text-[17px] text-[#111111] font-medium leading-snug">{event.title}</h3>
                      {event.subtitle && <p className="text-sm text-[#666666] mt-0.5">{event.subtitle}</p>}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => setEditingEventId(event.id)} className="w-7 h-7 flex items-center justify-center text-[#CCCCCC] hover:text-[#E30613] hover:bg-[#FEF2F2] rounded-full transition-colors"><Edit2 size={13}/></button>
                      <button onClick={() => deleteEvent(event.id)} className="w-7 h-7 flex items-center justify-center text-[#CCCCCC] hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"><Trash2 size={13}/></button>
                    </div>
                  </div>
                  {(event.businessHours?.trim() || event.ticket?.trim()) && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {event.businessHours?.trim() && <span className="bg-[#FAFAFA] border border-[#EEEEEE] text-[#666666] text-[11px] px-2 py-1 rounded-md flex items-center gap-1"><Clock size={11} className="text-[#E30613]"/> {event.businessHours}</span>}
                      {event.ticket?.trim() && <span className="bg-[#FAFAFA] border border-[#EEEEEE] text-[#666666] text-[11px] px-2 py-1 rounded-md flex items-center gap-1"><Ticket size={11} className="text-[#E30613]"/> {(/\d/.test(event.ticket) && !/CHF/i.test(event.ticket)) ? `CHF ${event.ticket}` : event.ticket}</span>}
                    </div>
                  )}
                  {event.note && <p className="text-xs text-[#666666] mt-2 bg-[#FAFAFA] p-2.5 rounded-lg inline-block border border-[#EEEEEE] whitespace-pre-wrap">{event.note}</p>}
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => window.open(event.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(event.title)}`, '_blank')} className="flex-1 py-1.5 bg-[#FAFAFA] border border-[#EEEEEE] rounded-lg text-xs text-[#666666] flex items-center justify-center gap-1 shadow-sm hover:text-[#E30613] hover:border-[#E30613]/30 transition-colors"><Navigation size={12}/> Google 地圖</button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
        {editingEventId === 'new' ? (
          <div className="mt-6 pt-4 border-t border-dashed border-[#EEEEEE]">
            <EventEditForm dayId={day.id} days={days} setDays={setDays} onClose={() => setEditingEventId(null)} />
          </div>
        ) : (
          <div className="pt-6 mt-6 border-t border-dashed border-[#EEEEEE] flex justify-center relative">
            <span className="text-sm text-[#999999]">還有 {day.events.length} 個行程</span>
            <button onClick={() => setEditingEventId('new')} className="absolute right-0 -top-8 w-14 h-14 bg-[#E30613] text-white rounded-full shadow-[0_4px_12px_rgba(227,6,19,0.3)] flex items-center justify-center hover:scale-105 hover:bg-[#C80511] transition-all z-20"><Plus size={24} /></button>
          </div>
        )}
      </div>
    </div>
  );
};

const EventEditForm = ({ event, dayId, days, setDays, onClose }) => {
  const isNew = !event;
  const [formData, setFormData] = useState(event || { time: '', title: '', location: '', note: '', businessHours: '', ticket: '' });

  const handleSave = () => {
    if (!formData.title.trim()) return;
    const updatedDays = days.map(d => {
      if (d.id === dayId) {
        let newEvents = isNew ? [...d.events, { ...formData, id: `e${Date.now()}` }] : d.events.map(e => e.id === event.id ? formData : e);
        return { ...d, events: newEvents };
      }
      return d;
    });
    setDays(updatedDays);
    onClose();
  };

  const clearTime = (e) => { e.preventDefault(); e.stopPropagation(); setFormData({...formData, time: ''}); };

  const handleBusinessHoursChange = (e) => {
  let val = e.target.value;
  const isDeleting = formData.businessHours && val.length < formData.businessHours.length;
  if (!isDeleting) {
    if (/^\d{4}$/.test(val)) {
      val = `${val.slice(0, 2)}:${val.slice(2, 4)} - `;
    } else if (/^\d{2}:\d{2}$/.test(val)) {
      val = `${val} - `;
    } else if (/^\d{2}:\d{2} - \d{4}$/.test(val)) {
      const parts = val.split(' - ');
      val = `${parts[0]} - ${parts[1].slice(0, 2)}:${parts[1].slice(2, 4)}`;
    }
  }
  setFormData({...formData, businessHours: val});
};

  return (
    <div className="bg-[#FAFAFA] p-4 rounded-xl space-y-3 shadow-inner border border-[#EEEEEE]">
      <div className="flex gap-3">
        <div className="w-1/3 relative">
          <input type="time" value={formData.time || ''} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full bg-white border border-[#EEEEEE] rounded-lg p-2 text-sm focus:outline-none focus:border-[#E30613] focus:ring-1 focus:ring-[#E30613]"/>
          {!formData.time ? (<div className="absolute top-1/2 -translate-y-1/2 left-3 text-[#999999] text-[13px] pointer-events-none bg-white px-1">—</div>) : (<button type="button" onClick={clearTime} className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-[#999999] hover:text-[#E30613] bg-[#FAFAFA] rounded-full z-10"><X size={12} /></button>)}
        </div>
        <input type="text" placeholder="行程標題 *" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-2/3 bg-white border border-[#EEEEEE] rounded-lg p-2 text-sm focus:outline-none focus:border-[#E30613] focus:ring-1 focus:ring-[#E30613]"/>
      </div>
      <input type="text" placeholder="副標語 (如: 抵達住宿及寄放行李)" value={formData.subtitle || ''} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full bg-white border border-[#EEEEEE] rounded-lg p-2 text-sm focus:outline-none focus:border-[#E30613] focus:ring-1 focus:ring-[#E30613]"/>
      <input type="text" placeholder="Google Maps 連結" value={formData.mapUrl || ''} onChange={e => setFormData({...formData, mapUrl: e.target.value})} className="w-full bg-white border border-[#EEEEEE] rounded-lg p-2 text-sm focus:outline-none focus:border-[#E30613] focus:ring-1 focus:ring-[#E30613]"/>
      <div className="flex gap-3">
        <div className="w-1/2 flex items-center bg-white border border-[#EEEEEE] rounded-lg px-2 focus-within:border-[#E30613] focus-within:ring-1 focus-within:ring-[#E30613]">
          <Clock size={14} className="text-[#999999] shrink-0" />
          <input type="text" placeholder="營業時間" value={formData.businessHours || ''} onChange={handleBusinessHoursChange} className="w-full bg-transparent p-2 text-sm focus:outline-none text-[#111111]"/>
        </div>
        <div className="w-1/2 flex items-center bg-white border border-[#EEEEEE] rounded-lg px-2 focus-within:border-[#E30613] focus-within:ring-1 focus-within:ring-[#E30613]">
          <Ticket size={14} className="text-[#999999] shrink-0" />
          <input type="text" placeholder="門票資訊" value={formData.ticket || ''} onChange={e => setFormData({...formData, ticket: e.target.value})} className="w-full bg-transparent p-2 text-sm focus:outline-none text-[#111111]"/>
        </div>
      </div>
      <textarea placeholder="備註資訊..." value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} rows="2" className="w-full bg-white border border-[#EEEEEE] rounded-lg p-2 text-sm focus:outline-none focus:border-[#E30613] focus:ring-1 focus:ring-[#E30613] resize-none"/>
      <div className="flex justify-end gap-2 pt-1">
        <button onClick={onClose} className="px-4 py-1.5 text-xs text-[#666666] bg-white rounded-lg border border-[#EEEEEE] hover:bg-[#FAFAFA] transition-colors">取消</button>
        <button onClick={handleSave} className="px-4 py-1.5 text-xs text-white bg-[#E30613] rounded-lg shadow-[0_2px_8px_rgba(227,6,19,0.3)] hover:bg-[#C80511] transition-colors">儲存</button>
      </div>
    </div>
  );
};

const HomeMenuTab = ({ setActiveTab }) => (
  <div className="px-5 mt-2 pb-6">
    <div className="grid grid-cols-2 gap-4">
      <MenuCard onClick={() => setActiveTab('prep')} icon={<ClipboardList size={24} className="text-[#E30613]"/>} title="行前清單" subtitle="行李與出發前準備" titleEng="Checklist" />
      <MenuCard onClick={() => setActiveTab('flights')} icon={<Plane size={24} className="text-[#E30613]"/>} title="航班資訊" subtitle="航班編號與時刻表" titleEng="Flights" />
      <MenuCard onClick={() => setActiveTab('itinerary')} icon={<CalendarIcon size={24} className="text-[#E30613]"/>} title="每日行程" subtitle="編輯時間地點與備註" titleEng="Plans" />
      <MenuCard onClick={() => setActiveTab('accommodation')} icon={<Bed size={24} className="text-[#E30613]"/>} title="住宿資訊" subtitle="飯店地址與訂房紀錄" titleEng="Hotels" />
      <MenuCard onClick={() => setActiveTab('wallet')} icon={<Wallet size={24} className="text-[#E30613]"/>} title="匯率換算" subtitle="自動換算為台幣" titleEng="Currency" />
      <MenuCard onClick={() => setActiveTab('tickets')} icon={<Ticket size={24} className="text-[#E30613]"/>} title="票券資訊" subtitle="交通票與景點門票" titleEng="Tickets" />
    </div>
  </div>
);

const MenuCard = ({ icon, title, subtitle, titleEng, onClick }) => (
  <div onClick={onClick} className="bg-white p-5 rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#EEEEEE] aspect-square flex flex-col justify-end relative overflow-hidden group hover:shadow-[0_4px_16px_rgba(227,6,19,0.08)] hover:border-[#E30613]/30 transition-all cursor-pointer">
    <div className="absolute top-5 left-5 bg-[#FEF2F2] w-[46px] h-[46px] rounded-[16px] flex items-center justify-center shrink-0">{icon}</div>
    <div>
      <p className="font-serif italic text-[#999999] text-[13px] mb-0.5">{titleEng}</p>
      <h3 className="text-[17px] font-medium tracking-wide text-[#111111] mb-1 group-hover:text-[#E30613] transition-colors">{title}</h3>
      <p className="text-[10px] text-[#666666] leading-tight">{subtitle}</p>
    </div>
  </div>
);

const AccommodationTab = ({ accommodations, setAccommodations }) => {
  const [editingId, setEditingId] = useState(null);
  const handleDelete = (id) => setAccommodations(accommodations.filter(a => a.id !== id));

  return (
    <div className="px-5 mt-4 space-y-4 pb-4">
      <h2 className="text-xl font-serif mb-4 text-[#111111]">住宿資訊 <span className="float-right text-xs text-[#999999] font-sans italic pt-2">Hotels</span></h2>
      {accommodations.map((acc) => (
        <div key={acc.id}>
          {editingId === acc.id ? (
            <AccommodationEditForm accommodation={acc} onSave={(updatedAcc) => { setAccommodations(accommodations.map(a => a.id === acc.id ? updatedAcc : a)); setEditingId(null); }} onCancel={() => setEditingId(null)} />
          ) : (
            <div className="bg-white rounded-[24px] shadow-sm border border-[#EEEEEE] p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#FEF2F2] rounded-bl-[100%] z-0"></div>
              <Bed size={40} className="absolute top-2 right-2 text-[#E30613] z-0 opacity-20"/>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] bg-[#FEF2F2] text-[#E30613] px-2 py-0.5 rounded font-medium tracking-wide">{acc.dateStr}</span>
                  <span className="text-xs font-serif text-[#999999] pr-8">{acc.location}</span>
                </div>
                <h3 className="font-medium text-[#111111] text-[17px] leading-tight pr-10">{acc.name}</h3>
                <div className="text-xs text-[#666666] mt-3 space-y-1.5">
                  {acc.timeInfo && <p className="flex items-center gap-1"><Clock size={12} className="shrink-0 text-[#E30613]"/> {acc.timeInfo}</p>}
                  {acc.stayInfo && <p className="mt-1 text-[#666666] whitespace-pre-wrap">{acc.stayInfo}</p>}
                </div>
                {acc.bookingRef && (
  <div className="mt-3 pt-3 border-t border-dashed border-[#EEEEEE]">
    <p className="text-[10px] text-[#999999] mb-1">訂房代號</p>
    <p className="text-base font-serif tracking-widest text-[#E30613] font-bold">{acc.bookingRef}</p>
  </div>
)}
{acc.voucherNote && (
  <div className="mt-3 pt-3 border-t border-dashed border-[#EEEEEE]">
    <p className="text-[10px] text-[#999999] mb-1">憑證備註</p>
    <p className="text-xs text-[#666666] whitespace-pre-wrap">{acc.voucherNote}</p>
  </div>
)}
                <div className="absolute top-0 right-0 flex flex-col gap-1 mt-1 mr-1">
                  <button onClick={() => setEditingId(acc.id)} className="w-6 h-6 flex items-center justify-center bg-white/80 rounded-full text-[#CCCCCC] hover:text-[#E30613] transition-colors"><Edit2 size={12}/></button>
                  <button onClick={() => handleDelete(acc.id)} className="w-6 h-6 flex items-center justify-center bg-white/80 rounded-full text-[#CCCCCC] hover:text-[#E30613] transition-colors"><Trash2 size={12}/></button>
                </div>
                <div className="mt-4 pt-3 border-t border-dashed border-[#EEEEEE]">
  <button onClick={() => window.open(acc.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(acc.name)}`, '_blank')} className="w-full py-1.5 bg-[#FAFAFA] border border-[#EEEEEE] rounded-lg text-xs text-[#666666] flex items-center justify-center gap-1 hover:text-[#E30613] transition-colors"><Navigation size={12}/> Google 地圖</button>
</div>
              </div>
            </div>
          )}
        </div>
      ))}
      {editingId === 'new' ? (
        <AccommodationEditForm onSave={(newAcc) => { setAccommodations([...accommodations, { ...newAcc, id: `a${Date.now()}` }]); setEditingId(null); }} onCancel={() => setEditingId(null)} />
      ) : (
        <button onClick={() => setEditingId('new')} className="w-full py-3 border border-dashed border-[#DDDDDD] rounded-2xl text-sm text-[#999999] flex items-center justify-center gap-1 hover:bg-white hover:text-[#E30613] hover:border-[#E30613]/50 transition-colors"><Plus size={18}/> 新增住宿紀錄</button>
      )}
      
    </div>
  );
};

const AccommodationEditForm = ({ accommodation, onSave, onCancel }) => {
  const [formData, setFormData] = useState(accommodation || { checkIn: '', checkOut: '', checkInTime: '', checkOutTime: '', location: '', name: '', mapUrl: '', stayInfo: '', bookingRef: '', voucherNote: '' });

  const handleTimeInput = (val) => {
    val = val.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length >= 3) val = val.slice(0, 2) + ':' + val.slice(2);
    return val;
  };

  const calcNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    return Math.round((new Date(formData.checkOut) - new Date(formData.checkIn)) / (1000 * 60 * 60 * 24));
  };

  const formatDateStr = () => {
    if (!formData.checkIn || !formData.checkOut) return '';
    const ci = new Date(formData.checkIn);
    const co = new Date(formData.checkOut);
    return `${ci.getMonth()+1}/${ci.getDate()} - ${co.getMonth()+1}/${co.getDate()} (${calcNights()}晚)`;
  };

  const formatTimeInfo = () => {
    const ci = formData.checkInTime ? `Check-in ${formData.checkInTime}` : '';
    const co = formData.checkOutTime ? `Check-out ${formData.checkOutTime}` : '';
    return [ci, co].filter(Boolean).join(' / ');
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;
    onSave({ ...formData, dateStr: formatDateStr(), timeInfo: formatTimeInfo() });
  };

  return (
    <div className="bg-[#FAFAFA] p-4 rounded-[24px] shadow-inner border border-[#EEEEEE] space-y-3">
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-[10px] text-[#999999] mb-1 block">入住日期</label>
          <input type="date" value={formData.checkIn || ''} onChange={e => setFormData({...formData, checkIn: e.target.value})} className="w-full bg-white border border-[#EEEEEE] rounded-lg p-2 text-sm focus:outline-none focus:border-[#E30613]"/>
        </div>
        <div className="flex-1">
          <label className="text-[10px] text-[#999999] mb-1 block">退房日期</label>
          <input type="date" value={formData.checkOut || ''} onChange={e => setFormData({...formData, checkOut: e.target.value})} className="w-full bg-white border border-[#EEEEEE] rounded-lg p-2 text-sm focus:outline-none focus:border-[#E30613]"/>
        </div>
      </div>
      {formData.checkIn && formData.checkOut && calcNights() > 0 && (
        <div className="bg-[#FEF2F2] rounded-lg px-3 py-2 text-sm text-[#E30613] font-medium text-center">
          {formatDateStr()} · 共 {calcNights()} 晚
        </div>
      )}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-[10px] text-[#999999] mb-1 block">Check-in 時間</label>
          <input type="text" placeholder="1500" value={formData.checkInTime || ''} onChange={e => setFormData({...formData, checkInTime: handleTimeInput(e.target.value)})} className="w-full bg-white border border-[#EEEEEE] rounded-lg p-2 text-sm focus:outline-none focus:border-[#E30613]"/>
        </div>
        <div className="flex-1">
          <label className="text-[10px] text-[#999999] mb-1 block">Check-out 時間</label>
          <input type="text" placeholder="1100" value={formData.checkOutTime || ''} onChange={e => setFormData({...formData, checkOutTime: handleTimeInput(e.target.value)})} className="w-full bg-white border border-[#EEEEEE] rounded-lg p-2 text-sm focus:outline-none focus:border-[#E30613]"/>
        </div>
      </div>
      <input type="text" placeholder="城市/地區 (如: Zurich)" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-white border border-[#EEEEEE] rounded-lg p-2 text-sm focus:outline-none focus:border-[#E30613]"/>
      <input type="text" placeholder="飯店名稱 *" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-[#EEEEEE] rounded-lg p-2 text-sm focus:outline-none focus:border-[#E30613]"/>
      <input type="text" placeholder="地址 或 Google Maps 連結" value={formData.mapUrl || ''} onChange={e => setFormData({...formData, mapUrl: e.target.value})} className="w-full bg-white border border-[#EEEEEE] rounded-lg p-2 text-sm focus:outline-none focus:border-[#E30613]"/>
      <textarea placeholder="入住資訊 (如: 含早餐、需押金...)" value={formData.stayInfo || ''} onChange={e => setFormData({...formData, stayInfo: e.target.value})} rows="2" className="w-full bg-white border border-[#EEEEEE] rounded-lg p-2 text-sm focus:outline-none focus:border-[#E30613] resize-none"/>
      <div className="flex gap-3 pt-2 border-t border-dashed border-[#EEEEEE]">
        <input type="text" placeholder="訂房代號 (選填)" value={formData.bookingRef || ''} onChange={e => setFormData({...formData, bookingRef: e.target.value})} className="w-1/2 bg-white border border-[#EEEEEE] rounded-lg p-2 text-sm focus:outline-none focus:border-[#E30613]"/>
        <input type="text" placeholder="憑證備註 (如: 已付款)" value={formData.voucherNote || ''} onChange={e => setFormData({...formData, voucherNote: e.target.value})} className="w-1/2 bg-white border border-[#EEEEEE] rounded-lg p-2 text-sm focus:outline-none focus:border-[#E30613]"/>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button onClick={onCancel} className="px-4 py-1.5 text-xs text-[#666666] bg-white rounded-lg border border-[#EEEEEE] hover:bg-[#FAFAFA] transition-colors">取消</button>
        <button onClick={handleSave} className="px-4 py-1.5 text-xs text-white bg-[#E30613] rounded-lg shadow-sm hover:bg-[#C80511] transition-colors">儲存</button>
      </div>
    </div>
  );
};

const FlightsTab = ({ flightInfo, setFlightInfo, onBack }) => (
  <div className="px-5 mt-4 space-y-4 pb-6">
    <div className="flex items-center gap-3 mb-2">
      <button onClick={onBack} className="w-8 h-8 rounded-full bg-white shadow-sm border border-[#EEEEEE] flex items-center justify-center text-[#666666] hover:text-[#E30613] hover:border-[#E30613]/30 transition-colors"><ChevronLeft size={18}/></button>
      <h2 className="text-xl font-serif text-[#111111]">航班時刻表</h2>
    </div>
    <div className="bg-white rounded-[24px] shadow-sm border border-[#EEEEEE] p-5 relative overflow-hidden flex flex-col h-[50vh]">
      <div className="flex justify-between items-center mb-3 border-b border-[#EEEEEE] pb-3">
        <span className="text-sm font-medium text-[#111111]">航班資訊與備註</span>
        <Plane size={18} className="text-[#E30613] opacity-50"/>
      </div>
      <textarea value={flightInfo} onChange={(e) => setFlightInfo(e.target.value)} placeholder="請在此貼上您的航班編號、起降時間、航廈資訊或電子機票細節..." className="w-full flex-1 bg-transparent resize-none focus:outline-none text-sm text-[#111111] placeholder-[#999999] leading-relaxed"></textarea>
    </div>
  </div>
);

const WalletTab = () => {
  const [chfInput, setChfInput] = useState('');
  const [rate, setRate] = useState(null);
  const [rateUpdatedAt, setRateUpdatedAt] = useState('');
  const [rateLoading, setRateLoading] = useState(true);
  const [rateError, setRateError] = useState(false);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        setRateLoading(true);
        setRateError(false);
        const res = await fetch('https://open.er-api.com/v6/latest/CHF');
        const data = await res.json();
        if (data?.rates?.TWD) {
          setRate(data.rates.TWD);
          const d = new Date(data.time_last_update_utc);
          const formatted = `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`;
          setRateUpdatedAt(formatted);
        } else {
          setRateError(true);
        }
      } catch {
        setRateError(true);
      } finally {
        setRateLoading(false);
      }
    };
    fetchRate();
  }, []);

  const chfValue = parseFloat(chfInput) || 0;
  const twdValue = rate ? (chfValue * rate).toFixed(0) : '—';

  return (
    <div className="px-5 mt-4">
      <div className="bg-white border border-[#EEEEEE] rounded-[24px] p-6 shadow-sm">
        <p className="font-serif italic text-[#999999] mb-4">匯率換算 Currency</p>
        <div className="flex items-center justify-between gap-3 bg-[#FAFAFA] border border-[#EEEEEE] p-2 rounded-xl">
          <div className="flex-1 flex flex-col justify-center px-3 py-2 bg-white rounded-lg shadow-sm border border-[#EEEEEE]">
            <span className="font-medium text-xs text-[#E30613] mb-1">CHF</span>
            <input type="number" inputMode="decimal" placeholder="0" value={chfInput} onChange={e => setChfInput(e.target.value)} className="text-lg text-[#111111] bg-transparent focus:outline-none w-full"/>
          </div>
          <ChevronRight size={16} className="text-[#999999] shrink-0" />
          <div className="flex-1 flex flex-col justify-center px-3 py-2 bg-white rounded-lg shadow-sm border border-[#EEEEEE]">
            <span className="font-medium text-xs text-[#666666] mb-1">TWD</span>
            <span className="text-lg text-[#111111]">
              {chfValue > 0 && rate ? `NT$ ${Number(twdValue).toLocaleString()}` : <span className="text-[#CCCCCC]">—</span>}
            </span>
          </div>
        </div>
        <div className="mt-3 text-center">
          {rateLoading ? (
            <p className="text-[10px] text-[#BBBBBB] tracking-wide flex items-center justify-center gap-1">
              <span className="inline-block w-3 h-3 border-2 border-[#E30613] border-t-transparent rounded-full animate-spin"></span>
              匯率更新中...
            </p>
          ) : rateError ? (
            <p className="text-[10px] text-red-400 tracking-wide">⚠️ 無法取得匯率，請檢查網路</p>
          ) : (
            <p className="text-[10px] text-[#999999] tracking-wide">
              1 CHF ≈ {rate?.toFixed(2)} TWD · 更新於 {rateUpdatedAt}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const PrepTab = ({ items, setItems, onBack }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [editingItemId, setEditingItemId] = useState(null);
  const [editItemText, setEditItemText] = useState('');
  const [dragOverId, setDragOverId] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const dragRef = useRef(null);

  const toggle = (id) => setItems(items.map(item => item.id === id ? { ...item, done: !item.done } : item));
  const handleDelete = (id, e) => { e.stopPropagation(); setItems(items.filter(item => item.id !== id)); };
  const handleAdd = () => { if (newItemText.trim()) { setItems([...items, { id: Date.now(), text: newItemText, done: false }]); setNewItemText(''); setIsAdding(false); } };
  const startEdit = (item, e) => { e.stopPropagation(); setEditingItemId(item.id); setEditItemText(item.text); };
  const saveEdit = (e) => { e.stopPropagation(); if(editItemText.trim()) setItems(items.map(i => i.id === editingItemId ? { ...i, text: editItemText } : i)); setEditingItemId(null); };
  const completedCount = items.filter(i => i.done).length;

  const reorder = (fromId, toId) => {
    if (!fromId || fromId === toId) return;
    const fromIdx = items.findIndex(i => String(i.id) === String(fromId));
    const toIdx = items.findIndex(i => String(i.id) === String(toId));
    if (fromIdx < 0 || toIdx < 0) return;
    const newItems = [...items];
    const [moved] = newItems.splice(fromIdx, 1);
    newItems.splice(toIdx, 0, moved);
    setItems(newItems);
  };

  const onDragStart = (e, id) => { dragRef.current = id; setDraggingId(id); e.dataTransfer.effectAllowed = 'move'; };
  const onDragOver = (e, id) => { e.preventDefault(); setDragOverId(id); };
  const onDrop = (e, id) => { e.preventDefault(); reorder(dragRef.current, id); dragRef.current = null; setDraggingId(null); setDragOverId(null); };
  const onDragEnd = () => { dragRef.current = null; setDraggingId(null); setDragOverId(null); };

  const onTouchStart = (e, id) => { dragRef.current = id; setDraggingId(id); };
  const onTouchMove = (e) => {
    if (!dragRef.current) return;
    e.preventDefault();
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const row = el?.closest('[data-drag-id]');
    if (row) setDragOverId(row.dataset.dragId);
  };
  const onTouchEnd = () => {
    if (dragRef.current && dragOverId) reorder(dragRef.current, dragOverId);
    dragRef.current = null;
    setDraggingId(null);
    setDragOverId(null);
  };

  return (
    <div className="px-5 mt-4 pb-4">
      <div className="flex items-center gap-3 mb-4">
        {onBack && <button onClick={onBack} className="w-8 h-8 rounded-full bg-white shadow-sm border border-[#EEEEEE] flex items-center justify-center text-[#666666] hover:text-[#E30613] hover:border-[#E30613]/30 transition-colors"><ChevronLeft size={18}/></button>}
        <h2 className="text-xl font-serif text-[#111111] flex-1">行前準備 <span className="float-right text-xs text-[#999999] font-sans italic pt-2">Checklist</span></h2>
      </div>
      <div className="bg-white rounded-[24px] p-5 shadow-sm border border-[#EEEEEE]">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-[#111111]">行李清單與提醒</span>
          <span className="text-xs text-[#E30613] bg-[#FEF2F2] px-2 py-1 rounded-md font-medium">完成 {completedCount}/{items.length}</span>
        </div>
        <div className="space-y-1">
          {items.map(item => (
            <div
              key={item.id}
              data-drag-id={String(item.id)}
              draggable
              onDragStart={(e) => onDragStart(e, item.id)}
              onDragOver={(e) => onDragOver(e, item.id)}
              onDrop={(e) => onDrop(e, item.id)}
              onDragEnd={onDragEnd}
              className={`flex items-center justify-between py-3 border-b border-[#EEEEEE] last:border-0 -mx-2 px-2 rounded-lg transition-all ${
                String(draggingId) === String(item.id) ? 'opacity-40' :
                String(dragOverId) === String(item.id) ? 'bg-[#FEF2F2] border-t-2 border-t-[#E30613]' :
                'hover:bg-[#FAFAFA]'
              }`}
            >
              {editingItemId === item.id ? (
                <div className="flex items-center gap-2 flex-1 w-full">
                  <input type="text" value={editItemText} onChange={(e) => setEditItemText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && saveEdit(e)} className="flex-1 border border-[#EEEEEE] rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#E30613] focus:ring-1 focus:ring-[#E30613]" autoFocus/>
                  <button onClick={saveEdit} className="text-[#E30613] p-1.5 hover:bg-[#FEF2F2] rounded-full transition-colors"><Save size={16}/></button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => toggle(item.id)}>
                    <div className={`w-5 h-5 shrink-0 rounded-[6px] border flex items-center justify-center transition-colors ${item.done ? 'bg-[#E30613] border-[#E30613]' : 'bg-white border-[#DDDDDD]'}`}>{item.done && <Check size={14} className="text-white" strokeWidth={3} />}</div>
                    <span className={`text-[15px] transition-colors ${item.done ? 'line-through text-[#999999]' : 'text-[#111111]'}`}>{item.text}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      onTouchStart={(e) => { e.stopPropagation(); onTouchStart(e, item.id); }}
                      onTouchMove={onTouchMove}
                      onTouchEnd={onTouchEnd}
                      className="p-1.5 text-[#DDDDDD] hover:text-[#999999] cursor-grab active:cursor-grabbing touch-none select-none"
                    >
                      <GripVertical size={16}/>
                    </div>
                    <button onClick={(e) => startEdit(item, e)} className="p-1.5 text-[#CCCCCC] hover:text-[#E30613] hover:bg-[#FEF2F2] rounded-full transition-colors"><Edit2 size={16} /></button>
                    <button onClick={(e) => handleDelete(item.id, e)} className="p-1.5 text-[#CCCCCC] hover:text-[#E30613] hover:bg-[#FEF2F2] rounded-full transition-colors"><Trash2 size={16} /></button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        {isAdding ? (
          <div className="mt-4 pt-3 border-t border-[#EEEEEE] flex items-center gap-2">
            <input type="text" autoFocus placeholder="輸入準備項目..." value={newItemText} onChange={(e) => setNewItemText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAdd()} className="flex-1 border border-[#EEEEEE] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E30613] focus:ring-1 focus:ring-[#E30613]"/>
            <button onClick={() => {setIsAdding(false); setNewItemText('');}} className="px-3 py-2 text-[#999999] hover:text-[#111111] text-sm transition-colors">取消</button>
            <button onClick={handleAdd} className="px-3 py-2 bg-[#E30613] text-white rounded-lg text-sm shadow-sm hover:bg-[#C80511] transition-colors">儲存</button>
          </div>
        ) : (
          <button onClick={() => setIsAdding(true)} className="w-full mt-4 py-3 border border-dashed border-[#DDDDDD] rounded-xl text-sm text-[#999999] flex items-center justify-center gap-1 hover:text-[#E30613] hover:border-[#E30613]/50 transition-colors"><Plus size={16}/> 新增項目</button>
        )}
      </div>
    </div>
  );
};

const TicketsTab = ({ tickets, setTickets }) => {
  const [editingId, setEditingId] = useState(null);
  const handleDelete = (id) => setTickets(tickets.filter(t => t.id !== id));

  return (
    <div className="px-5 mt-4 pb-4">
      <h2 className="text-xl font-serif mb-4 text-[#111111]">票券資訊 <span className="float-right text-xs text-[#999999] font-sans italic pt-2">Tickets</span></h2>
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div key={ticket.id}>
            {editingId === ticket.id ? (
              <TicketEditForm ticket={ticket} onSave={(updated) => { setTickets(tickets.map(t => t.id === ticket.id ? updated : t)); setEditingId(null); }} onCancel={() => setEditingId(null)} />
            ) : (
              <div className="bg-white rounded-[24px] shadow-sm border border-[#EEEEEE] p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#FEF2F2] rounded-bl-[100%] z-0"></div>
                <Ticket size={40} className="absolute top-2 right-2 text-[#E30613] z-0 opacity-20"/>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] bg-[#FEF2F2] text-[#E30613] px-2 py-0.5 rounded font-medium tracking-wide">{ticket.category}</span>
                    <div className="flex gap-1 absolute top-0 right-0">
                      <button onClick={() => setEditingId(ticket.id)} className="w-6 h-6 flex items-center justify-center bg-white/80 rounded-full text-[#CCCCCC] hover:text-[#E30613] transition-colors"><Edit2 size={12}/></button>
                      <button onClick={() => handleDelete(ticket.id)} className="w-6 h-6 flex items-center justify-center bg-white/80 rounded-full text-[#CCCCCC] hover:text-[#E30613] transition-colors"><Trash2 size={12}/></button>
                    </div>
                  </div>
                  <h3 className="font-medium text-[#111111] text-[17px] leading-tight pr-10">{ticket.title}</h3>
                  {ticket.timeInfo && <p className="text-sm text-[#666666] mt-2 flex items-center gap-1"><Clock size={14} className="text-[#E30613]"/> {ticket.timeInfo}</p>}
                  {ticket.bookingRef && (
                    <div className="mt-3 pt-3 border-t border-dashed border-[#EEEEEE]">
                      <p className="text-[10px] text-[#999999] mb-1">訂位代號</p>
                      <p className="text-base font-serif tracking-widest text-[#E30613] font-bold">{ticket.bookingRef}</p>
                    </div>
                  )}
                  {ticket.note && (
                    <div className="mt-3 pt-3 border-t border-dashed border-[#EEEEEE]">
                      <p className="text-[10px] text-[#999999] mb-1">備註</p>
                      <p className="text-xs text-[#666666] whitespace-pre-wrap">{ticket.note}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        {editingId === 'new' ? (
          <TicketEditForm onSave={(newTicket) => { setTickets([...tickets, { ...newTicket, id: `t${Date.now()}` }]); setEditingId(null); }} onCancel={() => setEditingId(null)} />
        ) : (
          <button onClick={() => setEditingId('new')} className="w-full py-3 border border-dashed border-[#DDDDDD] rounded-2xl text-sm text-[#999999] flex items-center justify-center gap-1 hover:bg-white hover:text-[#E30613] hover:border-[#E30613]/50 transition-colors"><Plus size={18}/> 新增票券</button>
        )}
      </div>
    </div>
  );
};

const TicketEditForm = ({ ticket, onSave, onCancel }) => {
  const [formData, setFormData] = useState(ticket || { category: '', title: '', ticketDate: '', ticketTime: '', timeInfo: '', bookingRef: '', note: '' });

  const handleTimeInput = (val) => {
    val = val.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length >= 3) val = val.slice(0, 2) + ':' + val.slice(2);
    return val;
  };

  const formatTimeInfo = (date, time) => {
    if (!date && !time) return '';
    const d = date ? new Date(date) : null;
    const dateStr = d ? `${d.getMonth()+1}/${d.getDate()}` : '';
    return time ? `${dateStr} ${time}` : dateStr;
  };

  return (
    <div className="bg-[#FAFAFA] p-4 rounded-[24px] shadow-inner border border-[#EEEEEE] space-y-3">
      <input type="text" placeholder="票券名稱 *" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white border border-[#EEEEEE] rounded-lg p-2 text-sm focus:outline-none focus:border-[#E30613]"/>
      <div className="flex gap-3">
        <input type="date" value={formData.ticketDate || ''} onChange={e => {
          const newDate = e.target.value;
          setFormData({...formData, ticketDate: newDate, timeInfo: formatTimeInfo(newDate, formData.ticketTime)});
        }} className="flex-1 bg-white border border-[#EEEEEE] rounded-lg p-2 text-sm focus:outline-none focus:border-[#E30613]"/>
        <input type="text" placeholder="時間 (如: 1130)" value={formData.ticketTime || ''} onChange={e => {
          const newTime = handleTimeInput(e.target.value);
          setFormData({...formData, ticketTime: newTime, timeInfo: formatTimeInfo(formData.ticketDate, newTime)});
        }} className="w-32 bg-white border border-[#EEEEEE] rounded-lg p-2 text-sm focus:outline-none focus:border-[#E30613]"/>
      </div>
      {formData.timeInfo && (
        <div className="bg-[#FEF2F2] rounded-lg px-3 py-2 text-sm text-[#E30613] font-medium text-center">
          {formData.timeInfo}
        </div>
      )}
      <input type="text" placeholder="訂位代號 (選填)" value={formData.bookingRef || ''} onChange={e => setFormData({...formData, bookingRef: e.target.value})} className="w-full bg-white border border-[#EEEEEE] rounded-lg p-2 text-sm focus:outline-none focus:border-[#E30613]"/>
      <textarea placeholder="備註 (選填)" value={formData.note || ''} onChange={e => setFormData({...formData, note: e.target.value})} rows="3" className="w-full bg-white border border-[#EEEEEE] rounded-lg p-2 text-sm focus:outline-none focus:border-[#E30613] resize-none"/>
      <div className="flex justify-end gap-2 pt-1">
        <button onClick={onCancel} className="px-4 py-1.5 text-xs text-[#666666] bg-white rounded-lg border border-[#EEEEEE] hover:bg-[#FAFAFA] transition-colors">取消</button>
        <button onClick={() => { if(!formData.title.trim()) return; onSave(formData); }} className="px-4 py-1.5 text-xs text-white bg-[#E30613] rounded-lg shadow-sm hover:bg-[#C80511] transition-colors">儲存</button>
      </div>
    </div>
  );
};

const BottomNavigation = ({ activeTab, setActiveTab }) => (
  <div className="fixed bottom-0 max-w-[430px] w-full bg-white/95 backdrop-blur-lg border-t border-[#EEEEEE] px-4 py-2 pb-6 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
    <div className="flex justify-between items-end relative w-full">
      <NavItem icon={<CalendarIcon size={24}/>} label="行程" isActive={activeTab === 'itinerary'} onClick={() => setActiveTab('itinerary')} />
      <NavItem icon={<Bed size={24}/>} label="住宿" isActive={activeTab === 'accommodation'} onClick={() => setActiveTab('accommodation')} />
      <div className="w-16 shrink-0"></div>
      <div className="absolute left-1/2 -translate-x-1/2 -top-1 flex flex-col items-center justify-center w-14">
        <div className="absolute w-16 h-16 bg-white rounded-full shadow-[0_-4px_10px_rgba(0,0,0,0.03)] border border-[#EEEEEE] z-0"></div>
        <button onClick={() => setActiveTab('home')} className={`w-12 h-12 rounded-full flex items-center justify-center z-10 transition-transform ${activeTab === 'home' ? 'bg-[#E30613] text-white shadow-[0_4px_12px_rgba(227,6,19,0.3)] scale-110' : 'bg-[#FAFAFA] border border-[#EEEEEE] text-[#666666]'}`}><Home size={24} /></button>
        <span className={`text-[10px] mt-2 font-medium z-10 ${activeTab === 'home' ? 'text-[#E30613]' : 'text-[#666666]'}`}>首頁</span>
      </div>
      <NavItem icon={<Wallet size={24}/>} label="匯率" isActive={activeTab === 'wallet'} onClick={() => setActiveTab('wallet')} />
      <NavItem icon={<Ticket size={24}/>} label="票券" isActive={activeTab === 'tickets'} onClick={() => setActiveTab('tickets')} />
    </div>
  </div>
);

const NavItem = ({ icon, label, isActive, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center w-[18%] gap-1 transition-colors ${isActive ? 'text-[#E30613]' : 'text-[#999999] hover:text-[#666666]'}`}>
    {icon}
    <span className="text-[10px] font-medium whitespace-nowrap">{label}</span>
    {isActive && <div className="w-1 h-1 bg-[#E30613] rounded-full absolute -bottom-2"></div>}
  </button>
);

const MapTab = () => (
  <div className="px-5 mt-4 flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
    <h2 className="text-xl font-serif mb-4 text-[#111111]">地圖導航 <span className="float-right text-xs text-[#999999] font-sans italic pt-2">Map</span></h2>
    <div className="flex-1 bg-[#FAFAFA] rounded-3xl overflow-hidden relative border border-[#EEEEEE] shadow-inner flex items-center justify-center mb-6">
      <MapIcon size={64} className="text-[#EEEEEE] absolute" />
      <div className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-sm text-sm text-[#111111] flex justify-between items-center border border-[#EEEEEE]">
        <span>📍 目前顯示：瑞士</span>
        <span className="text-[10px] bg-[#FEF2F2] text-[#E30613] px-2 py-1 rounded-md">預覽模式</span>
      </div>
    </div>
  </div>
);

export default App;