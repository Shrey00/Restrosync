"use client";

import { ChangeEvent, useState,  useCallback, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDropzone } from 'react-dropzone';
import { useForm, Controller } from 'react-hook-form'
import { X } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

import { Switch } from "@/components/ui/switch";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Star, Leaf, Drumstick, MoreVertical, PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

import { MenuItem } from "@/types";
import { columns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_IMAGES = 4
interface FormData {
  images: File[]
  name: string
  primaryCategory: string
  secondaryCategory: string
  cuisineType: string
  available: string
  description: string
  markedPrice: number
  discount: number
  autoCalculatePrice: string
  sellingPrice: number
  calories: number
  healthScore: number
  showHealthScore: string
}
function MenuItemForm({...props}) {
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [editItems, setEditItems]= useState<any | null>(null)

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<FormData>()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(
      file => file.size <= MAX_FILE_SIZE && ACCEPTED_IMAGE_TYPES.includes(file.type)
    )
    if (validFiles.length + previewImages.length > MAX_IMAGES) {
      toast({
        title: "Too many images",
        description: `You can only upload up to ${MAX_IMAGES} images.`,
        variant: "destructive",
      });
      return
    }
    setValue('images', [...(watch('images') || []), ...validFiles])
    setPreviewImages(prev => [...prev, ...validFiles.map(file => URL.createObjectURL(file))])
  }, [setValue, watch, previewImages])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ACCEPTED_IMAGE_TYPES
    },
    maxSize: MAX_FILE_SIZE
  })

  const watchMarkedPrice = watch('markedPrice')
  const watchDiscount = watch('discount')
  const watchAutoCalculatePrice = watch('autoCalculatePrice')

  useEffect(() => {
    if(props.formData){
      setEditItems({...props.formData});
    }
    else{
      setEditItems(null);
    }
    console.log('editItems', editItems)
    if (watchAutoCalculatePrice === 'yes' && watchMarkedPrice && watchDiscount) {
      const discountedPrice = watchMarkedPrice - (watchMarkedPrice * (watchDiscount / 100))
      setValue('sellingPrice', Number(discountedPrice.toFixed(2)))
    }
  }, [watchMarkedPrice, watchDiscount, watchAutoCalculatePrice, setValue, props.formData])

  const onSubmit = (data: FormData) => {
    console.log(data)
    // Here you would typically send the data to your backend
  }
  const onChangeEditItems = (key: string, value: string) => {
    setEditItems({
      ...editItems,
      [key]: value
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-full">
          <CardContent className="pt-6">
            <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer">
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>Drag 'n' drop some files here, or click to select files</p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                (Only *.jpeg, *.png, and *.webp images will be accepted, up to 5MB each)
              </p>
            </div>
            {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images.message}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              {previewImages.map((image, index) => (
                <div key={index} className="relative">
                  <img src={image} alt={`Preview ${index + 1}`} className="w-20 h-20 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImages(prev => prev.filter((_, i) => i !== index))
                      setValue('images', watch('images').filter((_, i) => i !== index))
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name of the food item</Label>
            <Input id="name" {...register('name', { required: 'Name is required' })} className="mt-1" value={editItems?.name} onChange={(e) => onChangeEditItems('name', e.target.value)} />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="primaryCategory">Primary Category</Label>
            <Controller
              name="primaryCategory"
              control={control}
              rules={{ required: 'Primary category is required' }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={editItems?.primaryCategory || field.value} value={editItems?.primaryCategory || field.value}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select primary category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fast-food">Fast Food</SelectItem>
                    <SelectItem value="main-course">Main Course</SelectItem>
                    <SelectItem value="appetizer">Appetizer</SelectItem>
                    <SelectItem value="dessert">Dessert</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.primaryCategory && <p className="text-red-500 text-sm mt-1">{errors.primaryCategory.message}</p>}
          </div>

          <div>
            <Label htmlFor="secondaryCategory">Secondary Category</Label>
            <Controller
              name="secondaryCategory"
              control={control}
              rules={{ required: 'Secondary category is required' }}
              render={({ field }) => (
                <Select onValueChange={editItems?.secondaryCategory || field.onChange} defaultValue={field.value} value={editItems?.secondaryCategory || field.value} >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select secondary category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pizza">Pizza</SelectItem>
                    <SelectItem value="burger">Burger</SelectItem>
                    <SelectItem value="biryani">Biryani</SelectItem>
                    <SelectItem value="pasta">Pasta</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.secondaryCategory && <p className="text-red-500 text-sm mt-1">{errors.secondaryCategory.message}</p>}
          </div>

          <div>
            <Label htmlFor="cuisineType">Cuisine Type</Label>
            <Controller
              name="cuisineType"
              control={control}
              rules={{ required: 'Cuisine type is required' }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={editItems?.cuisineType || field.value} value={editItems?.cuisineType || field.value}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select cuisine type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="veg">Vegetarian</SelectItem>
                    <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.cuisineType && <p className="text-red-500 text-sm mt-1">{errors.cuisineType.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Available</Label>
            <Controller
              name="available"
              control={control}
              rules={{ required: 'Availability is required' }}
              render={({ field }) => (
                <RadioGroup onValueChange={field.onChange} value={editItems?.available != null ?(editItems?.available ? 'yes': 'no') : field.value} className="flex space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="available-yes" />
                    <Label htmlFor="available-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="available-no" />
                    <Label htmlFor="available-no">No</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.available && <p className="text-red-500 text-sm mt-1">{errors.available.message}</p>}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description', { required: 'Description is required' })} className="mt-1" value={editItems?.description} onChange={(e) => onChangeEditItems('description', e.target.value)}/>
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="markedPrice">Marked Price</Label>
              <Input
                id="markedPrice"
                type="number"
                step="0.01"
                {...register('markedPrice', { required: 'Marked price is required', min: 0 })}
                className="mt-1" value={editItems?.markedPrice} onChange={(e) => onChangeEditItems('markedPrice', e.target.value)}
              />
              {errors.markedPrice && <p className="text-red-500 text-sm mt-1">{errors.markedPrice.message}</p>}
            </div>

            <div>
              <Label htmlFor="discount">Discount (%)</Label>
              <Input
                id="discount"
                type="number"
                step="0.1"
                {...register('discount', { required: 'Discount is required', min: 0, max: 100 })}
                className="mt-1" value={editItems?.discount} onChange={(e) => onChangeEditItems('discount', e.target.value)}
              />
              {errors.discount && <p className="text-red-500 text-sm mt-1">{errors.discount.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Auto-calculate Selling Price</Label>
            <Controller
              name="autoCalculatePrice"
              control={control}
              rules={{ required: 'This field is required' }}
              render={({ field }) => (
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4 mt-2" >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="auto-calculate-yes" />
                    <Label htmlFor="auto-calculate-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="auto-calculate-no" />
                    <Label htmlFor="auto-calculate-no">No</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.autoCalculatePrice && <p className="text-red-500 text-sm mt-1">{errors.autoCalculatePrice.message}</p>}
          </div>

          <div>
            <Label htmlFor="sellingPrice">Selling Price</Label>
            <Input
              id="sellingPrice"
              type="number"
              step="0.01"
              {...register('sellingPrice', { required: 'Selling price is required', min: 0 })}
              readOnly={watchAutoCalculatePrice === 'yes'}
              className="mt-1" value={editItems?.sellingPrice} onChange={(e) => onChangeEditItems('sellingPrice', e.target.value)}
            />
            {errors.sellingPrice && <p className="text-red-500 text-sm mt-1">{errors.sellingPrice.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                {...register('calories', { required: 'Calories are required', min: 0 })}
                className="mt-1" value={editItems?.calories} onChange={(e) => onChangeEditItems('calories', e.target.value)}
              />
              {errors.calories && <p className="text-red-500 text-sm mt-1">{errors.calories.message}</p>}
            </div>

            <div>
              <Label htmlFor="healthScore">Health Score</Label>
              <Input
                id="healthScore"
                type="number"
                {...register('healthScore', { required: 'Health score is required', min: 0, max: 10 })}
                className="mt-1" value={editItems?.healthScore} onChange={(e) => onChangeEditItems('healthScore', e.target.value)}
              />
              {errors.healthScore && <p className="text-red-500 text-sm mt-1">{errors.healthScore.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Show Health Score</Label>
            <Controller
              name="showHealthScore"
              control={control}
              rules={{ required: 'This field is required' }}
              render={({ field }) => (
                <RadioGroup onValueChange={field.onChange} className="flex space-x-4 mt-2" value={editItems?.showHealthScore !=null ? (editItems?.showHealthScore ? 'yes': 'no' ): field.value}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="show-health-score-yes" />
                    <Label htmlFor="show-health-score-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="show-health-score-no" />
                    <Label htmlFor="show-health-score-no">No</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.showHealthScore && <p className="text-red-500 text-sm mt-1">{errors.showHealthScore.message}</p>}
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full mt-6">Submit</Button>
    </form>
  )
}


export const AddMenuItemModal = ({...props}) => {

  // temperary added this state to test the modal
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: "0",
      name: "Veggie Supreme Pizza",
      images: [
        "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      ],
      markedPrice: 280,
      sellingPrice: 260,
      available: false,
      calories: 250,
      description:
        "This is a pretty good pizza with this many toppings fuck description This is a pretty good pizza with this many toppings fuck descriptionThis is a pretty good pizza with this many toppings fuck descriptionThis is a pretty good pizza with this many toppings fuck description",
      healthScore: 8,
      showHealthScore: false,
      rating: 4.5,
      restaurantId: "32",
      primaryCategory: "fast-food",
      secondaryCategory: "pizza",
      cuisineType: "veg",
      orders: 100,
      reviewSummary: "yeah good",
      discount: 10,
    },
    {
      id: "1",
      name: "Veggie Supreme Pizza",
      images: [
        "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      ],
      markedPrice: 280,
      sellingPrice: 260,
      available: true,
      calories: 250,
      description:
        "This is a pretty good pizza with this many toppings fuck description",
      healthScore: 8,
      showHealthScore: false,
      rating: 4.5,
      restaurantId: "32",
      primaryCategory: "fast-food",
      secondaryCategory: "pizza",
      cuisineType: "veg",
      orders: 100,
      reviewSummary: "yeah good",
      discount: 10,
    },
  ]);
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    // id: "",
    images: [],
    name: "",
    // restaurantId: "string",
    primaryCategory: "",
    secondaryCategory: "",
    cuisineType: "",
    orders: 0,
    available: false,
    description: "",
    reviewSummary: "",
    markedPrice: 0,
    sellingPrice: 0,
    discount: 0,
    calories: 0,
    healthScore: 0,
    showHealthScore: false,
  });
  useEffect(() => {
    if (props.selectedElt) {
      console.log(menuItems[+props.selectedElt])
      setFormData({
        images: menuItems[+props.selectedElt].images,
        name: menuItems[+props.selectedElt].name,
        primaryCategory:  menuItems[+props.selectedElt].primaryCategory,
        secondaryCategory:  menuItems[+props.selectedElt].secondaryCategory,
        cuisineType:  menuItems[+props.selectedElt].cuisineType,
        orders:  menuItems[+props.selectedElt].orders,
        available:  menuItems[+props.selectedElt].available,
        description:  menuItems[+props.selectedElt].description,
        reviewSummary:  menuItems[+props.selectedElt].reviewSummary,
        markedPrice:  menuItems[+props.selectedElt].markedPrice,
        sellingPrice:  menuItems[+props.selectedElt].sellingPrice,
        discount:  menuItems[+props.selectedElt].discount,
        calories:  menuItems[+props.selectedElt].calories,
        healthScore:  menuItems[+props.selectedElt].healthScore,
        showHealthScore:  menuItems[+props.selectedElt].showHealthScore,
      })
    } else {
      setFormData({
        images: [],
        name: "",
        primaryCategory: "",
        secondaryCategory: "",
        cuisineType: "",
        orders: 0,
        available: false,
        description: "",
        reviewSummary: "",
        markedPrice: 0,
        sellingPrice: 0,
        discount: 0,
        calories: 0,
        healthScore: 0,
        showHealthScore: false,
      })
    }
  }, [props.selectedElt]);
  const handleChange = (e: ChangeEvent) => {
  }
  return (
    <DialogContent className="h-[70vh] w-[100vw] overflow-auto">
      <DialogHeader>
        <DialogTitle>Add Item</DialogTitle>
        <DialogDescription>
          Add a new menu item by entering all the required values.
        </DialogDescription>
      </DialogHeader>
      <MenuItemForm formData ={formData}/>
    </DialogContent>
  );
};
export default function MenuItemsTable() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: "1",
      name: "Veggie Supreme Pizza",
      images: [
        "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      ],
      markedPrice: 280,
      sellingPrice: 260,
      available: false,
      calories: 250,
      description:
        "This is a pretty good pizza with this many toppings fuck description This is a pretty good pizza with this many toppings fuck descriptionThis is a pretty good pizza with this many toppings fuck descriptionThis is a pretty good pizza with this many toppings fuck description",
      healthScore: 8,
      showHealthScore: false,
      rating: 4.5,
      restaurantId: "32",
      primaryCategory: "fast-food",
      secondaryCategory: "pizza",
      cuisineType: "veg",
      orders: 100,
      reviewSummary: "yeah good",
      discount: 10,
    },
    {
      id: "1",
      name: "Veggie Supreme Pizza",
      images: [
        "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      ],
      markedPrice: 280,
      sellingPrice: 260,
      available: true,
      calories: 250,
      description:
        "This is a pretty good pizza with this many toppings fuck description",
      healthScore: 8,
      showHealthScore: false,
      rating: 4.5,
      restaurantId: "32",
      primaryCategory: "fast-food",
      secondaryCategory: "pizza",
      cuisineType: "veg",
      orders: 100,
      reviewSummary: "yeah good",
      discount: 10,
    },
  ]);

  const handleUpdate = (id: string, updates: Partial<MenuItem>): void => {
    setMenuItems(
      menuItems.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  return (
    <Card>
      <CardContent className="overflow-x-auto">
        <div className="pb-4 pt-7 flex items-center justify-between">
          <h2 className="text-foreground font-bold text-2xl">Menu Items</h2>
          <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <PlusIcon size={18} />
              Add Item
            </Button>            
          </DialogTrigger>
          <AddMenuItemModal/>
        </Dialog>
        </div>
        <DataTable columns={columns} data={menuItems} />
      </CardContent>
    </Card>
  );
}
