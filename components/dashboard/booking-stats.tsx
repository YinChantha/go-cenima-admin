"use client"

import { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'

export function BookingStats() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate data fetching
    const generateData = () => {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 30)
      
      const data = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(startDate)
        date.setDate(date.getDate() + i)
        
        // Generate some realistic data with a weekend pattern
        const day = date.getDay()
        const isWeekend = day === 0 || day === 6
        const baseValue = isWeekend ? 18 : 12
        
        return {
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          bookings: Math.floor(baseValue + Math.random() * 15),
        }
      })
      
      setData(data)
      setLoading(false)
    }
    
    const timer = setTimeout(() => {
      generateData()
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-[250px] w-full" />
      </div>
    )
  }

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: -10,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tickFormatter={(value) => value}
            interval="preserveEnd"
            minTickGap={10}
          />
          <YAxis 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <Tooltip 
            labelStyle={{ fontWeight: 'bold' }} 
            contentStyle={{ 
              borderRadius: 8, 
              border: '1px solid hsl(var(--border))' 
            }}
          />
          <Area 
            type="monotone" 
            dataKey="bookings" 
            stroke="hsl(var(--chart-1))" 
            fillOpacity={1} 
            fill="url(#colorBookings)" 
            activeDot={{ r: 6 }} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}