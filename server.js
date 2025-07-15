const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/api/trade-signal', (req, res) => {
    // 這裡直接產生固定範例信號
    const signal = {
        symbol: "XAUUSD",
        direction: "long",
        leverage: 10,
        amount: 0.15,
        entry: 2420,
        tp: 120,
        sl: 60,
        reason: "MACD+RSI策略成立"
    };
    res.json(signal);
});

app.listen(PORT, () => {
    console.log(`Auto trading backend listening on port ${PORT}`);
});