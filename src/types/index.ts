export type GrowthEngine =
    | 'Product-led'
    | 'Sales-led'
    | 'Media-led'
    | 'Ops-led'
    | 'Founder-led / Relationship-led'
    | 'Channel-led / Network-led'
    | 'Channel-led/Network-led';

export type Department = '客戶經營' | '產品技術' | '品牌行銷' | '行政支援';

export interface DepartmentAllocation {
    客戶經營: number;
    產品技術: number;
    品牌行銷: number;
    行政支援: number;
}

export interface Industry {
    id: number;
    name: string;
    primary_growth_engine: GrowthEngine | null;
    secondary_growth_engine: GrowthEngine | null;
    hr_cost_ratio_min: number;
    hr_cost_ratio_max: number;
    department_allocation: DepartmentAllocation;
}

export interface UserInput {
    industry_id: number;
    revenue: number;
    gross_profit?: number;
    gross_profit_margin?: number;
}

export interface CalculationResult {
    input: UserInput;
    industry: Industry;
    gross_profit: number;
    gross_profit_margin: number;
    recommended_hr_cost: number;
    hr_cost_ratio: number;
    hr_cost_to_revenue_ratio: number;
    department_allocation: {
        department: Department;
        amount: number;
        percentage: number;
    }[];
}


export interface IndustryCategory {
    id: string;
    name: string;
    industries: number[];
}
