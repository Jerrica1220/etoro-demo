// ... 省略其他部分

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

// ... 在return區域內：

{/* 新增標的 */ }
<div style={{ minWidth: 210, maxWidth: 250, flex: 1 }}>
    <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 15.5 }}>新增標的物</div>
    <div style={{ display: "flex", gap: 5, marginBottom: 4 }}>
        <input ... />
        <button style={btnStyleMain} onClick={handleAddSymbol}>新增</button>
    </div>
    {/* ...略 */}
</div>

{/* 虛擬下單 */ }
<div style={{ minWidth: 260, maxWidth: 320, flex: 1 }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontWeight: 600, fontSize: 15.5 }}>虛擬下單</span>
        <button style={btnStyleMain} onClick={handleVirtualOrder}>模擬下單</button>
    </div>
    {/* ...略 */}
</div>

{/* 快速回測 */ }
<div style={{ minWidth: 180, maxWidth: 230, flex: 1 }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontWeight: 600, fontSize: 15.5 }}>快速回測</span>
        <button style={btnStyleMain} onClick={handleBacktest}>回測</button>
    </div>
    {/* ...略 */}
</div>

{/* 目前持倉（表格寬度收窄、標題字體統一） */ }
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
        {/* ...thead & tbody同原本，可依需求再縮減padding */}
    </table>
</div>