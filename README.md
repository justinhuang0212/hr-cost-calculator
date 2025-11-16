# 人事成本計算器

專為 50 人以下中小企業設計的人事成本評估工具

## 📋 專案狀態

**目前進度：** MVP 完成（可正常使用）

**已完成功能：**
- ✅ 產業選擇（兩層分類，30個產業）
- ✅ 財務資訊輸入（支援月度/季度/年度）
- ✅ 人事成本計算
- ✅ 部門分配建議
- ✅ 視覺化結果展示

**待開發功能：**
- ⏳ 圖表視覺化（圓餅圖、長條圖）
- ⏳ 實用建議區塊
- ⏳ 匯出功能（PDF/圖片）
- ⏳ 歷史記錄（localStorage）
- ⏳ LINE Login 整合（Phase 2）

## 🚀 快速開始

### 啟動開發伺服器

```bash
cd hr-cost-calculator
npm run dev
```

然後打開瀏覽器訪問：http://localhost:5173/

### 建置生產版本

```bash
npm run build
npm run preview
```

## 📁 專案結構

```
hr-cost-calculator/
├── src/
│   ├── components/              # React 元件
│   │   ├── IndustrySelector.tsx    # 產業選擇器（兩層）
│   │   ├── FinancialInput.tsx      # 財務輸入表單
│   │   └── CalculationResult.tsx   # 結果展示
│   ├── services/
│   │   └── calculator.ts           # 計算邏輯
│   ├── types/
│   │   └── index.ts                # TypeScript 型別定義
│   ├── data/
│   │   └── industries.json         # 產業資料（30個）
│   ├── App.tsx                     # 主應用
│   ├── main.tsx                    # 入口
│   └── index.css                   # 全域樣式
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🔧 如何繼續開發

### 1. 修改產業資料

編輯 `src/data/industries.json`：

```json
{
  "categories": [...],  // 產業大分類
  "industries": [       // 具體產業
    {
      "id": 1,
      "name": "產業名稱",
      "primary_growth_engine": "Ops-led",
      "secondary_growth_engine": "Media-led",
      "hr_cost_ratio_min": 40,
      "hr_cost_ratio_max": 50,
      "department_allocation": {
        "客戶經營": 20,
        "產品技術": 35,
        "品牌行銷": 25,
        "行政支援": 20
      }
    }
  ]
}
```

### 2. 修改計算邏輯

編輯 `src/services/calculator.ts`：

```typescript
// 修改人事成本計算公式
export function calculateHRCost(grossProfit: number, industry: Industry): number {
  // 在這裡修改計算邏輯
}

// 修改部門分配計算
export function calculateDepartmentAllocation(...) {
  // 在這裡修改分配邏輯
}
```

### 3. 新增 UI 元件

在 `src/components/` 資料夾中建立新元件：

```typescript
// 例如：新增圖表元件
// src/components/DepartmentChart.tsx
import { CalculationResult } from '../types';

export default function DepartmentChart({ result }: { result: CalculationResult }) {
  // 實作圖表邏輯
  return <div>圖表內容</div>;
}
```

然後在 `App.tsx` 中引入使用。

### 4. 修改樣式

- 全域樣式：編輯 `src/index.css`
- Tailwind 配置：編輯 `tailwind.config.js`
- 元件樣式：直接在元件中使用 Tailwind CSS 類別

### 5. 新增功能建議

#### 加入圓餅圖（使用 Chart.js）

```bash
npm install chart.js react-chartjs-2
```

```typescript
// src/components/DepartmentPieChart.tsx
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DepartmentPieChart({ data }) {
  const chartData = {
    labels: ['客戶經營', '產品技術', '品牌行銷', '行政支援'],
    datasets: [{
      data: [/* 部門金額 */],
      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#6B7280'],
    }]
  };

  return <Pie data={chartData} />;
}
```

#### 加入 localStorage 歷史記錄

```typescript
// src/services/storage.ts
export function saveCalculation(result: CalculationResult) {
  const history = JSON.parse(localStorage.getItem('calculations') || '[]');
  history.push({ ...result, timestamp: Date.now() });
  localStorage.setItem('calculations', JSON.stringify(history));
}

export function getCalculationHistory(): CalculationResult[] {
  return JSON.parse(localStorage.getItem('calculations') || '[]');
}
```

#### 加入匯出 PDF 功能

```bash
npm install jspdf html2canvas
```

```typescript
// src/services/export.ts
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportToPDF(elementId: string) {
  const element = document.getElementById(elementId);
  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF();
  pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
  pdf.save('人事成本計算結果.pdf');
}
```

## 📚 相關文件

- **需求文件**: `.kiro/specs/hr-cost-calculator/requirements.md`
- **設計文件**: `.kiro/specs/hr-cost-calculator/design.md`
- **任務清單**: `.kiro/specs/hr-cost-calculator/tasks.md`

## 🐛 常見問題

### Q: 如何修改人事成本佔毛利的上限？

A: 編輯 `src/services/calculator.ts` 中的 `calculateHRCost` 函式，修改這一行：
```typescript
const maxHRCost = grossProfit * 0.55; // 改成你想要的比例
```

### Q: 如何新增產業分類？

A: 編輯 `src/data/industries.json`：
1. 在 `categories` 陣列中新增分類
2. 在 `industries` 陣列中新增具體產業
3. 確保分類的 `industries` 欄位包含正確的產業 ID

### Q: 如何修改部門名稱？

A: 需要同時修改：
1. `src/types/index.ts` - 型別定義
2. `src/data/industries.json` - 所有產業的 department_allocation
3. `src/services/calculator.ts` - 計算邏輯中的部門陣列

## 🔗 技術棧

- **框架**: React 18 + TypeScript
- **建置工具**: Vite
- **樣式**: Tailwind CSS
- **狀態管理**: React Hooks (useState)

## 📞 需要協助？

如果您需要繼續開發或有任何問題，可以：

1. **查看規格文件** - 所有設計和需求都在 `.kiro/specs/hr-cost-calculator/` 資料夾中
2. **查看任務清單** - `tasks.md` 列出了所有待完成的功能
3. **直接修改程式碼** - 所有程式碼都有清楚的註解和型別定義

## 🎯 下次開發建議

優先順序：
1. **加入圖表視覺化** - 讓結果更直觀
2. **加入實用建議** - 根據產業和增長引擎提供招募建議
3. **加入歷史記錄** - 讓使用者可以比較不同的計算結果
4. **優化手機版 UI** - 改善小螢幕的使用體驗
5. **加入匯出功能** - 讓使用者可以儲存和分享結果

---

**最後更新**: 2025-11-10
**版本**: v0.1.0 (MVP)
