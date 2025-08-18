"use client"

import { useState } from 'react'
import { Pencil, Trash2, UploadCloud } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AspectRatio } from '@/components/ui/aspect-ratio'

export function RestaurantGallery() {
  const { toast } = useToast()
  
  // Mock data for the gallery
  const [images, setImages] = useState([
    {
      id: '1',
      url: 'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg',
      alt: 'Restaurant interior',
      type: 'interior'
    },
    {
      id: '2',
      url: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg',
      alt: 'Restaurant exterior',
      type: 'exterior'
    },
    {
      id: '3',
      url: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg',
      alt: 'Food dish',
      type: 'dish'
    },
    {
      id: '4',
      url: 'https://images.pexels.com/photos/2762939/pexels-photo-2762939.jpeg',
      alt: 'Food dish',
      type: 'dish'
    },
    {
      id: '5',
      url: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg',
      alt: 'Restaurant interior',
      type: 'interior'
    },
    {
      id: '6',
      url: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg',
      alt: 'Restaurant interior',
      type: 'interior'
    },
    {
      id: '7',
      url: 'https://images.pexels.com/photos/299348/pexels-photo-299348.jpeg',
      alt: 'Drink',
      type: 'drink'
    },
    {
      id: '8',
      url: 'https://images.pexels.com/photos/370984/pexels-photo-370984.jpeg',
      alt: 'Food dish',
      type: 'dish'
    }
  ])
  
  const [isUploading, setIsUploading] = useState(false)
  
  const handleUpload = () => {
    // This would be replaced with actual file upload logic
    setIsUploading(true)
    
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false)
      toast({
        title: "Images uploaded",
        description: "Your images have been uploaded successfully.",
      })
    }, 1500)
  }
  
  const handleDelete = (id: string) => {
    // Filter out the deleted image
    setImages(images.filter(image => image.id !== id))
    
    toast({
      title: "Image deleted",
      description: "The image has been removed from your gallery.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div 
            key={image.id} 
            className="group relative overflow-hidden rounded-lg border border-muted"
          >
            <AspectRatio ratio={4/3}>
              <img 
                src={image.url} 
                alt={image.alt}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
              />
            </AspectRatio>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 bg-black/50 transition-opacity group-hover:opacity-100">
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary" size="sm">
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Image</DialogTitle>
                      <DialogDescription>
                        Update the image details or replace the image.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="rounded-lg overflow-hidden border">
                        <img 
                          src={image.url} 
                          alt={image.alt}
                          className="w-full h-auto max-h-[300px] object-cover"
                        />
                      </div>
                      <div className="grid gap-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label className="text-right text-sm font-medium">
                            Alt Text
                          </label>
                          <input 
                            type="text" 
                            className="col-span-3 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                            placeholder="Image description" 
                            defaultValue={image.alt}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label className="text-right text-sm font-medium">
                            Type
                          </label>
                          <select 
                            className="col-span-3 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                            defaultValue={image.type}
                          >
                            <option value="interior">Interior</option>
                            <option value="exterior">Exterior</option>
                            <option value="dish">Dish</option>
                            <option value="drink">Drink</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline">Cancel</Button>
                      <Button>Save Changes</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDelete(image.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        <div className="flex items-center justify-center rounded-lg border border-dashed border-muted min-h-[200px] p-4">
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <div className="rounded-full bg-primary/10 p-3">
              <UploadCloud className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Click to upload</p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG or GIF (max. 5MB)
              </p>
            </div>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload Images"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}