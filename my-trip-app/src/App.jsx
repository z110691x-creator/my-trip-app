import React, { useState, useRef } from 'react';
import { 
  Settings, ChevronLeft, ChevronRight,
  Home, Calendar as CalendarIcon, Map as MapIcon, Wallet, Navigation,
  Edit2, Trash2, Plus, Save, X, MapPin, Ticket, Clock, 
  ClipboardList, Check, QrCode, Bed, Plane
} from 'lucide-react';

const App = () => {
  // --- 狀態管理 ---
  const [activeTab, setActiveTab] = useState('home'); 
  const [tripTitle, setTripTitle] = useState('Switzerland 遊記');
  const [tripSubtitle, setTripSubtitle] = useState('Viaggio · 瑞士之旅');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const [tempSubtitle, setTempSubtitle] = useState('');
  const [flightInfo, setFlightInfo] = useState('');

  // 假資料：瑞士行程
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

  // 行前準備資料 (提升到最上層，切換頁面才不會消失)
  const [prepItems, setPrepItems] = useState([
    { id: 1, text: '護照 (效期需六個月以上)', done: true },
    { id: 2, text: '列印電子機票與住宿憑證', done: true },
    { id: 3, text: '開通網卡或 eSIM', done: false },
    { id: 4, text: '萬用轉接頭與行動電源', done: false },
    { id: 5, text: '兌換歐元與瑞士法郎現金', done: false },
    { id: 6, text: '個人常備藥品與高山症藥', done: false },
  ]);

  // 票券資料
  const [tickets, setTickets] = useState([
    { id: 't1', type: 'Pass', category: '交通', timeInfo: '連續 8 天', title: 'Swiss Travel Pass', note: '已開通，存於 Apple Wallet' },
    { id: 't2', type: 'Ticket', category: '景點', timeInfo: '06/11 11:30', title: '少女峰登山齒軌列車', note: '預訂代號: GRD-982X' }
  ]);

  // 住宿資料
  const [accommodations, setAccommodations] = useState([
    { id: 'a1', dateStr: '6/10 - 6/11 (1晚)', location: 'Zurich', name: 'Hotel Schweizerhof Zürich', address: 'Bahnhofplatz 7, 8001 Zürich', timeInfo: 'Check-in: 15:00 / Out: 12:00', bookingRef: 'AGD-882910', voucherNote: '已全額付款，含雙人早餐。' },
    { id: 'a2', dateStr: '6/11 - 6/13 (2晚)', location: 'Grindelwald', name: 'Belvedere Swiss Quality Hotel', address: 'Dorfstrasse 53, 3818 Grindelwald', timeInfo: 'Check-in: 14:00 / Out: 11:00', bookingRef: 'BKG-44592', voucherNote: '需現場支付城市稅。' }
  ]);

  const [activeDayId, setActiveDayId] = useState(days[1]?.id || days[0]?.id);
  
  // 編輯天數視窗
  const [isEditingDay, setIsEditingDay] = useState(false);
  const [editDayDate, setEditDayDate] = useState('');

  // 電腦版橫向拖曳滑動
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragged, setDragged] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111] font-sans pb-28">
      {/* 頂部標題列 */}
      <header className="px-5 pt-10 pb-4 sticky top-0 z-30 bg-[#FAFAFA]/90 backdrop-blur-md flex items-start justify-between">
        <div className="flex-1">
          {isEditingTitle ? (
            <div className="space-y-2 bg-white p-3 rounded-xl border border-[#EEEEEE] shadow-sm">
              <input 
                className="w-full bg-transparent border-b border-[#EEEEEE] focus:outline-none focus:border-[#E30613] text-sm text-[#666666]"
                value={tempSubtitle} onChange={(e) => setTempSubtitle(e.target.value)} placeholder="副標題 (如: Viaggio)"
              />
              <input 
                className="w-full bg-transparent border-b border-[#EEEEEE] focus:outline-none focus:border-[#E30613] font-serif text-2xl"
                value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} placeholder="主標題"
              />
              <div className="flex justify-end pt-2">
                <button onClick={saveTitle} className="bg-[#E30613] text-white px-4 py-1.5 text-sm rounded-lg shadow-sm hover:bg-[#C80511] transition-colors">完成</button>
              </div>
            </div>
          ) : (
            <div onClick={() => { setTempTitle(tripTitle); setTempSubtitle(tripSubtitle); setIsEditingTitle(true); }}>
              <p className="text-xs tracking-wider text-[#666666] mb-1">{tripSubtitle}</p>
              <h1 className="text-3xl font-serif tracking-wide text-[#111111]">{tripTitle}</h1>
            </div>
          )}
        </div>
        {!isEditingTitle && (
          <div className="flex gap-3">
            <button className="w-10 h-10 rounded-full bg-white border border-[#EEEEEE] shadow-sm flex items-center justify-center text-[#666666] hover:text-[#E30613] hover:border-[#E30613] transition-colors"><Settings size={18} /></button>
          </div>
        )}
      </header>

      {/* 主內容區 */}
      <main className="max-w-md mx-auto">
        {activeTab === 'itinerary' && (
          <div className="px-5 space-y-6">
            {/* 橫向日期選擇器 */}
            <div className="relative">
              <div 
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x cursor-grab active:cursor-grabbing" 
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {days.map((day, idx) => {
                  const { day: d, month, week } = formatShortDate(day.date);
                  const isActive = activeDayId === day.id;
                  return (
                    <button 
                      key={day.id}
                      onClick={() => {
                        if (dragged) return;
                        setActiveDayId(day.id);
                      }}
                      className={`relative shrink-0 snap-start w-[76px] h-[90px] rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${isActive ? 'bg-[#E30613] text-white scale-105 shadow-[0_4px_12px_rgba(227,6,19,0.3)]' : 'bg-white border border-[#EEEEEE] text-[#111111] shadow-sm hover:border-[#E30613]/50'}`}
                    >
                      {isActive && (
                        <div 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            if (dragged) return;
                            openEditDay(); 
                          }}
                          className="absolute top-1.5 right-1.5 w-5 h-5 flex items-center justify-center bg-white/25 rounded-full hover:bg-white/40 transition-colors"
                          title="編輯或刪除此天"
                        >
                          <Edit2 size={10} className="text-white" />
                        </div>
                      )}
                      <span className={`text-[10px] font-bold tracking-widest mb-1 ${isActive ? 'text-white' : 'text-[#666666]'}`}>DAY {idx+1}</span>
                      <span className="text-[22px] font-serif leading-none mb-1">{d}</span>
                      <span className={`text-[9px] whitespace-nowrap ${isActive ? 'text-white opacity-90' : 'text-[#999999]'}`}>{month} {week}</span>
                    </button>
                  );
                })}
                <button 
                  onClick={() => {
                    if (dragged) return;
                    handleAddDay();
                  }} 
                  className="shrink-0 snap-start w-[76px] h-[90px] rounded-2xl flex items-center justify-center bg-transparent border-2 border-dashed border-[#DDDDDD] text-[#999999] hover:text-[#E30613] hover:border-[#E30613]/50 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* 準備清單與航班入口區塊 (順序對調：準備清單在上面) */}
            <div className="space-y-3">
              <button onClick={() => setActiveTab('prep')} className="w-full bg-white border border-[#EEEEEE] border-dashed rounded-2xl p-4 flex justify-between items-center text-[#666666] text-sm shadow-sm hover:border-[#E30613]/40 hover:text-[#E30613] transition-colors">
                <span className="flex items-center gap-2"><ClipboardList size={16} className="text-[#E30613]"/> 行前準備清單</span>
                <ChevronRight size={16} className="opacity-50"/>
              </button>
              <button onClick={() => setActiveTab('flights')} className="w-full bg-white border border-[#EEEEEE] border-dashed rounded-2xl p-4 flex justify-between items-center text-[#666666] text-sm shadow-sm hover:border-[#E30613]/40 hover:text-[#E30613] transition-colors">
                <span className="flex items-center gap-2"><Plane size={16} className="text-[#E30613]"/> 航班時刻表</span>
                <ChevronRight size={16} className="opacity-50"/>
              </button>
            </div>

            {/* 今日行程卡片 */}
            {activeDay ? (
              <DayItineraryCard day={activeDay} days={days} setDays={setDays} />
            ) : (
              <div className="text-center py-10 bg-white rounded-[28px] border border-[#EEEEEE] shadow-sm">
                <p className="text-[#999999] text-sm">目前無任何天數，請點擊上方 + 號新增</p>
              </div>
            )}

            {/* 編輯/刪除天數的專屬彈出視窗 */}
            {isEditingDay && activeDay && (
              <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-5 backdrop-blur-sm">
                <div className="bg-white rounded-[24px] p-6 w-full max-w-sm shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="text-lg font-medium text-[#111111]">編輯天數 (Day {activeDayIndex + 1})</h3>
                    <button onClick={() => setIsEditingDay(false)} className="text-[#999999] hover:text-[#111111]"><X size={20}/></button>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-xs text-[#666666] mb-2">修改日期</label>
                    <input 
                      type="date" 
                      value={editDayDate} 
                      onChange={(e) => setEditDayDate(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-[#EEEEEE] rounded-xl p-3 text-sm focus:outline-none focus:border-[#E30613] focus:ring-1 focus:ring-[#E30613] text-[#111111]"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <button 
                      onClick={() => {
                        const newDays = days.filter(d => d.id !== activeDay.id);
                        setDays(newDays);
                        setIsEditingDay(false);
                        setActiveDayId(newDays[0]?.id || null);
                      }} 
                      className="px-4 py-2.5 text-xs text-[#E30613] bg-[#FEF2F2] rounded-xl hover:bg-[#FCA5A5] transition-colors flex items-center gap-1"
                    >
                      <Trash2 size={14}/> 刪除此天
                    </button>
                    <button 
                      onClick={() => {
                        setDays(days.map(d => d.id === activeDay.id ? { ...d, date: editDayDate } : d));
                        setIsEditingDay(false);
                      }} 
                      className="px-6 py-2.5 text-xs text-white bg-[#E30613] rounded-xl shadow-[0_2px_8px_rgba(227,6,19,0.3)] hover:bg-[#C80511] transition-colors"
                    >
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

// --- 今日行程卡片組件 ---
const DayItineraryCard = ({ day, days, setDays }) => {
  const [editingEventId, setEditingEventId] = useState(null);

  const deleteEvent = (eventId) => {
    const updatedDays = days.map(d => 
      d.id === day.id ? { ...d, events: d.events.filter(e => e.id !== eventId) } : d
    );
    setDays(updatedDays);
  };

  const sortedEvents = [...day.events].sort((a, b) => {
    if (!a.time) return -1;
    if (!b.time) return 1;
    return a.time.localeCompare(b.time);
  });

  return (
    <div className="bg-white rounded-[28px] shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-[#EEEEEE] p-6 pt-5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="flex items-center gap-2 text-lg font-medium tracking-wide text-[#111111]">
          <CalendarIcon size={18} className="text-[#E30613]" /> 今日行程
        </h2>
      </div>

      <div className="space-y-0">
        {sortedEvents.map((event, idx) => (
          <div key={event.id} className={`flex gap-4 ${idx !== sortedEvents.length - 1 ? 'border-b border-dashed border-[#EEEEEE] pb-6 mb-6' : 'pb-2'}`}>
            <div className="w-12 shrink-0 pt-0.5">
              <span className="font-serif text-[#111111] text-lg font-medium">{event.time ? event.time : '—'}</span>
            </div>
            
            <div className="flex-1">
              {editingEventId === event.id ? (
                <EventEditForm 
                  event={event} dayId={day.id} days={days} setDays={setDays} onClose={() => setEditingEventId(null)} 
                />
              ) : (
                <>
                  <h3 className="text-[17px] text-[#111111] font-medium leading-snug">{event.title}</h3>
                  {event.location && (
                    <p className="text-sm text-[#666666] mt-1.5 flex items-center gap-1">{event.location}</p>
                  )}

                  {(event.businessHours?.trim() || event.ticket?.trim()) && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {event.businessHours?.trim() && (
                        <span className="bg-[#FAFAFA] border border-[#EEEEEE] text-[#666666] text-[11px] px-2 py-1 rounded-md flex items-center gap-1">
                          <Clock size={11} className="text-[#E30613]"/> {event.businessHours}
                        </span>
                      )}
                      {event.ticket?.trim() && (
                        <span className="bg-[#FAFAFA] border border-[#EEEEEE] text-[#666666] text-[11px] px-2 py-1 rounded-md flex items-center gap-1">
                          <Ticket size={11} className="text-[#E30613]"/> 
                          {(/\d/.test(event.ticket) && !/CHF/i.test(event.ticket)) 
                            ? `CHF ${event.ticket}` 
                            : event.ticket}
                        </span>
                      )}
                    </div>
                  )}

                  {event.note && (
                    <p className="text-xs text-[#666666] mt-2 bg-[#FAFAFA] p-2.5 rounded-lg inline-block border border-[#EEEEEE] whitespace-pre-wrap">
                      {event.note}
                    </p>
                  )}
                  
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => alert('即將開啟外部地圖導航...')} className="flex-1 py-1.5 bg-[#FAFAFA] border border-[#EEEEEE] rounded-lg text-xs text-[#666666] flex items-center justify-center gap-1 shadow-sm hover:text-[#E30613] hover:border-[#E30613]/30 transition-colors">
                      <Navigation size={12}/> 導航
                    </button>
                    <button onClick={() => alert('✅ 已加入地圖備忘錄！')} className="flex-1 py-1.5 bg-[#FAFAFA] border border-[#EEEEEE] rounded-lg text-xs text-[#666666] flex items-center justify-center gap-1 shadow-sm hover:text-[#E30613] hover:border-[#E30613]/30 transition-colors">
                      <MapPin size={12}/> 加入地圖
                    </button>
                    <button onClick={() => setEditingEventId(event.id)} className="flex-1 py-1.5 bg-[#FAFAFA] border border-[#EEEEEE] rounded-lg text-xs text-[#666666] flex items-center justify-center gap-1 shadow-sm hover:text-[#E30613] hover:border-[#E30613]/30 transition-colors">
                      <Edit2 size={12}/> 編輯
                    </button>
                    <button onClick={() => deleteEvent(event.id)} className="w-8 py-1.5 bg-[#FAFAFA] border border-[#EEEEEE] rounded-lg text-xs text-[#999999] flex items-center justify-center shadow-sm hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors">
                      <Trash2 size={12}/>
                    </button>
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
             <button 
                onClick={() => setEditingEventId('new')}
                className="absolute right-0 -top-8 w-14 h-14 bg-[#E30613] text-white rounded-full shadow-[0_4px_12px_rgba(227,6,19,0.3)] flex items-center justify-center hover:scale-105 hover:bg-[#C80511] transition-all z-20"
             >
               <Plus size={24} />
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- 行程編輯表單 ---
const EventEditForm = ({ event, dayId, days, setDays, onClose }) => {
  const isNew = !event;
  const [formData, setFormData] = useState(
    event || { time: '', title: '', location: '', note: '', businessHours: '', ticket: '' }
  );

  const handleSave = () => {
    if (!formData.title.trim()) return; 
    
    const updatedDays = days.map(d => {
      if (d.id === dayId) {
        let newEvents = isNew 
          ? [...d.events, { ...formData, id: `e${Date.now()}` }]
          : d.events.map(e => e.id === event.id ? formData : e);
        return { ...d, events: newEvents };
      }
      return d;
    });
    setDays(updatedDays);
    onClose();
  };

  const clearTime = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFormData({...formData, time: ''});
  };

  const handleBusinessHoursChange = (e) => {
    let val = e.target.value;
    const isDeleting = formData.businessHours && val.length < formData.businessHours.length;

    if (!isDeleting) {
      if (/^\d{4}$/.test(val)) {
        val = `${val.slice(0, 2)}:${val.slice(2, 4)} - `;
      } else if (/^\d{2}:\d{2}$/.test(val)) {
        val = `${val} - `;
      }
    }
    setFormData({...formData, businessHours: val});
  };

  return (
    <div className="bg-[#FAFAFA] p-4 rounded-xl space-y-3 shadow-inner border border-[#EEEEEE]">
      <div className="flex gap-3">
        <div className="w-1/3 relative">
          <input 
            type="time" 
            value={formData.time || ''} 
            onChange={e => setFormData({...formData, time: e.target.value})}
            className="w-full bg-white border border-[#EEEEEE] rounded-lg p-2 text-sm focus:outline-none focus:border-[#E30613] focus:ring-1 focus:ring-[#E30613]"
          />
          {!formData.time ? (
            <div className="absolute top-1/2 -translate-y-1/2 left-3 text-[#999999] text-[13px] pointer-events-none bg-white px-1">—</div>
          ) : (
            <button 
              type="button"
              onClick={clearTime}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-[#999999] hover:text-[#E30613] bg-[#FAFAFA] rounded-full z-10"
            >
              <X size={12} />
            </button>
          )}
        </div>
        <input 
          type="text" placeholder="行程標題 *" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
          className="w-2/3 bg-white border border-[#EEEEEE] rounded-lg p-2 text-sm focus:outline-none focus:border-[#E30613] focus:ring-1 focus:ring-[#E30613]"
        />
      </div>
      <input 
        type="text" placeholder="地點/副標題" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
        className="w-full bg-white border border-[#EEEEEE] rounded-lg p-2 text-sm focus:outline-none focus:border-[#E30613] focus:ring-1 focus:ring-[#E30613]"
      />
      
      <div className="flex gap-3">
        <div className="w-1/2 flex items-center bg-white border border-[#EEEEEE] rounded-lg px-2 focus-within:border-[#E30613] focus-within:ring-1 focus-within:ring-[#E30613]">
          <Clock size={14} className="text-[#999999] shrink-0" />
          <input 
            type="text" 
            placeholder="營業時間" 
            value={formData.businessHours || ''} 
            onChange={handleBusinessHoursChange}
            className="w-full bg-transparent p-2 text-sm focus:outline-none text-[#111111]"
          />
        </div>
        <div className="w-1/2 flex items-center bg-white border border-[#EEEEEE] rounded-lg px-2 focus-within:border-[#E30613] focus-within:ring-1 focus-within:ring-[#E30613]">
          <Ticket size={14} className="text-[#999999] shrink-0" />
          <input 
            type="text" 
            placeholder="門票資訊" 
            value={formData.ticket || ''} 
            onChange={e => setFormData({...formData, ticket: e.target.value})}
            className="w-full bg-transparent p-2 text-sm focus:outline-none text-[#111111]"
          />
        </div>
      </div>

      <textarea 
        placeholder="備註資訊..." value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} rows="2"
        className="w-full bg-white border border-[#EEEEEE] rounded-lg p-2 text-sm focus:outline-none focus:border-[#E30613] focus:ring-1 focus:ring-[#E30613] resize-none"
      />
      <div className="flex justify-end gap-2 pt-1">
        <button onClick={onClose} className="px-4 py-1.5 text-xs text-[#666666] bg-white rounded-lg border border-[#EEEEEE] hover:bg-[#FAFAFA] transition-colors">取消</button>
        <button onClick={handleSave} className="px-4 py-1.5 text-xs text-white bg-[#E30613] rounded-lg shadow-[0_2px_8px_rgba(227,6,19,0.3)] hover:bg-[#C80511] transition-colors">儲存</button>
      </div>
    </div>
  );
};

// --- 功能總覽 (Home 頁籤) ---
const HomeMenuTab = ({ setActiveTab }) => (
  <div className="px-5 mt-2 pb-6">
    <div className="grid grid-cols-2 gap-4">
      <MenuCard onClick={() => setActiveTab('itinerary')} icon={<CalendarIcon size={24} className="text-[#E30613]"/>} title="每日行程" subtitle="編輯時間地點與備註" titleEng="Plans" />
      <MenuCard onClick={() => setActiveTab('accommodation')} icon={<Bed size={24} className="text-[#E30613]"/>} title="住宿資訊" subtitle="飯店地址與訂房紀錄" titleEng="Hotels" />
      <MenuCard onClick={() => setActiveTab('wallet')} icon={<Wallet size={24} className="text-[#E30613]"/>} title="匯率換算" subtitle="自動換算為台幣" titleEng="Currency" />
      <MenuCard onClick={() => setActiveTab('tickets')} icon={<Ticket size={24} className="text-[#E30613]"/>} title="票券資訊" subtitle="交通票與景點門票" titleEng="Tickets" />
    </div>
  </div>
);

const MenuCard = ({ icon, title, subtitle, titleEng, onClick }) => (
  <div onClick={onClick} className="bg-white p-5 rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#EEEEEE] aspect-square flex flex-col justify-end relative overflow-hidden group hover:shadow-[0_4px_16px_rgba(227,6,19,0.08)] hover:border-[#E30613]/30 transition-all cursor-pointer">
    <div className="absolute top-5 left-5 bg-[#FEF2F2] w-[46px] h-[46px] rounded-[16px] flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <p className="font-serif italic text-[#999999] text-[13px] mb-0.5">{titleEng}</p>
      <h3 className="text-[17px] font-medium tracking-wide text-[#111111] mb-1 group-hover:text-[#E30613] transition-colors">{title}</h3>
      <p className="text-[10px] text-[#666666] leading-tight">{subtitle}</p>
    </div>
  </div>
);

// --- 住宿資訊頁籤 ---
const AccommodationTab = ({ accommodations, setAccommodations }) => {
  const [editingId, setEditingId] = useState(null);
  const [viewingVoucher, setViewingVoucher] = useState(null);

  const handleDelete = (id) => {
    setAccommodations(accommodations.filter(a => a.id !== id));
  };

  return (
    <div className="px-5 mt-4 space-y-4 pb-4">
      <h2 className="text-xl font-serif mb-4 text-[#111111]">住宿資訊 <span className="float-right text-xs text-[#999999] font-sans italic pt-2">Hotels</span></h2>
      
      {accommodations.map((acc) => (
        <div key={acc.id}>
          {editingId === acc.id ? (
            <AccommodationEditForm 
              accommodation={acc}
              onSave={(updatedAcc) => {
                setAccommodations(accommodations.map(a => a.id === acc.id ? updatedAcc : a));
                setEditingId(null);
              }}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div className="bg-white rounded-[24px] shadow-sm border border-[#EEEEEE] p-5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#FEF2F2] rounded-bl-[100%] z-0"></div>
              <Bed size={40} className="absolute top-2 right-2 text-[#E30613] z-0 opacity-20"/>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] bg-[#FEF2F2] text-[#E30613] px-2 py-0.5 rounded font-medium tracking-wide">{acc.dateStr}</span>
                  <span className="text-xs font-serif text-[#999999] bg-[#FAFAFA] border border-[#EEEEEE] px-2 py-0.5 rounded pr-8">{acc.location}</span>
                </div>
                <h3 className="font-medium text-[#111111] text-[17px] leading-tight pr-10">{acc.name}</h3>
                <div className="text-xs text-[#666666] mt-3 space-y-1.5">
                  {acc.address && <p className="flex items-start gap-1"><MapPin size={12} className="shrink-0 mt-0.5 text-[#E30613]"/> {acc.address}</p>}
                  {acc.timeInfo && <p className="flex items-center gap-1"><Clock size={12} className="shrink-0 text-[#E30613]"/> {acc.timeInfo}</p>}
                </div>
                
                <div className="absolute top-0 right-0 flex flex-col gap-2 mt-1 mr-1">
                  <button onClick={() => setEditingId(acc.id)} className="w-6 h-6 flex items-center justify-center bg-white/80 rounded-full text-[#CCCCCC] hover:text-[#E30613] transition-colors"><Edit2 size={12}/></button>
                  <button onClick={() => handleDelete(acc.id)} className="w-6 h-6 flex items-center justify-center bg-white/80 rounded-full text-[#CCCCCC] hover:text-[#E30613] transition-colors"><Trash2 size={12}/></button>
                </div>

                <div className="mt-4 pt-3 border-t border-dashed border-[#EEEEEE] flex gap-2">
                   <button className="flex-1 py-1.5 bg-[#FAFAFA] border border-[#EEEEEE] rounded-lg text-xs text-[#666666] flex items-center justify-center gap-1 hover:text-[#E30613] transition-colors"><Navigation size={12}/> 地圖</button>
                   <button onClick={() => setViewingVoucher(acc)} className="flex-1 py-1.5 bg-[#E30613] text-white rounded-lg text-xs flex items-center justify-center gap-1 shadow-sm hover:bg-[#C80511] transition-colors"><ClipboardList size={12}/> 訂房憑證</button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {editingId === 'new' ? (
        <AccommodationEditForm 
          onSave={(newAcc) => {
            setAccommodations([...accommodations, { ...newAcc, id: `a${Date.now()}` }]);
            setEditingId(null);
          }}
          onCancel={() => setEditingId(null)}
        />
      ) : (
        <button onClick={() => setEditingId('new')} className="w-full py-3 border border-dashed border-[#DDDDDD] rounded-2xl text-sm text-[#999999] flex items-center justify-center gap-1 hover:bg-white hover:text-[#E30613] hover:border-[#E30613]/50 transition-colors">
          <Plus size={18}/> 新增住宿紀錄
        </button>
      )}

      {viewingVoucher && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-5 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] p-6 w-full max-w-sm shadow-[0_10px_40px_rgba(0,0,0,0.1)] relative">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-medium text-[#111111]">訂房憑證</h3>
              <button onClick={() => setViewingVoucher(null)} className="text-[#999999] hover:text-[#111111]"><X size={20}/></button>
            </div>
            
            <div className="bg-[#FAFAFA] border border-[#EEEEEE] rounded-xl p-5 flex flex-col items-center justify-center mb-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#FEF2F2] rounded-bl-[100%] z-0"></div>
              
              <QrCode size={80} className="text-[#111111] mb-3 opacity-90 relative z-10" />
              <p className="text-[10px] text-[#999999] mb-1 relative z-10">訂房代號 Booking Ref.</p>
              <p className="text-xl font-serif tracking-widest text-[#E30613] font-bold relative z-10">{viewingVoucher.bookingRef || '未填寫代號'}</p>
            </div>
            
            <div className="space-y-3 text-sm text-[#666666] bg-[#FAFAFA] p-4 rounded-xl border border-[#EEEEEE]">
              <p><span className="text-[#999999] inline-block w-12">飯店</span> <span className="text-[#111111] font-medium">{viewingVoucher.name}</span></p>
              <p><span className="text-[#999999] inline-block w-12">入住</span> <span className="text-[#111111] font-medium">{viewingVoucher.dateStr}</span></p>
              <div>
                <span className="text-[#999999] block mb-1">憑證備註</span>
                <p className="text-[#111111] whitespace-pre-wrap">{viewingVoucher.voucherNote || '無備註資訊'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- 住宿編輯表單組件 ---
const AccommodationEditForm = ({ accommodation, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    accommodation || { dateStr: '', location: '', name: '', address: '', timeInfo: '', bookingRef: '', voucherNote: '' }
  );

  return (
    <div className="bg-[#FAFAFA] p-4 rounded-[24px] shadow-inner border border-[#EEEEEE] space-y-3">
      <div className="flex gap-3">
        <input 
          type="text" placeholder="日期 (如: 6/10-6/11 1晚)" value={formData.dateStr} onChange={e => setFormData({...formData, dateStr: e.target.value})}
          className="w-1/2 bg-white border border-[#EEEEEE] rounded-lg p-2 text-sm focus:outline-none focus:border-[#E30613]"
        />
        <input 
          type="text" placeholder="城市/地區 (如: Zurich)" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
          className="w-1/2 bg-white border border-[#EEEEEE] rounded-lg p-2 text-sm focus:outline-none focus:border-[#E30613]"
        />
      </div>
      <input 
        type="text" placeholder="飯店名稱 *" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
        className="w-full bg-white border border-[#EEEEEE] rounded-lg p-2 text-sm focus:outline-none focus:border-[#E30613]"
      />
      <input 
        type="text" placeholder="地址" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
        className="w-full bg-white border border-[#EEEEEE] rounded-lg p-2 text-sm focus:outline-none focus:border-[#E30613]"
      />
      <input 
        type="text" placeholder="入住資訊 (如: Check-in 15:00)" value={formData.timeInfo} onChange={e => setFormData({...formData, timeInfo: e.target.value})}
        className="w-full bg-white border border-[#EEEEEE] rounded-lg p-2 text-sm focus:outline-none focus:border-[#E30613]"
      />
      
      <div className="flex gap-3 pt-2 border-t border-dashed border-[#EEEEEE]">
        <input 
          type="text" placeholder="訂房代號 (選填)" value={formData.bookingRef || ''} onChange={e => setFormData({...formData, bookingRef: e.target.value})}
          className="w-1/2 bg-white border border-[#EEEEEE] rounded-lg p-2 text-sm focus:outline-none focus:border-[#E30613]"
        />
        <input 
          type="text" placeholder="憑證備註 (如: 已付款)" value={formData.voucherNote || ''} onChange={e => setFormData({...formData, voucherNote: e.target.value})}
          className="w-1/2 bg-white border border-[#EEEEEE] rounded-lg p-2 text-sm focus:outline-none focus:border-[#E30613]"
        />
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button onClick={onCancel} className="px-4 py-1.5 text-xs text-[#666666] bg-white rounded-lg border border-[#EEEEEE] hover:bg-[#FAFAFA] transition-colors">取消</button>
        <button onClick={() => {
          if(!formData.name.trim()) return; 
          onSave(formData);
        }} className="px-4 py-1.5 text-xs text-white bg-[#E30613] rounded-lg shadow-sm hover:bg-[#C80511] transition-colors">儲存</button>
      </div>
    </div>
  );
};

// --- 航班時刻表頁籤 ---
const FlightsTab = ({ flightInfo, setFlightInfo, onBack }) => {
  return (
    <div className="px-5 mt-4 space-y-4 pb-6">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onBack} className="w-8 h-8 rounded-full bg-white shadow-sm border border-[#EEEEEE] flex items-center justify-center text-[#666666] hover:text-[#E30613] hover:border-[#E30613]/30 transition-colors">
          <ChevronLeft size={18}/>
        </button>
        <h2 className="text-xl font-serif text-[#111111]">航班時刻表</h2>
      </div>
      
      <div className="bg-white rounded-[24px] shadow-sm border border-[#EEEEEE] p-5 relative overflow-hidden flex flex-col h-[50vh]">
        <div className="flex justify-between items-center mb-3 border-b border-[#EEEEEE] pb-3">
          <span className="text-sm font-medium text-[#111111]">航班資訊與備註</span>
          <Plane size={18} className="text-[#E30613] opacity-50"/>
        </div>
        <textarea 
          value={flightInfo}
          onChange={(e) => setFlightInfo(e.target.value)}
          placeholder="請在此貼上您的航班編號、起降時間、航廈資訊或電子機票細節..."
          className="w-full flex-1 bg-transparent resize-none focus:outline-none text-sm text-[#111111] placeholder-[#999999] leading-relaxed"
        ></textarea>
      </div>
    </div>
  );
};

// --- 匯率頁籤 ---
const WalletTab = () => (
  <div className="px-5 mt-4 space-y-4">
    <div className="flex bg-[#EEEEEE] rounded-full p-1 relative">
      <div className="w-1/2 bg-[#E30613] text-white text-center py-2.5 rounded-full text-sm font-medium z-10 shadow-sm">每日 Daily</div>
      <div className="w-1/2 text-center py-2.5 rounded-full text-sm font-medium text-[#666666] z-10">累積 Total</div>
    </div>
    <div className="bg-white rounded-[24px] border border-[#EEEEEE] p-6 relative overflow-hidden shadow-sm">
      <p className="text-sm text-[#666666] mb-4 flex justify-between">本日支出 06/11 <span className="font-serif italic text-[#999999]">Total</span></p>
      <div className="text-4xl font-serif text-[#111111] mb-2 flex items-baseline gap-2">
        <span className="text-lg text-[#666666]">NT$</span> 0
      </div>
      <p className="text-xs text-[#999999]">尚無外幣支出</p>
      <div className="absolute -bottom-4 -right-4 w-24 h-24 border-4 border-[#FAFAFA] rounded-full"></div>
      <div className="absolute bottom-4 right-4"><Wallet size={32} className="text-[#EEEEEE]"/></div>
    </div>
    <div className="bg-white border border-[#EEEEEE] rounded-[24px] p-6 shadow-sm">
      <p className="font-serif italic text-[#999999] mb-4">匯率換算 Currency</p>
      <div className="flex items-center justify-between gap-3 bg-[#FAFAFA] border border-[#EEEEEE] p-2 rounded-xl">
        <div className="flex-1 flex justify-between items-center px-3 py-2 bg-white rounded-lg shadow-sm border border-[#EEEEEE]">
          <span className="font-medium text-sm text-[#E30613]">CHF</span>
          <span className="text-lg text-[#111111]">0</span>
        </div>
        <ChevronRight size={16} className="text-[#999999] shrink-0" />
        <div className="flex-1 flex justify-between items-center px-3 py-2 bg-white rounded-lg shadow-sm border border-[#EEEEEE]">
          <span className="font-medium text-sm text-[#666666]">TWD</span>
          <span className="text-lg text-[#999999]">0</span>
        </div>
      </div>
      <p className="text-center text-[10px] text-[#999999] mt-3 tracking-wide">1 CHF ≈ 35.53 TWD · 更新於 2026/05/11</p>
    </div>
  </div>
);

// --- 地圖頁籤 ---
const MapTab = () => (
  <div className="px-5 mt-4 flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
    <h2 className="text-xl font-serif mb-4 text-[#111111]">地圖導航 <span className="float-right text-xs text-[#999999] font-sans italic pt-2">Map</span></h2>
    <div className="flex-1 bg-[#FAFAFA] rounded-3xl overflow-hidden relative border border-[#EEEEEE] shadow-inner flex items-center justify-center mb-6">
      <MapIcon size={64} className="text-[#EEEEEE] absolute" />
      <div className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-sm text-sm text-[#111111] flex justify-between items-center border border-[#EEEEEE]">
        <span>📍 目前顯示：瑞士</span>
        <span className="text-[10px] bg-[#FEF2F2] text-[#E30613] px-2 py-1 rounded-md">預覽模式</span>
      </div>
      <div className="absolute top-[30%] left-[60%] flex flex-col items-center">
        <div className="bg-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm text-[#111111] mb-1 border border-[#EEEEEE]">蘇黎世</div>
        <MapPin size={28} className="text-[#E30613] fill-[#FEF2F2]" />
      </div>
      <div className="absolute top-[50%] left-[45%] flex flex-col items-center hover:-translate-y-1 transition-transform cursor-pointer">
        <div className="bg-[#E30613] text-[10px] font-bold px-2 py-0.5 rounded shadow-sm text-white mb-1">少女峰</div>
        <MapPin size={36} className="text-[#E30613] fill-[#FEF2F2] animate-bounce" />
      </div>
    </div>
  </div>
);

// --- 行前準備頁籤 ---
const PrepTab = ({ items, setItems, onBack }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  
  // 編輯狀態管理
  const [editingItemId, setEditingItemId] = useState(null);
  const [editItemText, setEditItemText] = useState('');

  const toggle = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setItems(items.filter(item => item.id !== id));
  };

  const handleAdd = () => {
    if (newItemText.trim()) {
      setItems([...items, { id: Date.now(), text: newItemText, done: false }]);
      setNewItemText('');
      setIsAdding(false);
    }
  };

  const startEdit = (item, e) => {
    e.stopPropagation();
    setEditingItemId(item.id);
    setEditItemText(item.text);
  };

  const saveEdit = (e) => {
    e.stopPropagation();
    if(editItemText.trim()) {
      setItems(items.map(i => i.id === editingItemId ? { ...i, text: editItemText } : i));
    }
    setEditingItemId(null);
  };

  const completedCount = items.filter(i => i.done).length;

  return (
    <div className="px-5 mt-4 pb-4">
      {/* 帶有返回鍵的標題列 */}
      <div className="flex items-center gap-3 mb-4">
        {onBack && (
          <button onClick={onBack} className="w-8 h-8 rounded-full bg-white shadow-sm border border-[#EEEEEE] flex items-center justify-center text-[#666666] hover:text-[#E30613] hover:border-[#E30613]/30 transition-colors">
            <ChevronLeft size={18}/>
          </button>
        )}
        <h2 className="text-xl font-serif text-[#111111] flex-1">行前準備 <span className="float-right text-xs text-[#999999] font-sans italic pt-2">Checklist</span></h2>
      </div>

      <div className="bg-white rounded-[24px] p-5 shadow-sm border border-[#EEEEEE]">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-[#111111]">行李清單與提醒</span>
          <span className="text-xs text-[#E30613] bg-[#FEF2F2] px-2 py-1 rounded-md font-medium">
            完成 {completedCount}/{items.length}
          </span>
        </div>
        
        <div className="space-y-1">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between py-3 border-b border-[#EEEEEE] last:border-0 hover:bg-[#FAFAFA] -mx-2 px-2 rounded-lg transition-colors group">
              {editingItemId === item.id ? (
                // 編輯模式
                <div className="flex items-center gap-2 flex-1 w-full">
                  <input 
                    type="text" 
                    value={editItemText}
                    onChange={(e) => setEditItemText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit(e)}
                    className="flex-1 border border-[#EEEEEE] rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#E30613] focus:ring-1 focus:ring-[#E30613]"
                    autoFocus
                  />
                  <button onClick={saveEdit} className="text-[#E30613] p-1.5 hover:bg-[#FEF2F2] rounded-full transition-colors"><Save size={16}/></button>
                </div>
              ) : (
                // 顯示模式
                <>
                  <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => toggle(item.id)}>
                    <div className={`w-5 h-5 shrink-0 rounded-[6px] border flex items-center justify-center transition-colors ${item.done ? 'bg-[#E30613] border-[#E30613]' : 'bg-white border-[#DDDDDD]'}`}>
                      {item.done && <Check size={14} className="text-white" strokeWidth={3} />}
                    </div>
                    <span className={`text-[15px] transition-colors ${item.done ? 'line-through text-[#999999]' : 'text-[#111111]'}`}>{item.text}</span>
                  </div>
                  
                  <div className="flex gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => startEdit(item, e)} 
                      className="p-1.5 text-[#CCCCCC] hover:text-[#E30613] hover:bg-[#FEF2F2] rounded-full transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={(e) => handleDelete(item.id, e)} 
                      className="p-1.5 text-[#CCCCCC] hover:text-[#E30613] hover:bg-[#FEF2F2] rounded-full transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {isAdding ? (
          <div className="mt-4 pt-3 border-t border-[#EEEEEE] flex items-center gap-2">
            <input 
              type="text" 
              autoFocus
              placeholder="輸入準備項目..." 
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="flex-1 border border-[#EEEEEE] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E30613] focus:ring-1 focus:ring-[#E30613]"
            />
            <button onClick={() => {setIsAdding(false); setNewItemText('');}} className="px-3 py-2 text-[#999999] hover:text-[#111111] text-sm transition-colors">取消</button>
            <button onClick={handleAdd} className="px-3 py-2 bg-[#E30613] text-white rounded-lg text-sm shadow-sm hover:bg-[#C80511] transition-colors">儲存</button>
          </div>
        ) : (
          <button onClick={() => setIsAdding(true)} className="w-full mt-4 py-3 border border-dashed border-[#DDDDDD] rounded-xl text-sm text-[#999999] flex items-center justify-center gap-1 hover:text-[#E30613] hover:border-[#E30613]/50 transition-colors">
            <Plus size={16}/> 新增項目
          </button>
        )}
      </div>
    </div>
  );
};

// --- 票券資訊頁籤 (修改為支援新增、編輯與刪除) ---
const TicketsTab = ({ tickets, setTickets }) => {
  const [editingId, setEditingId] = useState(null);

  const handleDelete = (id) => {
    setTickets(tickets.filter(t => t.id !== id));
  };

  return (
    <div className="px-5 mt-4 pb-4">
      <h2 className="text-xl font-serif mb-4 text-[#111111]">票券資訊 <span className="float-right text-xs text-[#999999] font-sans italic pt-2">Tickets</span></h2>
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div key={ticket.id}>
            {editingId === ticket.id ? (
              <TicketEditForm 
                ticket={ticket} 
                onSave={(updatedTicket) => {
                  setTickets(tickets.map(t => t.id === ticket.id ? updatedTicket : t));
                  setEditingId(null);
                }} 
                onCancel={() => setEditingId(null)} 
              />
            ) : (
              <div className="bg-white rounded-[24px] shadow-sm border border-[#EEEEEE] overflow-hidden flex relative group">
                {/* 側邊顏色依據 Pass 或 Ticket 動態切換 */}
                <div className={`w-20 ${ticket.type === 'Pass' ? 'bg-[#E30613]' : 'bg-[#B91C1C]'} text-white flex flex-col items-center justify-center relative border-r-2 border-dashed border-white shrink-0`}>
                  <span className="text-xs opacity-90 mb-1 font-medium">{ticket.type}</span><QrCode size={28} className="opacity-100"/>
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#FAFAFA] rounded-full"></div>
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full"></div>
                </div>
                <div className="flex-1 p-4 relative">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] bg-[#FEF2F2] text-[#E30613] px-2 py-0.5 rounded">{ticket.category}</span>
                    <span className="text-xs font-serif text-[#999999] pr-12">{ticket.timeInfo}</span>
                  </div>
                  <h3 className="font-medium text-[#111111] mt-1 pr-12">{ticket.title}</h3>
                  <p className="text-[10px] text-[#666666] mt-2 flex items-center gap-1">{ticket.note}</p>
                  
                  {/* 操作按鈕：顯示於右上角 */}
                  <div className="absolute top-4 right-3 flex gap-2">
                    <button onClick={() => setEditingId(ticket.id)} className="text-[#CCCCCC] hover:text-[#E30613] transition-colors"><Edit2 size={14}/></button>
                    <button onClick={() => handleDelete(ticket.id)} className="text-[#CCCCCC] hover:text-[#E30613] transition-colors"><Trash2 size={14}/></button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* 新增票券區塊 */}
        {editingId === 'new' ? (
          <TicketEditForm 
            onSave={(newTicket) => {
              setTickets([...tickets, { ...newTicket, id: `t${Date.now()}` }]);
              setEditingId(null);
            }} 
            onCancel={() => setEditingId(null)} 
          />
        ) : (
          <button onClick={() => setEditingId('new')} className="w-full py-3 border border-dashed border-[#DDDDDD] rounded-2xl text-sm text-[#999999] flex items-center justify-center gap-1 hover:bg-white hover:text-[#E30613] hover:border-[#E30613]/50 transition-colors">
            <Plus size={18}/> 新增票券
          </button>
        )}
      </div>
    </div>
  );
};

// --- 票券編輯表單組件 (新增) ---
const TicketEditForm = ({ ticket, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    ticket || { type: 'Pass', category: '', timeInfo: '', title: '', note: '' }
  );

  return (
    <div className="bg-[#FAFAFA] p-4 rounded-[24px] shadow-inner border border-[#EEEEEE] space-y-3">
      <div className="flex gap-3">
        <select 
          value={formData.type} 
          onChange={e => setFormData({...formData, type: e.target.value})}
          className="w-1/3 bg-white border border-[#EEEEEE] rounded-lg p-2 text-sm focus:outline-none focus:border-[#E30613]"
        >
          <option value="Pass">Pass</option>
          <option value="Ticket">Ticket</option>
        </select>
        <input 
          type="text" placeholder="類別 (如: 交通/景點)" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
          className="w-2/3 bg-white border border-[#EEEEEE] rounded-lg p-2 text-sm focus:outline-none focus:border-[#E30613]"
        />
      </div>
      <input 
        type="text" placeholder="票券名稱 *" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
        className="w-full bg-white border border-[#EEEEEE] rounded-lg p-2 text-sm focus:outline-none focus:border-[#E30613]"
      />
      <input 
        type="text" placeholder="日期/期限 (如: 連續8天 或 06/11 11:30)" value={formData.timeInfo} onChange={e => setFormData({...formData, timeInfo: e.target.value})}
        className="w-full bg-white border border-[#EEEEEE] rounded-lg p-2 text-sm focus:outline-none focus:border-[#E30613]"
      />
      <input 
        type="text" placeholder="備註 (如: 預訂代號或存放位置)" value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})}
        className="w-full bg-white border border-[#EEEEEE] rounded-lg p-2 text-sm focus:outline-none focus:border-[#E30613]"
      />
      <div className="flex justify-end gap-2 pt-1">
        <button onClick={onCancel} className="px-4 py-1.5 text-xs text-[#666666] bg-white rounded-lg border border-[#EEEEEE] hover:bg-[#FAFAFA] transition-colors">取消</button>
        <button onClick={() => {
          if(!formData.title.trim()) return; // 簡單防呆：沒填標題就不給存
          onSave(formData);
        }} className="px-4 py-1.5 text-xs text-white bg-[#E30613] rounded-lg shadow-sm hover:bg-[#C80511] transition-colors">儲存</button>
      </div>
    </div>
  );
};

// --- 底部導覽列 (全新完美 5 鍵對稱排版) ---
const BottomNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <div className="fixed bottom-0 max-w-[430px] w-full bg-white/95 backdrop-blur-lg border-t border-[#EEEEEE] px-4 py-2 pb-6 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
      <div className="flex justify-between items-end relative w-full">
        
        {/* 左側 2 顆按鈕 */}
        <NavItem icon={<CalendarIcon size={24}/>} label="行程" isActive={activeTab === 'itinerary'} onClick={() => setActiveTab('itinerary')} />
        <NavItem icon={<Bed size={24}/>} label="住宿" isActive={activeTab === 'accommodation'} onClick={() => setActiveTab('accommodation')} />
        
        {/* 中間首頁按鈕（保留完美置中，並擴大佔位空間避免擁擠） */}
        <div className="w-16 shrink-0"></div> 
        <div className="absolute left-1/2 -translate-x-1/2 -top-1 flex flex-col items-center justify-center w-14">
          <div className="absolute w-16 h-16 bg-white rounded-full shadow-[0_-4px_10px_rgba(0,0,0,0.03)] border border-[#EEEEEE] z-0"></div>
          <button 
            onClick={() => setActiveTab('home')}
            className={`w-12 h-12 rounded-full flex items-center justify-center z-10 transition-transform ${activeTab === 'home' ? 'bg-[#E30613] text-white shadow-[0_4px_12px_rgba(227,6,19,0.3)] scale-110' : 'bg-[#FAFAFA] border border-[#EEEEEE] text-[#666666]'}`}
          >
            <Home size={24} />
          </button>
          <span className={`text-[10px] mt-2 font-medium z-10 ${activeTab === 'home' ? 'text-[#E30613]' : 'text-[#666666]'}`}>首頁</span>
        </div>
        
        {/* 右側 2 顆按鈕 */}
        <NavItem icon={<Wallet size={24}/>} label="匯率" isActive={activeTab === 'wallet'} onClick={() => setActiveTab('wallet')} />
        <NavItem icon={<Ticket size={24}/>} label="票券" isActive={activeTab === 'tickets'} onClick={() => setActiveTab('tickets')} />
        
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, isActive, onClick }) => (
  // 將寬度稍微放大 (w-[18%]) 以適應 5 個選項的版面
  <button onClick={onClick} className={`flex flex-col items-center justify-center w-[18%] gap-1 transition-colors ${isActive ? 'text-[#E30613]' : 'text-[#999999] hover:text-[#666666]'}`}>
    {icon}
    <span className="text-[10px] font-medium whitespace-nowrap">{label}</span>
    {isActive && <div className="w-1 h-1 bg-[#E30613] rounded-full absolute -bottom-2"></div>}
  </button>
);

export default App;