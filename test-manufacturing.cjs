// 測試製造業人事成本計算
const industries = require('./src/data/industries.json');

console.log('=== 製造業人事成本比例測試 ===\n');

// 找出所有製造業產業
const manufacturingCategory = industries.categories.find(c => c.id === 'manufacturing');
const manufacturingIndustries = manufacturingCategory.industries.map(id =>
    industries.industries.find(ind => ind.id === id)
);

console.log('製造業產業列表：');
manufacturingIndustries.forEach(ind => {
    console.log(`\n${ind.id}. ${ind.name}`);
    console.log(`   人事成本比例: ${ind.hr_cost_ratio_min}% - ${ind.hr_cost_ratio_max}%`);
    console.log(`   成長引擎: ${ind.primary_growth_engine} / ${ind.secondary_growth_engine}`);
    console.log(`   部門配置:`, ind.department_allocation);
});

// 模擬計算測試
console.log('\n\n=== 計算測試案例 ===\n');

const testCases = [
    {
        industryId: 15,
        name: '金屬加工工廠',
        revenue: 10000000,
        grossProfit: 3000000
    },
    {
        industryId: 16,
        name: '塑膠射出工廠',
        revenue: 8000000,
        grossProfit: 2400000
    },
    {
        industryId: 29,
        name: '食品代工',
        revenue: 5000000,
        grossProfit: 1500000
    },
    {
        industryId: 30,
        name: '美妝 OEM',
        revenue: 6000000,
        grossProfit: 1800000
    }
];

testCases.forEach(testCase => {
    const industry = industries.industries.find(ind => ind.id === testCase.industryId);
    const minHrCost = testCase.grossProfit * (industry.hr_cost_ratio_min / 100);
    const maxHrCost = testCase.grossProfit * (industry.hr_cost_ratio_max / 100);
    const avgHrCost = (minHrCost + maxHrCost) / 2;

    console.log(`${testCase.name}:`);
    console.log(`  年營收: ${testCase.revenue.toLocaleString()} 元`);
    console.log(`  毛利: ${testCase.grossProfit.toLocaleString()} 元 (${((testCase.grossProfit / testCase.revenue) * 100).toFixed(1)}%)`);
    console.log(`  建議人事成本範圍: ${minHrCost.toLocaleString()} - ${maxHrCost.toLocaleString()} 元`);
    console.log(`  平均建議: ${avgHrCost.toLocaleString()} 元`);
    console.log(`  剩餘毛利 (設備+獲利): ${(testCase.grossProfit - avgHrCost).toLocaleString()} 元 (${(((testCase.grossProfit - avgHrCost) / testCase.grossProfit) * 100).toFixed(1)}%)`);
    console.log('');
});

// 驗證所有製造業都是 35-40%
console.log('\n=== 驗證製造業比例 ===\n');
const allCorrect = manufacturingIndustries.every(ind =>
    ind.hr_cost_ratio_min === 35 && ind.hr_cost_ratio_max === 40
);

if (allCorrect) {
    console.log('✅ 所有製造業產業的人事成本比例都正確設定為 35-40%');
} else {
    console.log('❌ 發現不一致的設定：');
    manufacturingIndustries.forEach(ind => {
        if (ind.hr_cost_ratio_min !== 35 || ind.hr_cost_ratio_max !== 40) {
            console.log(`   ${ind.name}: ${ind.hr_cost_ratio_min}% - ${ind.hr_cost_ratio_max}%`);
        }
    });
}

// 比較其他產業類別
console.log('\n\n=== 各產業類別人事成本比例比較 ===\n');
const categoryComparison = {};

industries.categories.forEach(category => {
    const categoryIndustries = category.industries.map(id =>
        industries.industries.find(ind => ind.id === id)
    );

    const avgMin = categoryIndustries.reduce((sum, ind) => sum + ind.hr_cost_ratio_min, 0) / categoryIndustries.length;
    const avgMax = categoryIndustries.reduce((sum, ind) => sum + ind.hr_cost_ratio_max, 0) / categoryIndustries.length;

    categoryComparison[category.name] = {
        avg: `${avgMin.toFixed(1)}% - ${avgMax.toFixed(1)}%`,
        count: categoryIndustries.length
    };
});

Object.entries(categoryComparison).forEach(([name, data]) => {
    console.log(`${name}: ${data.avg} (${data.count} 個產業)`);
});
