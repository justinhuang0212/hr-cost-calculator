import { CalculationResult } from '../types';

interface RecommendationsProps {
    result: CalculationResult;
    onAdvancedAnalysis?: () => void;
}

export default function Recommendations({ result, onAdvancedAnalysis }: RecommendationsProps) {
    // 找出重點投資部門（比例最高的）
    const priorityDept = result.department_allocation.reduce((prev, current) =>
        prev.percentage > current.percentage ? prev : current
    );

    // 根據增長引擎提供建議
    const getGrowthEngineAdvice = () => {
        const engine = result.industry.primary_growth_engine;
        switch (engine) {
            case 'Media-led':
                return '透過媒體曝光和內容行銷獲客，建議優先投資品牌行銷團隊';
            case 'Sales-led':
                return '依賴業務團隊開發客戶，建議優先投資客戶經營團隊';
            case 'Product-led':
                return '以產品創新和品質為核心，建議優先投資產品技術團隊';
            case 'Ops-led':
                return '以營運效率和成本控制為核心，建議優先投資產品技術（營運）團隊';
            case 'Founder-led / Relationship-led':
                return '依賴創辦人或核心團隊的人脈關係，建議優先投資客戶經營團隊';
            case 'Channel-led / Network-led':
                return '建立經銷商網絡或通路體系，建議優先投資客戶經營團隊';
            default:
                return '建議根據產業特性調整人力配置';
        }
    };

    return (
        <div className="space-y-6">
            {/* 主要建議卡片 */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-start">
                    <svg
                        className="w-8 h-8 mr-4 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                    </svg>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">💡 核心建議</h3>
                        <p className="text-blue-100 mb-4">
                            您的產業是「{result.industry.primary_growth_engine}」，{getGrowthEngineAdvice()}
                        </p>
                        <div className="bg-white/20 rounded-lg p-4">
                            <p className="font-semibold mb-2">優先投資部門：{priorityDept.department}</p>
                            <p className="text-sm text-blue-100">
                                建議將 {priorityDept.percentage.toFixed(0)}% 的人事預算（約 NT${' '}
                                {Math.round(priorityDept.amount).toLocaleString()}）投入此部門
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 詳細建議列表 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 實用建議</h3>
                <div className="space-y-4">
                    {/* 建議 1：職員培養計畫 */}
                    <div className="flex items-start p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                            1
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">職員培養計畫</h4>
                            <p className="text-sm text-gray-700">
                                建議將 {priorityDept.department} 部門的人事預算 5-10% 用於員工培訓。建立「師徒制」或「輪調學習」機制，讓資深員工帶新人，提升整體團隊能力。
                            </p>
                        </div>
                    </div>

                    {/* 建議 2：主管訓練投資 */}
                    <div className="flex items-start p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                            2
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">主管領導力培訓</h4>
                            <p className="text-sm text-gray-700">
                                小公司的主管往往是「做事高手」但缺乏管理經驗。建議每季安排 1-2 次主管訓練（溝通、目標設定、績效管理），提升團隊管理效能。
                            </p>
                        </div>
                    </div>

                    {/* 建議 3：技能發展路徑 */}
                    <div className="flex items-start p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                            3
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">建立技能發展路徑</h4>
                            <p className="text-sm text-gray-700">
                                為員工規劃清晰的成長路徑（初階→中階→資深），搭配技能認證或內部升等制度。讓員工看到未來，降低流動率。
                            </p>
                        </div>
                    </div>

                    {/* 建議 4：薪資結構 */}
                    <div className="flex items-start p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                            4
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">三層薪資結構設計</h4>
                            <p className="text-sm text-gray-700 mb-3">
                                建議採用「基礎薪資 + 績效薪資 + 獎金」的三層結構，兼顧穩定性與激勵效果：
                            </p>
                            <ul className="text-sm text-gray-700 space-y-2 ml-4">
                                <li className="flex items-start">
                                    <span className="text-orange-600 mr-2">•</span>
                                    <div>
                                        <strong>基礎薪資 50%</strong>（全員適用）<br />
                                        <span className="text-gray-600">保障員工基本生活，提供穩定感</span>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-orange-600 mr-2">•</span>
                                    <div>
                                        <strong>績效薪資 20%</strong>（業務、產品服務部門）<br />
                                        <span className="text-gray-600">每月達標獎金，即時激勵直接創造價值的團隊</span>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-orange-600 mr-2">•</span>
                                    <div>
                                        <strong>季獎金 30%</strong>（全員適用）<br />
                                        <span className="text-gray-600">每季依公司獲利與個人貢獻發放，讓全員共享成果</span>
                                    </div>
                                </li>
                            </ul>
                            <p className="text-xs text-gray-500 mt-3 italic">
                                💡 行政、行銷等支援部門：基礎薪資 50% + 季獎金 30% = 80%，其餘 20% 可作為調薪空間
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 進階分析 CTA */}
            {onAdvancedAnalysis && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-lg p-6 border-2 border-indigo-200">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                🔍 想知道資源有沒有放對地方？
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                進入進階分析，輸入目前的人力配置，系統會告訴您：
                            </p>
                            <ul className="text-sm text-gray-600 space-y-1 mb-4">
                                <li className="flex items-center">
                                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    資源配置健康度分數
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    同行薪資對比
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    年終獎金建議
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    具體調整建議
                                </li>
                            </ul>
                        </div>
                        <button
                            onClick={onAdvancedAnalysis}
                            className="ml-6 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                        >
                            進入進階分析 →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
