"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious,CarouselNext } from "./ui/carousel";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { MoreVertical, InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
import {MenuItem} from '@/types';
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AddMenuItemModal } from "@/app/[restaurantId]/admin/menu/page";
import { Button } from "./ui/button";
import { useState } from "react";
//images, name, cuisineType,discount,Price before discountl,Price after discount,Orders,Available, Calories, Health Score, Rating

export const columns: ColumnDef<MenuItem>[] = [
  {
    accessorKey: "images",
    header: "Images",
    cell: ({ row }) => {
      return <Carousel className="w-32 h-24 ml-4">
      <CarouselContent>
        {
        row.getValue<string[]>("images").map((image: string, index: number) => (
          <CarouselItem key={index}>
            <img src={image} height={200} width= 'auto' alt={`${index + 1}`} className="w-full z-10 h-full object-cover rounded-md" />
          </CarouselItem>
        ))
        }
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      </Carousel>
    }
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "primaryCategory",
    header: "Primary Category",
  },
  {
    accessorKey: "secondaryCategory",
    header: "Secondary Category",
  },
  {
    accessorKey: "cuisineType",
    header: "Cuisine Type",
  },
  {
    accessorKey: "discount",
    header: "Discount",
  },
  {
    accessorKey: "markedPrice",
    header: "Marked Price",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("markedPrice"))
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount)
      return formatted;
    }
  },
  {
    accessorKey: "sellingPrice",
    header: "Selling Price",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("sellingPrice"))
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount)
      return formatted;
    }
  },
  {
    accessorKey: "orders",
    header: "Orders",
  },
  {
    accessorKey: "available",
    header: "Available",
    cell: ({ row }) => {
      const cellValue = row.getValue("available");
      return cellValue === true ? "Yes" : "No";
    }
  },
  {
    accessorKey: "healthScore",
    header: "Health Score",
    cell: ({ row }) => {
      const cellValue = parseFloat(row.getValue("healthScore")).toFixed(1);
      if(cellValue === null)
        return "NA";
      return `${cellValue}/10`;
    }
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const cellValue : string = row.getValue("description")
      return <div className="flex gap-2">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon size={18} className="flex-shrink-0"/>
              </TooltipTrigger>
              <TooltipContent className="max-w-80">
                <p>{cellValue}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="truncate">{cellValue}</div>        
        </div> 
    }
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      const [selecteRow, setSelectedRow]= useState<string | null>(null);
      const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const buttonId: string = e.currentTarget.id;
        setSelectedRow(buttonId);
      };
      return  <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Dialog>
              <DialogTrigger asChild>
                <Button  id={row.id} className="hello w-full" onClick={(e) => handleClick(e)}>Edit</Button>
              </DialogTrigger>
              <AddMenuItemModal selectedElt={selecteRow} />
            </Dialog>
          </DropdownMenuItem>
          <DropdownMenuItem>
              Show Reviews
          </DropdownMenuItem>
          <DropdownMenuItem>
              Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  </div>
    }
  },
]