import axios from 'axios'

const api = axios.create({
    baseURL: 'https://mock.apipost.cn/mock/your-api-id', // apipost 模拟地址
    timeout: 10000
})

// 模拟数据生成函数
const generateMockData = {
    // 教学楼列表
    buildings: [
        { id: 1, name: '至善大楼', floors: 8, area: 15000, status: 'online', power: 285.6 },
        { id: 2, name: '忠孝大楼', floors: 6, area: 12000, status: 'online', power: 218.3 },
        { id: 3, name: '信义大楼', floors: 7, area: 13500, status: 'online', power: 265.8 },
        { id: 4, name: '和平大楼', floors: 5, area: 9800, status: 'online', power: 185.4 },
        { id: 5, name: '四维大楼', floors: 6, area: 11000, status: 'online', power: 198.7 },
        { id: 6, name: '仁爱大楼', floors: 5, area: 10500, status: 'online', power: 178.3 }
    ],

    // 今日数据
    todayData: {
        totalElectricity: 4852.6,
        totalWater: 1245.8,
        electricityChange: 3.2,
        waterChange: -1.5,
        peakHour: '10:00-12:00',
        peakValue: 856.3
    },

    // 生成日趋势数据
    dailyTrend(days = 7) {
        const data = []
        const now = new Date()
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now)
            date.setDate(date.getDate() - i)
            data.push({
                date: date.toISOString().split('T')[0],
                electricity: Math.round((3500 + Math.random() * 1500) * 100) / 100,
                water: Math.round((900 + Math.random() * 400) * 100) / 100
            })
        }
        return data
    },

    // 生成月趋势数据
    monthlyTrend(months = 12) {
        const data = []
        const now = new Date()
        for (let i = months - 1; i >= 0; i--) {
            const date = new Date(now)
            date.setMonth(date.getMonth() - i)
            data.push({
                month: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
                electricity: Math.round((85000 + Math.random() * 35000) * 100) / 100,
                water: Math.round((22000 + Math.random() * 8000) * 100) / 100
            })
        }
        return data
    },

    // 生成小时数据
    hourlyData() {
        const data = []
        for (let i = 0; i < 24; i++) {
            const baseValue = i >= 7 && i <= 22 ? 80 : 20
            data.push({
                hour: `${String(i).padStart(2, '0')}:00`,
                electricity: Math.round((baseValue + Math.random() * 40) * 100) / 100,
                water: Math.round((baseValue * 0.3 + Math.random() * 15) * 100) / 100
            })
        }
        return data
    },

    // 各楼栋对比
    buildingComparison() {
        return [
            { name: '至善大楼', electricity: 1256.8, water: 312.5, rank: 1 },
            { name: '忠孝大楼', electricity: 1089.3, water: 278.4, rank: 2 },
            { name: '信义大楼', electricity: 956.4, water: 245.6, rank: 3 },
            { name: '四维大楼', electricity: 823.7, water: 198.3, rank: 4 },
            { name: '和平大楼', electricity: 726.4, water: 165.2, rank: 5 }
        ]
    },

    // 节能建议
    suggestions: [
        {
            id: 1,
            type: 'warning',
            title: '至善大楼空调能耗偏高',
            desc: '检测到至善大楼近日空调能耗较同类建筑高出约15%，建议检查制冷设备运行状态',
            savings: '约 280 kWh/月'
        },
        {
            id: 2,
            type: 'info',
            title: '用电高峰时段优化',
            desc: '10:00-12:00 为全校用电高峰期，建议非紧急设备延后至14:00后运行',
            savings: '约 150 kWh/月'
        },
        {
            id: 3,
            type: 'success',
            title: '照明系统升级建议',
            desc: '忠孝大楼部分区域仍使用传统灯具，建议更换为LED节能灯具',
            savings: '约 420 kWh/月'
        },
        {
            id: 4,
            type: 'info',
            title: '用水异常监控',
            desc: '仁爱大楼近期用水量波动较大，建议排查是否存在漏水情况',
            savings: '约 50 m³/月'
        }
    ]
}

// 模拟延迟（性能差）
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// API 方法（使用模拟数据）
export const apiService = {
    // 获取教学楼列表
    async getBuildings() {
        await delay(800)  // 模拟网络延迟 800ms
        return { data: generateMockData.buildings }
    },

    // 获取今日数据
    async getTodayData() {
        await delay(600)
        return { data: generateMockData.todayData }
    },

    // 获取日趋势数据
    async getDailyTrend(days = 7) {
        await delay(700)
        return { data: generateMockData.dailyTrend(days) }
    },

    // 获取月趋势数据
    async getMonthlyTrend(months = 12) {
        await delay(900)
        return { data: generateMockData.monthlyTrend(months) }
    },

    // 获取小时数据
    async getHourlyData() {
        await delay(500)
        return { data: generateMockData.hourlyData() }
    },

    // 获取楼栋对比数据
    async getBuildingComparison() {
        await delay(650)
        return { data: generateMockData.buildingComparison() }
    },

    // 获取节能建议
    async getSuggestions() {
        await delay(550)
        return { data: generateMockData.suggestions }
    },

    // 获取单个楼栋详情
    async getBuildingDetail(id) {
        await delay(750)
        const building = generateMockData.buildings.find(b => b.id === id)
        if (building) {
            return {
                data: {
                    ...building,
                    todayElectricity: Math.round((building.power * 8 + Math.random() * 200) * 100) / 100,
                    todayWater: Math.round((150 + Math.random() * 100) * 100) / 100,
                    monthlyElectricity: Math.round((25000 + Math.random() * 10000) * 100) / 100,
                    monthlyWater: Math.round((4500 + Math.random() * 1500) * 100) / 100,
                    yearlyElectricity: Math.round((280000 + Math.random() * 80000) * 100) / 100,
                    yearlyWater: Math.round((52000 + Math.random() * 15000) * 100) / 100
                }
            }
        }
        return Promise.reject(new Error('Building not found'))
    }
}

export default api
