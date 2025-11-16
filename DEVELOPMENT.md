# 開發指南

## 🎯 如何繼續開發這個模組

### 方法 1：直接告訴 Kiro 你想要的功能

最簡單的方式！直接在聊天中說：

```
「我想要在人事成本計算器加入圓餅圖」
「幫我在人事成本計算器加入匯出 PDF 功能」
「我想要修改餐飲業的人事成本比例」
```

Kiro 會自動找到這個專案並進行修改。

### 方法 2：使用 Spec 任務清單

1. **打開任務清單**
   - 在 Kiro 中打開 `.kiro/specs/hr-cost-calculator/tasks.md`
   - 查看所有待完成的任務

2. **點擊「Start task」**
   - 在任務旁邊點擊「Start task」按鈕
   - Kiro 會自動執行該任務

3. **或者直接告訴 Kiro**
   ```
   「執行人事成本計算器的任務 10：實作部門分配圖表」
   ```

### 方法 3：使用 #Folder 引用

在聊天中使用 `#Folder` 來引用這個專案：

```
「#Folder hr-cost-calculator 我想要加入新功能...」
```

這樣 Kiro 會自動載入整個專案的上下文。

## 📝 常見開發任務

### 任務 1：加入圖表視覺化

**告訴 Kiro：**
```
「在人事成本計算器加入圓餅圖和長條圖，顯示部門分配」
```

**或者自己做：**
1. 安裝 Chart.js: `npm install chart.js react-chartjs-2`
2. 建立 `src/components/DepartmentChart.tsx`
3. 在 `CalculationResult.tsx` 中引入使用

### 任務 2：加入實用建議

**告訴 Kiro：**
```
「在人事成本計算器加入實用建議區塊，根據增長引擎提供招募建議」
```

**或者自己做：**
1. 建立 `src/components/Recommendations.tsx`
2. 建立 `src/services/recommendationEngine.ts`
3. 在 `CalculationResult.tsx` 中顯示建議

### 任務 3：加入歷史記錄

**告訴 Kiro：**
```
「在人事成本計算器加入歷史記錄功能，使用 localStorage 儲存」
```

**或者自己做：**
1. 建立 `src/services/storage.ts`
2. 建立 `src/components/CalculationHistory.tsx`
3. 在 `App.tsx` 中整合

### 任務 4：加入匯出功能

**告訴 Kiro：**
```
「在人事成本計算器加入匯出 PDF 功能」
```

**或者自己做：**
1. 安裝套件: `npm install jspdf html2canvas`
2. 建立 `src/services/export.ts`
3. 在結果頁面加入匯出按鈕

### 任務 5：優化手機版 UI

**告訴 Kiro：**
```
「優化人事成本計算器的手機版介面」
```

## 🔍 如何找到這個專案

### 在 Kiro 中重新開始開發：

**方法 1：直接提及專案名稱**
```
「我想繼續開發人事成本計算器」
「幫我修改 hr-cost-calculator 的 XXX 功能」
```

**方法 2：使用 #Folder**
```
「#Folder hr-cost-calculator 我想要...」
```

**方法 3：打開任務清單**
- 在 Kiro 中打開 `.kiro/specs/hr-cost-calculator/tasks.md`
- 點擊任務旁的「Start task」按鈕

**方法 4：使用 #File 引用特定檔案**
```
「#File hr-cost-calculator/src/App.tsx 我想要修改...」
```

## 📚 重要檔案位置

### 規格文件（設計和需求）
- `.kiro/specs/hr-cost-calculator/requirements.md` - 需求文件
- `.kiro/specs/hr-cost-calculator/design.md` - 設計文件
- `.kiro/specs/hr-cost-calculator/tasks.md` - 任務清單
- `.kiro/specs/hr-cost-calculator/industries-data.json` - 原始產業資料

### 程式碼
- `hr-cost-calculator/src/` - 所有原始碼
- `hr-cost-calculator/src/data/industries.json` - 產業資料（用於計算）
- `hr-cost-calculator/src/services/calculator.ts` - 核心計算邏輯

## 💡 開發技巧

### 1. 熱更新（Hot Reload）

開發伺服器啟動後，修改任何檔案都會自動重新載入，無需手動刷新瀏覽器。

### 2. TypeScript 型別檢查

如果修改了型別定義，記得同步更新：
- `src/types/index.ts` - 型別定義
- 使用該型別的所有元件和服務

### 3. 測試計算邏輯

可以在瀏覽器 Console 中測試：

```javascript
// 匯入計算函式
import { calculate } from './services/calculator';

// 測試計算
const result = calculate(
  { industry_id: 1, revenue: 3000000, gross_profit_margin: 70 },
  industries[0]
);
console.log(result);
```

### 4. 調整樣式

使用 Tailwind CSS 類別直接在元件中調整樣式：

```tsx
<div className="bg-blue-500 text-white p-4 rounded-lg">
  內容
</div>
```

## 🚀 部署到線上

### 部署到 Vercel（推薦）

1. 將程式碼推送到 GitHub
2. 在 Vercel 連接 repository
3. 設定建置指令：
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. 自動部署完成

### 部署到 Netlify

1. 將程式碼推送到 GitHub
2. 在 Netlify 連接 repository
3. 設定建置指令：
   - Build Command: `npm run build`
   - Publish Directory: `dist`
4. 自動部署完成

## 📞 需要幫助時

### 告訴 Kiro 你遇到的問題

```
「人事成本計算器出現錯誤：[錯誤訊息]」
「人事成本計算器的計算結果不正確」
「我想要修改人事成本計算器的 XXX 功能」
```

### 或者查看規格文件

所有的設計決策和計算邏輯都記錄在：
- `.kiro/specs/hr-cost-calculator/design.md`

## 🎯 下一步建議

根據任務清單，建議按照以下順序開發：

1. **任務 10：實作部門分配圖表** (P0)
   - 加入圓餅圖和長條圖
   - 讓結果更視覺化

2. **任務 11：實作建議區塊** (P1)
   - 根據增長引擎提供招募建議
   - 提供實用的行動建議

3. **任務 12：樣式優化與響應式設計** (P1)
   - 優化手機版介面
   - 改善整體視覺效果

4. **任務 15：匯出功能** (P2)
   - 匯出為 PDF
   - 分享連結功能

5. **任務 16：本地儲存歷史記錄** (P2)
   - 使用 localStorage
   - 查看和比較歷史計算

---

**祝開發順利！有任何問題隨時問 Kiro！** 🚀
