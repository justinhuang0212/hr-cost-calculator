/**
 * 輸入驗證服務
 * 提供各種輸入資料的驗證函數
 */

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

/**
 * 驗證營業額
 */
export function validateRevenue(revenue: number): ValidationResult {
    if (revenue <= 0) {
        return {
            isValid: false,
            error: '營業額必須大於 0',
        };
    }

    if (revenue > 1000000000) {
        // 10 億
        return {
            isValid: false,
            error: '營業額超過合理範圍（最大 10 億元）',
        };
    }

    return { isValid: true };
}

/**
 * 驗證毛利金額
 */
export function validateGrossProfit(
    grossProfit: number,
    revenue: number
): ValidationResult {
    if (grossProfit <= 0) {
        return {
            isValid: false,
            error: '毛利必須大於 0',
        };
    }

    if (grossProfit > revenue) {
        return {
            isValid: false,
            error: '毛利不能超過營業額',
        };
    }

    return { isValid: true };
}

/**
 * 驗證毛利率
 */
export function validateGrossProfitMargin(margin: number): ValidationResult {
    if (margin <= 0) {
        return {
            isValid: false,
            error: '毛利率必須大於 0%',
        };
    }

    if (margin > 100) {
        return {
            isValid: false,
            error: '毛利率不能超過 100%',
        };
    }

    return { isValid: true };
}

/**
 * 驗證產業選擇
 */
export function validateIndustry(industryId: number | null): ValidationResult {
    if (!industryId) {
        return {
            isValid: false,
            error: '請選擇產業',
        };
    }

    return { isValid: true };
}

/**
 * 驗證完整的基礎輸入
 */
export function validateBasicInput(input: {
    industry_id: number | null;
    revenue: number;
    gross_profit?: number;
    gross_profit_margin?: number;
}): ValidationResult {
    // 驗證產業
    const industryValidation = validateIndustry(input.industry_id);
    if (!industryValidation.isValid) {
        return industryValidation;
    }

    // 驗證營業額
    const revenueValidation = validateRevenue(input.revenue);
    if (!revenueValidation.isValid) {
        return revenueValidation;
    }

    // 驗證毛利或毛利率（至少要有一個）
    if (!input.gross_profit && !input.gross_profit_margin) {
        return {
            isValid: false,
            error: '請輸入毛利金額或毛利率',
        };
    }

    // 如果有毛利金額，驗證毛利金額
    if (input.gross_profit) {
        const grossProfitValidation = validateGrossProfit(
            input.gross_profit,
            input.revenue
        );
        if (!grossProfitValidation.isValid) {
            return grossProfitValidation;
        }
    }

    // 如果有毛利率，驗證毛利率
    if (input.gross_profit_margin) {
        const marginValidation = validateGrossProfitMargin(input.gross_profit_margin);
        if (!marginValidation.isValid) {
            return marginValidation;
        }
    }

    return { isValid: true };
}

/**
 * 驗證人數輸入
 */
export function validateHeadcount(headcount: number): ValidationResult {
    if (headcount < 0) {
        return {
            isValid: false,
            error: '人數不能為負數',
        };
    }

    if (headcount > 1000) {
        return {
            isValid: false,
            error: '人數超過合理範圍（最大 1000 人）',
        };
    }

    return { isValid: true };
}

/**
 * 驗證月薪總額
 */
export function validateMonthlyCost(cost: number): ValidationResult {
    if (cost < 0) {
        return {
            isValid: false,
            error: '月薪總額不能為負數',
        };
    }

    if (cost > 100000000) {
        // 1 億
        return {
            isValid: false,
            error: '月薪總額超過合理範圍（最大 1 億元）',
        };
    }

    return { isValid: true };
}
