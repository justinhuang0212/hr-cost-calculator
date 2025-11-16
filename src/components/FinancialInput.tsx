import { useState } from 'react';

interface FinancialInputProps {
    onSubmit: (data: {
        revenue: number;
        gross_profit?: number;
        gross_profit_margin?: number;
    }) => void;
    disabled: boolean;
}

type RevenuePeriod = 'monthly' | 'quarterly' | 'yearly';

export default function FinancialInput({ onSubmit, disabled }: FinancialInputProps) {
    const [revenue, setRevenue] = useState('');
    const [revenuePeriod, setRevenuePeriod] = useState<RevenuePeriod>('yearly');
    const [inputType, setInputType] = useState<'amount' | 'margin'>('margin');
    const [grossProfit, setGrossProfit] = useState('');
    const [grossProfitMargin, setGrossProfitMargin] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const formatNumber = (value: string) => {
        const num = value.replace(/,/g, '');
        if (isNaN(Number(num))) return value;
        return Number(num).toLocaleString();
    };

    const getPeriodLabel = () => {
        switch (revenuePeriod) {
            case 'monthly':
                return '月度';
            case 'quarterly':
                return '季度';
            case 'yearly':
                return '年度';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        const revenueNum = Number(revenue.replace(/,/g, ''));
        if (!revenueNum || revenueNum <= 0) {
            newErrors.revenue = '請輸入有效的營業額';
        }

        if (inputType === 'amount') {
            const grossProfitNum = Number(grossProfit.replace(/,/g, ''));
            if (!grossProfitNum || grossProfitNum <= 0) {
                newErrors.grossProfit = '請輸入有效的毛利金額';
            } else if (grossProfitNum > revenueNum) {
                newErrors.grossProfit = '毛利不能超過營業額';
            }
        } else {
            const marginNum = Number(grossProfitMargin);
            if (!marginNum || marginNum <= 0 || marginNum > 100) {
                newErrors.grossProfitMargin = '請輸入 0-100 之間的毛利率';
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        onSubmit({
            revenue: Number(revenue.replace(/,/g, '')),
            ...(inputType === 'amount'
                ? { gross_profit: Number(grossProfit.replace(/,/g, '')) }
                : { gross_profit_margin: Number(grossProfitMargin) }),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">步驟 2: 輸入財務資訊</h3>

            <div className="space-y-4">
                {/* 營業額週期選擇 */}
                <div>
                    <label className="block text-sm text-gray-600 mb-2">營業額週期</label>
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            type="button"
                            disabled={disabled}
                            onClick={() => setRevenuePeriod('monthly')}
                            className={`px-4 py-2 rounded-lg border-2 transition-all ${revenuePeriod === 'monthly'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            月度
                        </button>
                        <button
                            type="button"
                            disabled={disabled}
                            onClick={() => setRevenuePeriod('quarterly')}
                            className={`px-4 py-2 rounded-lg border-2 transition-all ${revenuePeriod === 'quarterly'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            季度
                        </button>
                        <button
                            type="button"
                            disabled={disabled}
                            onClick={() => setRevenuePeriod('yearly')}
                            className={`px-4 py-2 rounded-lg border-2 transition-all ${revenuePeriod === 'yearly'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            年度
                        </button>
                    </div>
                </div>

                {/* 營業額 */}
                <div>
                    <label htmlFor="revenue" className="block text-sm text-gray-600 mb-1">
                        {getPeriodLabel()}營業額
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-500">NT$</span>
                        <input
                            type="text"
                            id="revenue"
                            disabled={disabled}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                            placeholder={
                                revenuePeriod === 'monthly'
                                    ? '250,000'
                                    : revenuePeriod === 'quarterly'
                                        ? '750,000'
                                        : '3,000,000'
                            }
                            value={revenue}
                            onChange={(e) => setRevenue(formatNumber(e.target.value))}
                        />
                    </div>
                    {errors.revenue && <p className="mt-1 text-sm text-red-600">{errors.revenue}</p>}
                    <p className="mt-1 text-xs text-gray-500">
                        {revenuePeriod === 'monthly' && '請輸入單月營業額'}
                        {revenuePeriod === 'quarterly' && '請輸入單季（3個月）營業額'}
                        {revenuePeriod === 'yearly' && '請輸入全年（12個月）營業額'}
                    </p>
                </div>

                {/* 毛利輸入方式選擇 */}
                <div>
                    <label className="block text-sm text-gray-600 mb-2">毛利輸入方式</label>
                    <div className="flex gap-4">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                disabled={disabled}
                                checked={inputType === 'margin'}
                                onChange={() => setInputType('margin')}
                                className="mr-2 cursor-pointer"
                            />
                            <span className="text-sm">輸入毛利率（%）</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                disabled={disabled}
                                checked={inputType === 'amount'}
                                onChange={() => setInputType('amount')}
                                className="mr-2 cursor-pointer"
                            />
                            <span className="text-sm">輸入毛利金額</span>
                        </label>
                    </div>
                </div>

                {/* 毛利率或毛利金額 */}
                {inputType === 'margin' ? (
                    <div>
                        <label htmlFor="margin" className="block text-sm text-gray-600 mb-1">
                            毛利率
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                inputMode="decimal"
                                id="margin"
                                disabled={disabled}
                                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                                placeholder="70"
                                value={grossProfitMargin}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // 只允許數字和小數點
                                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                        setGrossProfitMargin(value);
                                    }
                                }}
                            />
                            <span className="absolute right-3 top-3 text-gray-500">%</span>
                        </div>
                        {errors.grossProfitMargin && (
                            <p className="mt-1 text-sm text-red-600">{errors.grossProfitMargin}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">毛利率 = (毛利 ÷ 營業額) × 100%</p>
                    </div>
                ) : (
                    <div>
                        <label htmlFor="grossProfit" className="block text-sm text-gray-600 mb-1">
                            {getPeriodLabel()}毛利金額
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-500">NT$</span>
                            <input
                                type="text"
                                id="grossProfit"
                                disabled={disabled}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                                placeholder={
                                    revenuePeriod === 'monthly'
                                        ? '175,000'
                                        : revenuePeriod === 'quarterly'
                                            ? '525,000'
                                            : '2,100,000'
                                }
                                value={grossProfit}
                                onChange={(e) => setGrossProfit(formatNumber(e.target.value))}
                            />
                        </div>
                        {errors.grossProfit && <p className="mt-1 text-sm text-red-600">{errors.grossProfit}</p>}
                        <p className="mt-1 text-xs text-gray-500">毛利 = 營業額 - 營業成本</p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={disabled}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                    開始計算
                </button>
            </div>
        </form>
    );
}
