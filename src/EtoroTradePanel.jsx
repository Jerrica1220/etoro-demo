import React, { useState, useEffect } from "react";

// 初始資金設定
const INITIAL_BALANCE = 50000;

// 模擬標的資料
const MOCK_SYMBOLS = [
  { symbol: "AAPL", name: "蘋果公司", price: 210 },
  { symbol: "TSLA", name: "特斯拉", price: 700 },
  { symbol: "AMZN", name: "亞馬遜", price: 115 },
  { symbol: "GOOG", name: "Google", price: 135 },
  { symbol: "UBER", name: "優步", price: 63 },
];

// 隨機產生價格（模擬即時行情）
function randomPrice(base) {
  return (base + (Math.random() - 0.5) * 1.5).toFixed(2);
}

// 計算浮動盈虧
function getFloatPL(pos) {
  const diff =
    pos.direction === "買入"
      ? pos.currentPrice - pos.openPrice
      : pos.openPrice - pos.currentPrice;
  return ((diff * pos.leverage * pos.amount) / pos.openPrice).toFixed(2);
}

// 計算部位金額
function getPositionValue(pos) {
  return pos.amount;
}

// 狀態顏色
function statusColor(status) {
  return status === "可交易" ? "#34c759" : "#e23c2d";
}

export default function EtoroTradePanel() {
  // 帳戶資訊
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [positions, setPositions] = useState([]);
  const [realizedPL, setRealizedPL] = useState(0);
  const [status, setStatus] = useState("可交易"); // or "限制中"

  // 新增標的
  const [newSymbol, setNewSymbol] = useState("");
  const [trackedSymbols, setTrackedSymbols] = useState([...MOCK_SYMBOLS]);

  // 虛擬下單
  const [orderSymbol, setOrderSymbol] = useState("");
  const [orderDirection, setOrderDirection] = useState("買入");
  const [orderAmount, setOrderAmount] = useState(1000);
  const [orderLeverage, setOrderLeverage] = useState(1);
  const [enableTrailingStop, setEnableTrailingStop] = useState(false);

  // 展開監控（for 標的物監控選單）
  const [expandSymbolIdx, setExpandSymbolIdx] = useState(-1);

  // 展開監控（for 持倉表格）
  const [expandIdx, setExpandIdx] = useState(-1);

  // 回測
  const [backtestResult, setBacktestResult] = useState(null);
  const [backtestSymbol, setBacktestSymbol] = useState("");
  const [backtestDay, setBacktestDay] = useState(5);

  // 自動刷新現價
  useEffect(() => {
    const timer = setInterval(() => {
      setPositions((prev) =>
        prev.map((pos) => ({
          ...pos,
          currentPrice: Number(randomPrice(pos.currentPrice)),
        }))
      );
      setTrackedSymbols((prev) =>
        prev.map((s) => ({
          ...s,
          price: Number(randomPrice(s.price)),
        }))
      );
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // 投入金額（已分配進部位的資金）
  const allocated = positions.reduce(
    (sum, pos) => sum + getPositionValue(pos),
    0
  );
  // 浮動盈虧
  const floatPL = positions.reduce(
    (sum, pos) => sum + parseFloat(getFloatPL(pos)),
    0
  );
  // 剩餘資金
  const remain = balance - allocated;

  // 新增追蹤標的
  const handleAddSymbol = () => {
    if (!newSymbol.trim()) return;
    if (
      trackedSymbols.find(
        (s) =>
          s.name === newSymbol.trim() || s.symbol === newSymbol.trim().toUpperCase()
      )
    )
      return;
    setTrackedSymbols([
      ...trackedSymbols,
      {
        symbol: newSymbol.toUpperCase(),
        name: newSymbol,
        price: Number(randomPrice(100 + Math.random() * 300)),
      },
    ]);
    setNewSymbol("");
  };

  // 虛擬下單
  const handleVirtualOrder = () => {
    if (!orderSymbol) return;
    const symbolObj = trackedSymbols.find((s) => s.symbol === orderSymbol);
    if (!symbolObj) return;
    if (orderAmount > remain) {
      alert("資金不足！");
      return;
    }
    setPositions([
      ...positions,
      {
        symbol: symbolObj.symbol,
        name: symbolObj.name,
        direction: orderDirection,
        amount: Number(orderAmount),
        leverage: Number(orderLeverage),
        openPrice: symbolObj.price,
        currentPrice: symbolObj.price,
        trailingStop: enableTrailingStop,
      },
    ]);
  };

  // 刪除部位（模擬平倉，轉入已實現損益）含二次確認
  const handleClosePosition = (idx) => {
    if (window.confirm("確定要平倉嗎？")) {
      const pos = positions[idx];
      const pl = parseFloat(getFloatPL(pos));
      setRealizedPL((prev) => prev + pl);
      setBalance((prev) => prev + pos.amount + pl);
      setPositions((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  // 展開/收合 for 持倉表格
  const toggleExpand = (idx) => {
    setExpandIdx(idx === expandIdx ? -1 : idx);
  };

  // 展開/收合 for 標的物監控
  const toggleExpandSymbol = (idx) => {
    setExpandSymbolIdx(idx === expandSymbolIdx ? -1 : idx);
  };

  // 回測功能（簡單模擬）
  const handleBacktest = () => {
    if (!backtestSymbol) return;
    const profit = (Math.random() - 0.5) * 2000;
    setBacktestResult({
      symbol: backtestSymbol,
      day: backtestDay,
      totalPL: profit.toFixed(2),
      winRate: (50 + Math.random() * 50).toFixed(1) + "%",
      maxDrawdown: "-" + (Math.random() * 10).toFixed(2) + "%",
      note: "僅供參考",
    });
  };

  // 搜尋標的物
  const [search, setSearch] = useState("");
  const filteredSymbols = trackedSymbols.filter(
    (s) =>
      s.name.toLowerCase().includes(search.trim().toLowerCase()) ||
      s.symbol.toLowerCase().includes(search.trim().toLowerCase())
  );

  // 只顯示兩個標的物的高度
  const symbolCardHeight = 28;
  const symbolListMaxHeight = symbolCardHeight * 2 + 4;

  return (
    <div
      style={{
        maxWidth: 780,
        margin: "28px auto",
        padding: 10,
        fontFamily: "Noto Sans TC, Microsoft JhengHei, Arial, sans-serif"
      }}
    >
      {/* 帳戶總覽 */}
      <div
        style={{
          background: "#f6fafb",
          border: "1px solid #d2d9e0",
          borderRadius: 9,
          padding: "12px 16px 10px 16px",
          marginBottom: 22,
          display: "flex",
          gap: 16,
          flexWrap: "wrap"
        }}
      >
        <div>
          <div style={accountLabel}>投入金額</div>
          <div style={accountValue}>{allocated.toLocaleString()} USD</div>
        </div>
        <div>
          <div style={accountLabel}>浮動盈虧</div>
          <div
            style={{
              ...accountValue,
              color: floatPL >= 0 ? "#26b475" : "#e23c2d"
            }}
          >
            {floatPL >= 0 ? "+" : ""}
            {floatPL.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD
          </div>
        </div>
        <div>
          <div style={accountLabel}>剩餘資金</div>
          <div style={accountValue}>{remain.toLocaleString()} USD</div>
        </div>
        <div>
          <div style={accountLabel}>今日狀態</div>
          <div style={{ ...accountValue, display: "flex", alignItems: "center", gap: 5 }}>
            <span
              style={{
                display: "inline-block",
                width: 13,
                height: 13,
                borderRadius: 2,
                background: statusColor(status),
                marginRight: 2,
              }}
            ></span>
            {status}
          </div>
        </div>
        <div>
          <div style={accountLabel}>當日已實現損益</div>
          <div
            style={{
              ...accountValue,
              color: realizedPL >= 0 ? "#26b475" : "#e23c2d"
            }}
          >
            {realizedPL >= 0 ? "+" : ""}
            {realizedPL.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD
          </div>
        </div>
      </div>

      {/* 新增標的/下單/回測 */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: 12,
        marginBottom: 13
      }}>
        {/* 新增標的 */}
        <div style={{ minWidth: 210, maxWidth: 250, flex: 1 }}>
          <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 15.5 }}>新增標的物</div>
          <div style={{ display: "flex", gap: 5, marginBottom: 4 }}>
            <input
              type="text"
              placeholder="輸入名稱或代碼"
              value={newSymbol}
              onChange={e => setNewSymbol(e.target.value)}
              style={inputStyleSmall}
              onKeyDown={e => e.key === "Enter" && handleAddSymbol()}
              title="輸入要新增追蹤的標的（可用名稱或代碼）"
            />
            <button style={btnStyleSmall} onClick={handleAddSymbol}>
              新增
            </button>
          </div>
          <input
            type="text"
            placeholder="搜尋標的"
            style={{ ...inputStyleSmall, marginBottom: 4 }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {/* 標的物即時監控收合選單（捲軸，只顯示2樣） */}
          <div style={{
            maxHeight: symbolListMaxHeight,
            overflowY: 'auto',
            border: '1px solid #e6e6e6',
            borderRadius: 4,
            padding: 2,
            background: '#fff',
          }}>
            {filteredSymbols.length === 0 && (
              <div style={{ color: "#aaa", fontSize: 13, padding: 7, textAlign: "center" }}>查無標的</div>
            )}
            {filteredSymbols.map((s, idx) => (
              <div key={s.symbol} style={{
                border: "1px solid #e1e8ef",
                borderRadius: 4,
                marginBottom: 3,
                padding: "3px 7px",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                fontSize: 14,
                height: symbolCardHeight
              }}>
                <span style={{ fontWeight: 500 }}>{s.name}（{s.symbol}）</span>
                <button
                  style={{
                    marginLeft: "auto",
                    background: "#f5f7fa",
                    color: "#1d72b8",
                    border: "1px solid #b2cce5",
                    borderRadius: 3,
                    fontSize: 13.5,
                    padding: "1.5px 10px",
                    height: 22,
                    cursor: "pointer"
                  }}
                  onClick={() => toggleExpandSymbol(idx)}
                >
                  {expandSymbolIdx === idx ? "收合監控" : "展開監控"}
                </button>
                {expandSymbolIdx === idx && (
                  <div style={{
                    position: "absolute",
                    zIndex: 9,
                    marginTop: 28,
                    left: 0,
                    right: 0,
                    background: "#f8fafc",
                    border: "1px solid #cce0f2",
                    borderRadius: 5,
                    padding: "8px 13px",
                    fontSize: 13.5,
                    minWidth: 120
                  }}>
                    <div>
                      現價：<b>{s.price}</b> USD
                      漲跌幅：
                      <span style={{ color: (Math.random() > 0.5 ? "#26b475" : "#e23c2d") }}>
                        {((Math.random() - 0.5) * 2).toFixed(2)}%
                      </span>
                      成交量：{(Math.random() * 1000 + 2000).toFixed(0)}
                    </div>
                    <div style={{ color: "#888", fontSize: 12 }}>
                      （即時數據為範例）
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 虛擬下單 */}
        <div style={{ minWidth: 260, maxWidth: 320, flex: 1 }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 6
          }}>
            <span style={{ fontWeight: 600, fontSize: 15.5 }}>虛擬下單</span>
            {/* 讓按鈕樣式和「新增」一樣 */}
            <button
              style={btnStyleSmall}
              onClick={handleVirtualOrder}
            >
              模擬下單
            </button>
          </div>
          <div style={{ display: "flex", gap: 5, alignItems: "center", marginBottom: 5 }}>
            <select style={inputStyleSmall} value={orderSymbol} onChange={e => setOrderSymbol(e.target.value)}>
              <option value="">選擇標的</option>
              {trackedSymbols.map((s, i) => (
                <option value={s.symbol} key={i}>{s.name}（{s.symbol}）</option>
              ))}
            </select>
            <select style={inputStyleSmall} value={orderDirection} onChange={e => setOrderDirection(e.target.value)}>
              <option value="買入">買入</option>
              <option value="賣出">賣出</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 5, alignItems: "center", marginBottom: 5 }}>
            <input
              type="number"
              style={inputStyleSmall}
              placeholder="投入金額（USD）"
              value={orderAmount}
              min={1}
              onChange={e => setOrderAmount(Number(e.target.value))}
              title="投入金額，單位：USD"
            />
            <input
              type="number"
              style={inputStyleSmall}
              placeholder="槓桿（倍數）"
              value={orderLeverage}
              min={1}
              max={20}
              onChange={e => setOrderLeverage(Number(e.target.value))}
              title="槓桿，單位：倍"
            />
          </div>
          {/* 移動停損勾選 */}
          <div style={{ display: "flex", alignItems: "center", marginTop: 2, marginBottom: 4 }}>
            <input
              type="checkbox"
              id="enableTrailingStop"
              checked={enableTrailingStop}
              onChange={e => setEnableTrailingStop(e.target.checked)}
              style={{ width: 15, height: 15, marginRight: 5 }}
            />
            <label htmlFor="enableTrailingStop" style={{ fontSize: 13.2, color: "#444" }}>
              啟用移動停損
            </label>
          </div>
          <div style={{ fontSize: 12.5, color: "#888" }}>
            <span style={{ color: "#26b475", fontWeight: 600 }}>※</span> 投入金額單位：<b>USD</b>，槓桿單位：<b>倍</b>
          </div>
        </div>
        {/* 快速回測 */}
        <div style={{ minWidth: 180, maxWidth: 230, flex: 1 }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 6
          }}>
            <span style={{ fontWeight: 600, fontSize: 15.5 }}>快速回測</span>
            {/* 讓按鈕樣式和「新增」一樣 */}
            <button
              style={btnStyleSmall}
              onClick={handleBacktest}
            >
              回測
            </button>
          </div>
          <div style={{ display: "flex", gap: 5, alignItems: "center", marginBottom: 5 }}>
            <select style={inputStyleSmall} value={backtestSymbol} onChange={e => setBacktestSymbol(e.target.value)}>
              <option value="">選擇標的</option>
              {trackedSymbols.map((s, i) => (
                <option value={s.symbol} key={i}>{s.name}（{s.symbol}）</option>
              ))}
            </select>
            <input
              type="number"
              style={inputStyleSmall}
              placeholder="回測天數"
              min={1}
              value={backtestDay}
              onChange={e => setBacktestDay(Number(e.target.value))}
              title="回測天數，單位：天"
            />
          </div>
          <div style={{ fontSize: 12.5, color: "#888" }}>
            <span style={{ color: "#26b475", fontWeight: 600 }}>※</span> 回測天數單位：<b>天</b>
          </div>
          {backtestResult && (
            <div style={{
              background: "#f6f8fa",
              border: "1px solid #d3e1e8",
              borderRadius: 5,
              padding: 7,
              marginTop: 4,
              fontSize: 13.8
            }}>
              <div><b>{backtestResult.symbol}</b> 回測{backtestResult.day}日</div>
              <div>總損益：<span style={{ color: backtestResult.totalPL >= 0 ? "#26b475" : "#e23c2d" }}>{backtestResult.totalPL} USD</span></div>
              <div>勝率：{backtestResult.winRate}</div>
              <div>最大回撤：{backtestResult.maxDrawdown}</div>
              <div style={{ color: "#888", fontSize: 12 }}>{backtestResult.note}</div>
            </div>
          )}
        </div>
      </div>

      {/* 當前部位（持倉） */}
      <div
        style={{
          background: "#f7fafe",
          border: "1px solid #c7d5e5",
          borderRadius: 7,
          padding: "14px 13px 10px 13px",
          marginBottom: 30,
          maxWidth: 600, // 框縮窄
          marginLeft: "auto",
          marginRight: "auto"
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 15,
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            padding: "3px 0 3px 8px"
          }}
        >
          {/* 圖標拿掉，標題改為持倉單位 */}
          持倉單位
        </div>
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            background: "#fff",
            borderRadius: 6,
            overflow: "hidden",
            fontSize: 14,
          }}
        >
          <thead>
            <tr style={{ background: "#eaf2fa", fontWeight: 600 }}>
              <th style={thStyle}>標的物</th>
              <th style={thStyle}>方向</th>
              <th style={thStyle}>開倉金額</th>
              <th style={thStyle}>槓桿</th>
              <th style={thStyle}>開倉價</th>
              <th style={thStyle}>現價</th>
              <th style={thStyle}>浮盈/浮虧</th>
              <th style={thStyle}>移動停損</th>
              <th style={thStyle}>操作</th>
            </tr>
          </thead>
          <tbody>
            {positions.length === 0 && (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", color: "#aaa", padding: 10, fontSize: 13 }}>
                  尚無持倉地點
                </td>
              </tr>
            )}
            {positions.map((pos, i) => (
              <React.Fragment key={i}>
                <tr style={{ background: i % 2 === 0 ? "#f6f8fc" : "#fff" }}>
                  <td style={tdStyle}>{pos.name}（{pos.symbol}）</td>
                  <td style={tdStyle}>{pos.direction}</td>
                  <td style={tdStyle}>{pos.amount}</td>
                  <td style={tdStyle}>{pos.leverage}</td>
                  <td style={tdStyle}>{pos.openPrice}</td>
                  <td style={tdStyle}>{pos.currentPrice}</td>
                  <td
                    style={{
                      ...tdStyle,
                      fontWeight: 600,
                      color: getFloatPL(pos) >= 0 ? "#26b475" : "#e23c2d"
                    }}
                  >
                    {getFloatPL(pos)}
                  </td>
                  <td style={tdStyle}>
                    {pos.trailingStop ? (
                      <span style={{ color: "#26b475", fontWeight: 600 }}>啟用</span>
                    ) : (
                      <span style={{ color: "#aaa" }}>未啟用</span>
                    )}
                  </td>
                  <td style={tdStyle}>
                    <button
                      style={{
                        ...btnStyleSmall,
                        background: "#fff4f0",
                        color: "#e23c2d",
                        border: "1px solid #e23c2d",
                        marginRight: 4
                      }}
                      onClick={() => handleClosePosition(i)}
                    >
                      平倉
                    </button>
                    <button
                      style={{
                        ...btnStyleSmall,
                        background: expandIdx === i ? "#eaf2fa" : "#f5f7fa",
                        color: "#1d72b8",
                        border: "1px solid #b2cce5"
                      }}
                      onClick={() => toggleExpand(i)}
                    >
                      {expandIdx === i ? "收合監控" : "展開監控"}
                    </button>
                  </td>
                </tr>
                {/* 展開即時監控 */}
                {expandIdx === i && (
                  <tr>
                    <td colSpan={9} style={{
                      background: "#f1f6fe",
                      borderBottom: "1px solid #dbe5f2",
                      padding: 0
                    }}>
                      <div style={{ padding: "9px 11px", fontSize: 13.5 }}>
                        <div>
                          <b>即時監控</b>｜
                          現價：<span style={{ fontWeight: 600 }}>{pos.currentPrice}</span>
                          ，漲跌幅：
                          <span style={{ color: (pos.currentPrice - pos.openPrice) >= 0 ? "#26b475" : "#e23c2d" }}>
                            {(((pos.currentPrice - pos.openPrice) / pos.openPrice) * 100).toFixed(2)}%
                          </span>
                          ，成交量：{(Math.random() * 1000 + 2000).toFixed(0)}
                        </div>
                        <div style={{ marginTop: 3, color: "#888" }}>
                          （本區資料為模擬，僅供展示）
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* 主要操作按鈕 */}
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <button
          style={{
            background: "#26b475",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            fontSize: 17,
            fontWeight: "bold",
            padding: "12px 45px",
            marginTop: 6,
            cursor: "pointer",
            letterSpacing: 1.5
          }}
          onClick={() => alert("已帶入eToro下單畫面（Demo）")}
        >
          帶入eToro下單畫面
        </button>
      </div>
    </div>
  );
}

const accountLabel = { color: "#586479", fontSize: 12.8, marginBottom: 1 };
const accountValue = { fontWeight: 600, fontSize: 15.5, letterSpacing: 0.5 };

const inputStyleSmall = {
  border: "1px solid #b1c7e6",
  borderRadius: 3,
  padding: "4px 7px",
  fontSize: 13.5,
  outline: "none",
  minWidth: 48,
  height: 24,
};

const btnStyleSmall = {
  background: "#eaf6f0",
  color: "#26b475",
  border: "1px solid #26b475",
  borderRadius: 3,
  padding: "2.5px 13px",
  fontWeight: 500,
  fontSize: 13.5,
  cursor: "pointer",
  height: 24,
};

const btnStylePrimary = {
  background: "#26b475",
  color: "#fff",
  border: "none",
  borderRadius: 5,
  fontSize: 15.5,
  fontWeight: "bold",
  padding: "8px 24px",
  cursor: "pointer",
  letterSpacing: 1.1
};

const thStyle = {
  padding: "6px 0",
  borderBottom: "1px solid #e3eaf2",
  textAlign: "center",
  letterSpacing: 0.5,
  fontSize: 13.5,
};
const tdStyle = {
  padding: "6px 0",
  borderBottom: "1px solid #e3eaf2",
  textAlign: "center",
  fontSize: 13.5,
};