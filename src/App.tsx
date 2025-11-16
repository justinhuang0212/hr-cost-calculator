import { useState } from 'react';
import IndustrySelector from './components/IndustrySelector';
import FinancialInput from './components/FinancialInput';
import CalculationResult from './components/CalculationResult';
import Recommendations from './components/Recommendations';
import { calculate } from './services/calculator';
import industriesData from './data/industries.json';
import type { Industry, IndustryCategory, CalculationResult as Result } from './types';

function App() {
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const industries = industriesData.industries as Industry[];
  const categories = industriesData.categories as IndustryCategory[];

  const handleCalculate = (data: {
    revenue: number;
    gross_profit?: number;
    gross_profit_margin?: number;
  }) => {
    if (!selectedIndustry) return;

    const calculationResult = calculate(
      {
        industry_id: selectedIndustry.id,
        ...data,
      },
      selectedIndustry
    );

    setResult(calculationResult);
  };

  const handleReset = () => {
    setSelectedIndustry(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">人事成本計算器</h1>
          <p className="text-gray-600">專為 50 人以下中小企業設計的人事成本評估工具</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {/* Industry Selector */}
          <IndustrySelector
            categories={categories}
            industries={industries}
            selectedIndustry={selectedIndustry}
            onSelect={setSelectedIndustry}
          />

          {/* Financial Input */}
          {selectedIndustry && (
            <FinancialInput onSubmit={handleCalculate} disabled={false} />
          )}

          {/* Calculation Result */}
          {result && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">計算結果</h2>
                <button
                  onClick={handleReset}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  重新計算
                </button>
              </div>
              <CalculationResult result={result} />

              {/* Recommendations */}
              <div className="mt-8">
                <Recommendations
                  result={result}
                  onAdvancedAnalysis={() => alert('進階分析功能即將推出！')}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>根據台灣勞動法規和產業特性計算</p>
        </div>
      </div>
    </div>
  );
}

export default App;
