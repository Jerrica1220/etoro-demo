import React, { useState } from "react";

// 主按鈕樣式（與「新增」一致）
const btnStyleMain = {
    background: "#26b475",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    fontSize: 14.5,
    fontWeight: 500,
    padding: "4.5px 20px",
    cursor: "pointer",
    height: 32,
    minWidth: 60,
    marginLeft: 2,
};

function EtoroTradePanel() {
    const [symbolInput, setSymbolInput] = useState("");
    const [symbols, setSymbols] = useState([]);

    // 新增標的事件
    const handleAddSymbol = () => {
        const value = symbolInput.trim();
        if (value && !symbols.includes(value)) {
            setSymbols([...symbols, value]);
            setSymbolInput("");
        }
    };

    // 虛擬下單事件（範例）
    const handleVirtualOrder = () => {
        alert("模擬下單功能尚未實作");
    };

    // 快速回測事件（範例）
    const handleBacktest = () => {
        alert("回測功能尚未實作");
    };

    return (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
            {/* 新增標的 */}
            <div style={{ minWidth: 210, maxWidth: 250, flex: 1, marginBottom: 20 }}>
                <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 15.5 }}>新增標的物</div>
                <div style={{ display: "flex", gap: 5, marginBottom: 4 }}>
                    <input
                        type="text"
                        value={symbolInput}
                        onChange={e => setSymbolInput(e.target.value)}
                        placeholder="輸入標的代碼"
                        style={{ flex: 1, padding: "5px 8px", fontSize: 15 }}
                        onKeyDown={e => { if (e.key === 'Enter') handleAddSymbol(); }}
                    />
                    <button style={btnStyleMain} onClick={handleAddSymbol}>新增</button>
                </div>
            </div>

            {/* 虛擬下單 */}
            <div style={{ minWidth: 260, maxWidth: 320, flex: 1, marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, fontSize: 15.5 }}>虛擬下單</span>
                    <button style={btnStyleMain} onClick={handleVirtualOrder}>模擬下單</button>
                </div>
            </div>

            {/* 快速回測 */}
            <div style={{ minWidth: 180, maxWidth: 230, flex: 1, marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, fontSize: 15.5 }}>快速回測</span>
                    <button style={btnStyleMain} onClick={handleBacktest}>回測</button>
                </div>
            </div>

            {/* 目前持倉（顯示新增的標的物） */}
            <div style={{
                background: "#f7fafe",
                border: "1px solid #c7d5e5",
                borderRadius: 7,
                padding: "14px 13px 10px 13px",
                marginBottom: 30,
                maxWidth: 680,
                marginLeft: "auto",
                marginRight: "auto",
            }}>
                <div style={{
                    fontWeight: 500,
                    fontSize: 14,
                    marginBottom: 8,
                    padding: "3px 0 3px 8px",
                    letterSpacing: 0.5,
                    color: "#333",
                }}>
                    <span style={{ fontSize: 15, marginRight: 6 }}>📌</span>
                    目前持倉
                </div>
                <table style={{
                    width: "100%",
                    borderCollapse: "separate",
                    borderSpacing: 0,
                    background: "#fff",
                    borderRadius: 6,
                    fontSize: 13.5,
                    maxWidth: 670,
                    margin: "0 auto",
                }}>
                    <thead>
                        <tr style={{ background: "#e6eef7" }}>
                            <th style={{ padding: "6px 10px", textAlign: "left" }}>標的代碼</th>
                        </tr>
                    </thead>
                    <tbody>
                        {symbols.length === 0 ? (
                            <tr>
                                <td style={{ padding: "8px 10px", color: "#888" }}>尚未新增任何標的物</td>
                            </tr>
                        ) : (
                            symbols.map((symbol, idx) => (
                                <tr key={symbol}>
                                    <td style={{ padding: "8px 10px" }}>{symbol}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default EtoroTradePanel;