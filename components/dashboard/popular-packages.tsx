"use client"

import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'

export function PopularPackages() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      // Mock data
      const mockData = [
        { name: 'Premium Dinner', value: 42 },
        { name: 'Chef\'s Table', value: 28 },
        { name: 'Family Feast', value: 25 },
        { name: 'Business Lunch', value: 15 },
        { name: 'Romantic Dinner', value: 18 },
      ]
      
      setData(mockData)
      setLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[250px]">
        <Skeleton className="h-[200px] w-[200px] rounded-full" />
      </div>
    )
  }

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value} bookings`, 'Bookings']}
            contentStyle={{ 
              borderRadius: 8, 
              border: '1px solid hsl(var(--border))' 
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}