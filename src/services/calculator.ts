import type { Industry, UserInput, CalculationResult, Department } from '../types';

/**
 * 計算毛利
 */
export function calculateGrossProfit(input: UserInput): number {
    if (input.gross_profit) {
        return input.gross_profit;
    }
    if (input.gross_profit_margin) {
        return input.revenue * (input.gross_profit_margin / 100);
    }
    throw new Error('必須提供毛利或毛利率');
}

/**
 * 計算毛利率
 */
export function calculateGrossProfitMargin(revenue: number, grossProfit: number): number {
    return (grossProfit / revenue) * 100;
}

/**
 * 計算建議人事成本
 */
export function calculateHRCost(grossProfit: number, industry: Industry): number {
    // 使用產業的建議比例中間值
    const ratio = (industry.hr_cost_ratio_min + industry.hr_cost_ratio_max) / 2;
    const hrCost = grossProfit * (ratio / 100);

    // 確保不超過 55%
    const maxHRCost = grossProfit * 0.55;
    return Math.min(hrCost, maxHRCost);
}

/**
 * 計算部門分配
 */
export function calculateDepartmentAllocation(
    totalHRCost: number,
    industry: Industry
): CalculationResult['department_allocation'] {
    const allocation = industry.department_allocation;
    const departments: Department[] = ['客戶經營', '產品技術', '品牌行銷', '行政支援'];

    return departments.map((dept) => ({
        department: dept,
        amount: totalHRCost * (allocation[dept] / 100),
        percentage: allocation[dept],
    }));
}

/**
 * 執行完整計算
 */
export function calculate(input: UserInput, industry: Industry): CalculationResult {
    // 計算毛利
    const grossProfit = calculateGrossProfit(input);
    const grossProfitMargin = calculateGrossProfitMargin(input.revenue, grossProfit);

    // 計算人事成本
    const recommendedHRCost = calculateHRCost(grossProfit, industry);
    const hrCostRatio = (recommendedHRCost / grossProfit) * 100;
    const hrCostToRevenueRatio = (recommendedHRCost / input.revenue) * 100;

    // 計算部門分配
    const departmentAllocation = calculateDepartmentAllocation(recommendedHRCost, industry);

    return {
        input,
        industry,
        gross_profit: grossProfit,
        gross_profit_margin: grossProfitMargin,
        recommended_hr_cost: recommendedHRCost,
        hr_cost_ratio: hrCostRatio,
        hr_cost_to_revenue_ratio: hrCostToRevenueRatio,
        department_allocation: departmentAllocation,
    };
}


/**
 * 計算資源配置健康度分數
 * @param currentAllocation 目前各部門的實際比例
 * @param recommendedAllocation 建議的各部門比例
 * @returns 健康度分數 (0-100)
 */
export function calculateHealthScore(
    currentAllocation: { [dept: string]: number },
    recommendedAllocation: { [dept: string]: number }
): number {
    let totalGap = 0;
    const departments = Object.keys(recommendedAllocation);

    departments.forEach((dept) => {
        const current = currentAllocation[dept] || 0;
        const recommended = recommendedAllocation[dept];
        const gap = Math.abs(current - recommended);
        totalGap += gap;
    });

    // 總差距越小，分數越高
    // 假設總差距 0% = 100 分，總差距 100% = 0 分
    const score = Math.max(0, 100 - totalGap);
    return Math.round(score);
}

/**
 * 計算年終獎金建議
 * @param annualProfit 年度獲利
 * @param totalHRCost 月度人事成本
 * @returns 年終獎金建議
 */
export function calculateYearEndBonus(
    annualProfit: number,
    totalHRCost: number
): {
    recommended_total: number;
    recommended_months: number;
    per_person_average: number;
} {
    // 年終獎金建議為年度人事成本的 8-15%
    let bonusRatio = 0.1; // 預設 10%

    // 根據獲利狀況調整
    const annualHRCost = totalHRCost * 12;
    const profitRatio = annualProfit / annualHRCost;

    if (profitRatio > 0.3) {
        bonusRatio = 0.15; // 獲利好，發 15%
    } else if (profitRatio > 0.15) {
        bonusRatio = 0.12; // 獲利中等，發 12%
    } else if (profitRatio > 0) {
        bonusRatio = 0.08; // 獲利少，發 8%
    } else {
        bonusRatio = 0; // 虧損，不發
    }

    const recommendedTotal = annualHRCost * bonusRatio;
    const recommendedMonths = bonusRatio * 12;

    // 假設 10 人，計算平均每人
    const perPersonAverage = recommendedTotal / 10;

    return {
        recommended_total: recommendedTotal,
        recommended_months: recommendedMonths,
        per_person_average: perPersonAverage,
    };
}

/**
 * 產生調整建議
 * @param currentAllocation 目前各部門的實際比例和金額
 * @param recommendedAllocation 建議的各部門比例和金額
 * @returns 調整建議列表
 */
export function generateAdjustmentSuggestions(
    currentAllocation: {
        department: string;
        percentage: number;
        amount: number;
        headcount: number;
    }[],
    recommendedAllocation: {
        department: string;
        percentage: number;
        amount: number;
    }[]
): {
    priority: number;
    department: string;
    action: 'increase' | 'decrease' | 'maintain';
    gap_percentage: number;
    gap_amount: number;
    headcount_suggestion: string;
    reason: string;
}[] {
    const suggestions: {
        priority: number;
        department: string;
        action: 'increase' | 'decrease' | 'maintain';
        gap_percentage: number;
        gap_amount: number;
        headcount_suggestion: string;
        reason: string;
    }[] = [];

    currentAllocation.forEach((current) => {
        const recommended = recommendedAllocation.find((r) => r.department === current.department);
        if (!recommended) return;

        const gapPercentage = current.percentage - recommended.percentage;
        const gapAmount = current.amount - recommended.amount;

        let action: 'increase' | 'decrease' | 'maintain' = 'maintain';
        let reason = '';
        let headcountSuggestion = '';

        if (Math.abs(gapPercentage) < 5) {
            // 差距小於 5%，配置合理
            action = 'maintain';
            reason = '配置合理，維持現狀';
            headcountSuggestion = `維持 ${current.headcount} 人`;
        } else if (gapPercentage > 10) {
            // 資源過多
            action = 'decrease';
            reason = '資源過多，建議調整到其他部門';
            const reduceHeadcount = Math.ceil(Math.abs(gapAmount) / (current.amount / current.headcount));
            headcountSuggestion = `建議減少 ${reduceHeadcount} 人`;
        } else if (gapPercentage < -10) {
            // 資源不足
            action = 'increase';
            reason = '資源不足，建議增加投入';
            const avgSalary = current.headcount > 0 ? current.amount / current.headcount : 30000;
            const addHeadcount = Math.ceil(Math.abs(gapAmount) / avgSalary);
            headcountSuggestion = `建議增加 ${addHeadcount} 人`;
        }

        suggestions.push({
            priority: Math.abs(gapPercentage) > 10 ? 1 : 2,
            department: current.department,
            action,
            gap_percentage: gapPercentage,
            gap_amount: gapAmount,
            headcount_suggestion: headcountSuggestion,
            reason,
        });
    });

    // 按優先順序和差距大小排序
    return suggestions.sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority;
        return Math.abs(b.gap_percentage) - Math.abs(a.gap_percentage);
    });
}
