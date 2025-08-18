"use client"

import { useState } from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Mock image URLs for demo purposes
  const mockImages = [
    'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg',
    'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg',
    'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg',
    'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg',
    'https://images.pexels.com/photos/299348/pexels-photo-299348.jpeg',
    'https://images.pexels.com/photos/370984/pexels-photo-370984.jpeg',
  ]

  const handleImageSelect = (url: string) => {
    onChange(url)
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div 
        className="relative rounded-lg border"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AspectRatio ratio={16/9}>
          <img 
            src={value} 
            alt="Package image"
            className="object-cover w-full h-full rounded-lg"
          />
        </AspectRatio>
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
            <Button variant="secondary">
              <Upload className="h-4 w-4 mr-2" />
              Change Image
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {mockImages.map((url) => (
          <button
            key={url}
            type="button"
            onClick={() => handleImageSelect(url)}
            className={cn(
              "relative rounded-lg border overflow-hidden transition-all",
              value === url && "ring-2 ring-primary"
            )}
          >
            <AspectRatio ratio={16/9}>
              <img 
                src={url} 
                alt="Sample image"
                className="object-cover w-full h-full"
              />
            </AspectRatio>
            {value === url && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                <div className="rounded-full bg-primary p-1">
                  <X className="h-4 w-4 text-primary-foreground" />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}