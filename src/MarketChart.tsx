import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp } from 'lucide-react'

interface DataPoint {
  time: string
  value: number
}

function MarketChart() {
  const [data, setData] = useState<DataPoint[]>([])

  // Generate initial data
  useEffect(() => {
    const initialData: DataPoint[] = []
    const now = new Date()
    let baseValue = 100

    for (let i = 20; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 5000)
      const hours = time.getHours().toString().padStart(2, '0')
      const minutes = time.getMinutes().toString().padStart(2, '0')
      const seconds = time.getSeconds().toString().padStart(2, '0')

      // Add some randomness to create realistic market data
      baseValue += (Math.random() - 0.48) * 3

      initialData.push({
        time: `${hours}:${minutes}:${seconds}`,
        value: Math.max(85, Math.min(115, baseValue))
      })
    }

    setData(initialData)
  }, [])

  // Update data every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        const now = new Date()
        const hours = now.getHours().toString().padStart(2, '0')
        const minutes = now.getMinutes().toString().padStart(2, '0')
        const seconds = now.getSeconds().toString().padStart(2, '0')

        // Get last value and add some variation
        const lastValue = prevData[prevData.length - 1]?.value || 100
        const newValue = lastValue + (Math.random() - 0.48) * 3

        const newDataPoint: DataPoint = {
          time: `${hours}:${minutes}:${seconds}`,
          value: Math.max(85, Math.min(115, newValue)) // Keep between 85-115
        }

        // Keep only last 21 points (to show ~1.75 minutes of data)
        const updatedData = [...prevData.slice(1), newDataPoint]
        return updatedData
      })
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  // Calculate change percentage
  const getChangePercent = () => {
    if (data.length < 2) return '0'
    const first = data[0].value
    const last = data[data.length - 1].value
    return (((last - first) / first) * 100).toFixed(2)
  }

  const changePercent = parseFloat(getChangePercent())
  const isPositive = changePercent >= 0

  return (
    <div className="w-full bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-blue-400" size={24} />
          <h3 className="text-xl font-semibold text-white">Live Market Data</h3>
        </div>
        <div className={`flex items-center gap-1 text-lg font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          <span>{isPositive ? '↑' : '↓'}</span>
          <span>{Math.abs(changePercent)}%</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
          <XAxis
            dataKey="time"
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            domain={[85, 115]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#fff'
            }}
            labelStyle={{ color: '#94a3b8' }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>

      <p className="text-sm text-gray-400 mt-3 text-center">
        Simulated market data - Updates every 5 seconds
      </p>
    </div>
  )
}

export default MarketChart
