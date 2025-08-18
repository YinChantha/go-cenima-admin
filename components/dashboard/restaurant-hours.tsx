"use client"

import { useState } from 'react'
import { Clock, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface TimeSlot {
  open: string
  close: string
}

interface DaySchedule {
  isOpen: boolean
  timeSlots: TimeSlot[]
}

type WeekSchedule = {
  [key: string]: DaySchedule
}

export function RestaurantHours() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  
  // Initial mock data
  const [schedule, setSchedule] = useState<WeekSchedule>({
    monday: {
      isOpen: true,
      timeSlots: [
        { open: "10:00", close: "14:00" },
        { open: "17:00", close: "22:00" }
      ]
    },
    tuesday: {
      isOpen: true,
      timeSlots: [
        { open: "10:00", close: "14:00" },
        { open: "17:00", close: "22:00" }
      ]
    },
    wednesday: {
      isOpen: true,
      timeSlots: [
        { open: "10:00", close: "14:00" },
        { open: "17:00", close: "22:00" }
      ]
    },
    thursday: {
      isOpen: true,
      timeSlots: [
        { open: "10:00", close: "14:00" },
        { open: "17:00", close: "22:00" }
      ]
    },
    friday: {
      isOpen: true,
      timeSlots: [
        { open: "10:00", close: "14:00" },
        { open: "17:00", close: "23:00" }
      ]
    },
    saturday: {
      isOpen: true,
      timeSlots: [
        { open: "10:00", close: "23:00" }
      ]
    },
    sunday: {
      isOpen: true,
      timeSlots: [
        { open: "10:00", close: "22:00" }
      ]
    }
  })
  
  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ]
  
  const timeOptions = [
    "00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30",
    "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30",
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
    "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30",
  ]
  
  const toggleDayOpen = (day: string) => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        isOpen: !schedule[day].isOpen
      }
    })
  }
  
  const updateTimeSlot = (day: string, index: number, field: 'open' | 'close', value: string) => {
    const updatedTimeSlots = [...schedule[day].timeSlots]
    updatedTimeSlots[index] = {
      ...updatedTimeSlots[index],
      [field]: value
    }
    
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        timeSlots: updatedTimeSlots
      }
    })
  }
  
  const addTimeSlot = (day: string) => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        timeSlots: [
          ...schedule[day].timeSlots,
          { open: "10:00", close: "18:00" }
        ]
      }
    })
  }
  
  const removeTimeSlot = (day: string, index: number) => {
    const updatedTimeSlots = [...schedule[day].timeSlots]
    updatedTimeSlots.splice(index, 1)
    
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        timeSlots: updatedTimeSlots
      }
    })
  }
  
  const saveChanges = () => {
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      console.log('Saving opening hours:', schedule)
      toast({
        title: "Opening hours updated",
        description: "Your restaurant opening hours have been updated successfully.",
      })
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {days.map((day) => (
          <div key={day.key} className="rounded-lg border p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={schedule[day.key].isOpen}
                  onCheckedChange={() => toggleDayOpen(day.key)}
                  id={`${day.key}-switch`}
                />
                <Label htmlFor={`${day.key}-switch`} className="font-medium">
                  {day.label}
                </Label>
              </div>
              <div className="text-sm text-muted-foreground">
                {schedule[day.key].isOpen ? 'Open' : 'Closed'}
              </div>
            </div>
            
            {schedule[day.key].isOpen && (
              <div className="space-y-3 pl-1">
                {schedule[day.key].timeSlots.map((slot, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div className="grid grid-cols-[1fr,auto,1fr,auto] gap-2 items-center flex-1">
                      <Select
                        value={slot.open}
                        onValueChange={(value) => updateTimeSlot(day.key, index, 'open', value)}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Opening time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <span className="text-center">to</span>
                      
                      <Select
                        value={slot.close}
                        onValueChange={(value) => updateTimeSlot(day.key, index, 'close', value)}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Closing time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTimeSlot(day.key, index)}
                        disabled={schedule[day.key].timeSlots.length === 1}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove time slot</span>
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => addTimeSlot(day.key)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Time Slot
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button variant="outline">Cancel</Button>
        <Button onClick={saveChanges} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}