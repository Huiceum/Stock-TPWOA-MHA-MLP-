import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
import pandas as pd
import yfinance as yf
from sklearn.preprocessing import StandardScaler
import math
from datetime import datetime, timedelta

# ==========================================
# 1. MHA-MLP 模型定義 (核心架構)
# ==========================================

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, n_heads):
        super(MultiHeadAttention, self).__init__()
        self.n_heads = n_heads
        self.d_model = d_model
        assert d_model % n_heads == 0
        self.d_k = d_model // n_heads
        
        self.w_q = nn.Linear(d_model, d_model)
        self.w_k = nn.Linear(d_model, d_model)
        self.w_v = nn.Linear(d_model, d_model)
        self.fc = nn.Linear(d_model, d_model)
        self.layer_norm = nn.LayerNorm(d_model)
        self.leaky_relu = nn.LeakyReLU(0.01)

    def forward(self, x):
        batch_size = x.size(0)
        residual = x
        q = self.w_q(x).view(batch_size, -1, self.n_heads, self.d_k).transpose(1, 2)
        k = self.w_k(x).view(batch_size, -1, self.n_heads, self.d_k).transpose(1, 2)
        v = self.w_v(x).view(batch_size, -1, self.n_heads, self.d_k).transpose(1, 2)
        
        scores = torch.matmul(q, k.transpose(-2, -1)) / math.sqrt(self.d_k)
        attn = torch.softmax(scores, dim=-1)
        output = torch.matmul(attn, v)
        output = output.transpose(1, 2).contiguous().view(batch_size, -1, self.d_model)
        output = self.fc(output)
        output = self.layer_norm(output + residual)
        return self.leaky_relu(output)

class MH_MLP_Model(nn.Module):
    def __init__(self, input_dim, n_heads, n_hidden_layers, output_dim=3):
        super(MH_MLP_Model, self).__init__()
        self.input_fc = nn.Linear(input_dim, 64)
        self.attention = MultiHeadAttention(d_model=64, n_heads=n_heads)
        
        layers = []
        current_dim = 64
        for i in range(n_hidden_layers):
            next_dim = max(current_dim // 2, 16)
            layers.append(nn.Linear(current_dim, next_dim))
            layers.append(nn.LeakyReLU(0.1))
            layers.append(nn.Dropout(0.2))
            current_dim = next_dim
            
        self.hidden_layers = nn.Sequential(*layers)
        self.output_layer = nn.Linear(current_dim, output_dim)
        
    def forward(self, x):
        x = x.unsqueeze(1) if x.dim() == 2 else x
        x = self.input_fc(x)
        x = self.attention(x)
        x = x.squeeze(1)
        x = self.hidden_layers(x)
        return self.output_layer(x)

# ==========================================
# 2. 數據獲取與特徵工程 (Yahoo Finance版)
# ==========================================

def fetch_and_prepare_data(symbol, period='2y'):
    print(f"正在從 Yahoo Finance 下載 {symbol} 的數據...")
    df = yf.download(symbol, period=period)
    if df.empty:
        raise ValueError("下載失敗，請檢查代碼是否正確")
    
    # 計算文獻提到的特徵 (Section 4.1)
    # 取基礎指標
    data = pd.DataFrame()
    data['Open'] = df['Open']
    data['High'] = df['High']
    data['Low'] = df['Low']
    data['Close'] = df['Close']
    data['Volume'] = df['Volume']
    
    # 計算移動平均線 (MA)
    for win in [5, 10, 20, 30]:
        data[f'MA_{win}'] = df['Close'].rolling(window=win).mean()
    
    # 定義標籤 (Target): 預測下一天的漲跌
    # 0: 跌 (<-0.5%), 1: 平 (-0.5% ~ 0.5%), 2: 漲 (>0.5%)
    # 這是為了符合論文中分類器預測 "Trend" 的目標
    data['Next_Close'] = data['Close'].shift(-1)
    data['Return'] = (data['Next_Close'] - data['Close']) / data['Close']
    
    def get_label(r):
        if r < -0.005: return 0
        if r > 0.005: return 2
        return 1
    
    data['Target'] = data['Return'].apply(get_label)
    
    # 特徵包括：Open, High, Low, Close, Volume, MA5, MA10, MA20, MA30
    features_cols = ['Open', 'High', 'Low', 'Close', 'Volume', 'MA_5', 'MA_10', 'MA_20', 'MA_30']
    
    # 去除包含 NaN 的行（主要是 MA 和 Shift 產生的）
    # 但保留最後一行（用於預測明天，它的 Target 為 NaN）
    latest_data = data.iloc[-1:].copy()
    train_data = data.dropna().copy()
    
    scaler = StandardScaler()
    train_features = scaler.fit_transform(train_data[features_cols])
    
    return train_features, train_data['Target'].values, scaler, features_cols, latest_data

# ==========================================
# 3. 實際預測與應用邏輯
# ==========================================

def train_final_model(X, y, n_heads=4, n_layers=2):
    """
    使用全量數據訓練最終模型
    """
    X_tensor = torch.tensor(X, dtype=torch.float32)
    y_tensor = torch.tensor(y, dtype=torch.long)
    
    model = MH_MLP_Model(input_dim=X.shape[1], n_heads=n_heads, n_hidden_layers=n_layers)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=0.001)
    
    print(f"正在使用 {len(X)} 筆歷史數據進行模型訓練...")
    model.train()
    for epoch in range(100): 
        optimizer.zero_grad()
        outputs = model(X_tensor)
        loss = criterion(outputs, y_tensor)
        loss.backward()
        optimizer.step()
    return model

