import React, { useState } from 'react';

function TradeSignalFetcher() {
    const [signal, setSignal] = useState(null);

    const fetchSignal = async () => {
        const res = await fetch('http://localhost:3000/api/trade-signal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
            const data = await res.json();
            setSignal(data);
        }
    };

    return (
        <div>
            <button onClick={fetchSignal}>取得交易信號</button>
            {signal && (
                <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "16px" }}>
                    <h3>交易建議</h3>
                    <p>標的：{signal.symbol}</p>
                    <p>方向：{signal.direction === "long" ? "做多" : "做空"}</p>
                    <p>槓桿：{signal.leverage}</p>
                    <p>數量：{signal.amount}</p>
                    <p>停利：{signal.tp}</p>
                    <p>停損：{signal.sl}</p>
                    <p>理由：{signal.reason}</p>
                    <a href={`https://www.etoro.com/trade/${signal.symbol}?type=${signal.direction}&amount=${signal.amount}&leverage=${signal.leverage}&sl=${signal.sl}&tp=${signal.tp}`} target="_blank" rel="noopener noreferrer">一鍵跳轉 eToro 下單</a>
                </div>
            )}
        </div>
    );
}

export default TradeSignalFetcher;