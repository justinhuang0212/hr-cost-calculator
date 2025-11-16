import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CalculationResult as Result } from '../types';

interface CalculationResultProps {
    result: Result;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']; // 藍、綠、橙、紫

export default function CalculationResult({ result }: CalculationResultProps) {
    const formatCurrency = (amount: number) => {
        return `NT$ ${Math.round(amount).toLocaleString()}`;
    };

    const formatPercent = (percent: number) => {
        return `${percent.toFixed(1)}%`;
    };

    // 準備圓餅圖資料
    const chartData = result.department_allocation.map((dept) => ({
        name: dept.department,
        value: dept.percentage,
        amount: dept.amount,
    }));

    // 找出重點投資部門（比例最高的）
    const priorityDept = result.department_allocation.reduce((prev, current) =>
        prev.percentage > current.percentage ? prev : current
    );

    return (
        <div className="space-y-6">
            {/* 計算結果摘要 - 加大顯示 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-8 border border-blue-100">
                <div className="text-center mb-6">
                    <p className="text-sm text-gray-600 mb-2">💰 建議人事成本</p>
                    <p className="text-5xl font-bold text-blue-600 mb-2">
                        {formatCurrency(result.recommended_hr_cost)}
                    </p>
                    <p className="text-sm text-gray-600">
                        每月預算 / 佔毛利 {formatPercent(result.hr_cost_ratio)} / 佔營業額{' '}
                        {formatPercent(result.hr_cost_to_revenue_ratio)}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 text-center">
                        <p className="text-xs text-gray-500 mb-1">年度營業額</p>
                        <p className="text-lg font-semibold text-gray-900">
                            {formatCurrency(result.input.revenue * 12)}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                        <p className="text-xs text-gray-500 mb-1">年度毛利</p>
                        <p className="text-lg font-semibold text-gray-900">
                            {formatCurrency(result.gross_profit * 12)}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                        <p className="text-xs text-gray-500 mb-1">年度人事成本</p>
                        <p className="text-lg font-semibold text-gray-900">
                            {formatCurrency(result.recommended_hr_cost * 12)}
                        </p>
                    </div>
                </div>
            </div>

            {/* 部門分配 - 圓餅圖 + 列表 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">部門分配建議</h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 圓餅圖 */}
                    <div className="flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name} ${value.toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {chartData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number, name: string, props: any) => [
                                        `${formatCurrency(props.payload.amount)} (${value.toFixed(1)}%)`,
                                        name,
                                    ]}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* 部門列表 */}
                    <div className="space-y-4">
                        {result.department_allocation.map((dept, index) => (
                            <div
                                key={dept.department}
                                className={`p-4 rounded-lg border-2 ${dept.department === priorityDept.department
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        <div
                                            className="w-4 h-4 rounded-full mr-2"
                                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                        />
                                        <span className="font-semibold text-gray-900">{dept.department}</span>
                                        {dept.department === priorityDept.department && (
                                            <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                                                重點投資
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">
                                        {formatPercent(dept.percentage)}
                                    </span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(dept.amount)}</p>
                                <p className="text-xs text-gray-500 mt-1">每月預算</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 產業資訊和說明 */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-start">
                    <svg
                        className="w-6 h-6 text-blue-600 mt-0.5 mr-3 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <div className="flex-1">
                        <p className="text-sm text-gray-700 mb-2">
                            <span className="font-semibold">產業：</span>
                            {result.industry.name}
                        </p>
                        <p className="text-sm text-gray-700 mb-2">
                            <span className="font-semibold">增長引擎：</span>
                            {result.industry.primary_growth_engine}
                            {result.industry.secondary_growth_engine &&
                                ` / ${result.industry.secondary_growth_engine}`}
                        </p>
                        <p className="text-sm text-gray-700 mb-2">
                            <span className="font-semibold">建議：</span>
                            您的產業是「{result.industry.primary_growth_engine}」，建議優先投資
                            {priorityDept.department}部門（{formatPercent(priorityDept.percentage)}）
                        </p>
                        <p className="text-xs text-gray-500 mt-3">
                            * 人事成本包含薪資、勞健保、退休金提撥、年終獎金等所有人力相關支出
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