def predict_trade_signal(symbol):
    """
    執行完整的下載、訓練、預測流程
    """
    try:
        # 1. 下載並處理數據
        X, y, scaler, cols, latest_row = fetch_and_prepare_data(symbol, period='2y')
        
        # 2. 訓練模型 (參數建議使用 TPWOA 優化後得到的結果)
        model = train_final_model(X, y, n_heads=4, n_layers=2)
        
        # 3. 準備最近一天的特徵 (用於預測明日)
        today_features = latest_row[cols]
        today_scaled = scaler.transform(today_features)
        today_tensor = torch.tensor(today_scaled, dtype=torch.float32)
        
        # 4. 進行推理
        model.eval()
        with torch.no_grad():
            logits = model(today_tensor)
            probs = torch.softmax(logits, dim=1)[0]
            pred_idx = torch.argmax(probs).item()
            
        labels_map = {0: "📉 下跌 (跌幅 > 0.5%)", 
                      1: "↔️ 盤整 (波幅 < 0.5%)", 
                      2: "📈 上漲 (漲幅 > 0.5%)"}
        
        print("\n" + "★"*20)
        print(f"【 實戰預測報告：{symbol} 】")
        print(f"分析日期 (最後一筆數據): {latest_row.index[0].strftime('%Y-%m-%d')}")
        print(f"明日趨勢預測: {labels_map[pred_idx]}")
        print(f"模型信心度: {probs[pred_idx].item()*100:.2f}%")
        print("-" * 25)
        print(f"各項機率分佈:")
        print(f"  - 看跌: {probs[0].item()*100:.2f}%")
        print(f"  - 看平: {probs[1].item()*100:.2f}%")
        print(f"  - 看漲: {probs[2].item()*100:.2f}%")
        print("★"*20)
        print("\n💡 實際應用建議：")
        print("1. 若信心度高於 60% 且預測為漲/跌，可考慮作為交易參考。")
        print("2. 務必搭配其他技術指標 (如 RSI, MACD) 進行二次確認。")
        
    except Exception as e:
        print(f"預測過程中發生錯誤: {e}")

if __name__ == "__main__":
    # 你可以更換成任何你想看的一支股票，例如 'TSLA' (特斯拉) 或 '2330.TW' (台積電)
    target_stock = 'AAPL' 
    predict_trade_signal(target_stock)
