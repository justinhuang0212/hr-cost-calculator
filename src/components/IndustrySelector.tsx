import { useState } from 'react';
import { Industry, IndustryCategory } from '../types';

interface IndustrySelectorProps {
    categories: IndustryCategory[];
    industries: Industry[];
    selectedIndustry: Industry | null;
    onSelect: (industry: Industry) => void;
}

export default function IndustrySelector({
    categories,
    industries,
    selectedIndustry,
    onSelect,
}: IndustrySelectorProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategory(categoryId);
        // 清除已選擇的產業
        if (selectedIndustry) {
            const category = categories.find((c) => c.id === categoryId);
            if (category && !category.industries.includes(selectedIndustry.id)) {
                // 如果當前選擇的產業不在新分類中，清除選擇
                onSelect(null as any);
            }
        }
    };

    const filteredIndustries = selectedCategory
        ? industries.filter((industry) => {
            const category = categories.find((c) => c.id === selectedCategory);
            return category?.industries.includes(industry.id);
        })
        : [];

    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
                步驟 1: 選擇您的產業
            </label>

            {/* 第一層：產業大分類 */}
            <div className="mb-4">
                <label htmlFor="category" className="block text-xs text-gray-600 mb-2">
                    產業大分類
                </label>
                <select
                    id="category"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                >
                    <option value="">請先選擇產業大分類...</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* 第二層：具體產業 */}
            {selectedCategory && (
                <div className="mb-4 animate-fadeIn">
                    <label htmlFor="industry" className="block text-xs text-gray-600 mb-2">
                        具體產業
                    </label>
                    <select
                        id="industry"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        value={selectedIndustry?.id || ''}
                        onChange={(e) => {
                            const industry = industries.find((i) => i.id === Number(e.target.value));
                            if (industry) onSelect(industry);
                        }}
                    >
                        <option value="">請選擇具體產業...</option>
                        {filteredIndustries.map((industry) => (
                            <option key={industry.id} value={industry.id}>
                                {industry.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* 顯示選擇的產業資訊 */}
            {selectedIndustry && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200 animate-fadeIn">
                    <div className="flex items-start">
                        <svg
                            className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0"
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
                        <div className="text-sm">
                            <p className="text-gray-700">
                                <span className="font-medium">已選擇：</span>
                                {selectedIndustry.name}
                            </p>
                            <p className="text-gray-600 mt-1">
                                <span className="font-medium">增長引擎：</span>
                                {selectedIndustry.primary_growth_engine}
                                {selectedIndustry.secondary_growth_engine &&
                                    ` / ${selectedIndustry.secondary_growth_engine}`}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
