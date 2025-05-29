"use client";

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDropzone } from "react-dropzone";
import { addProduct, fetchCategories } from '@/lib';
import { useRouter } from 'next/navigation';

interface Category {
  _id: string;
  name: string;
}

export function AddProductDrawer() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
    };
    loadCategories();
  }, []);

  // Handle image upload
  const onDrop = (acceptedFiles: File[]) => {

    console.log('accepted file is', acceptedFiles);
    
    if (acceptedFiles.length > 0) {
      setImage(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': [] 
    },
    multiple: false,
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const productData = {
      name,
      description,
      category,
      price,
      stock,
      // Only include image if it exists
      ...(image && { image })
    };
  
    try {
      const result = await addProduct(productData);
      if (result) {
        console.log("Product added successfully:", result);
        // Reset form
        setName("");
        setDescription("");
        setCategory("");
        setPrice("");
        setStock("");
        setImage(null);
        setDrawerOpen(false);
        router.push('/dashboard/product', { scroll: false })
      } else {
        console.log("No data returned from API");
      }
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  return (
    <>
      <Drawer direction="right" open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" onClick={() => setDrawerOpen(true)}>
            Add Product
          </Button>
        </DrawerTrigger>
  
        <DrawerContent>
          <div className="flex flex-col h-full">
            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto">
              <div className="mx-auto w-full max-w-sm p-4">
                <DrawerHeader>
                  <DrawerTitle>Add New Product</DrawerTitle>
                </DrawerHeader>
  
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {/* Product Name */}
                  <div>
                    <label className="font-medium text-sm">Product Name</label>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
  
                  {/* Product Description */}
                  <div>
                    <label className="font-medium text-sm">Description</label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter product description"
                      required
                    />
                  </div>
  
                  <div>
                    <label className="font-medium text-sm">Product Price</label>
                    <Input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice((e.target.value))}
                      placeholder="Enter product price"
                      required
                    />
                  </div>
  
                  <div>
                    <label className="font-medium text-sm">Stock</label>
                    <Input
                      type="text"
                      value={stock}
                      onChange={(e) => setStock((e.target.value))}
                      placeholder="Enter product stock"
                      required
                    />
                  </div>
  
                  {/* Category Dropdown */}
                  <div>
                    <label className="font-medium text-sm">Category</label>
                    <Select
                      defaultValue={category}
                      onValueChange={(selectedValue) => {
                        setCategory(selectedValue); // Update state directly
                      }}
                      required
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories && categories.map((categoryItem) => (
                            
                          <SelectItem
                            key={categoryItem._id}
                            value={categoryItem._id}
                          >
                            {categoryItem.name} {/* Display name */}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
  
                  {/* Image Upload */}
                  <div>
                    <label className="font-medium text-sm">Product Image</label>
                    <div
                      {...getRootProps()}
                      className="border border-dashed p-4 text-center text-sm text-muted-foreground"
                    >
                      <input {...getInputProps()} />
                      {image ? (
                        <p className="mt-2">Image selected: {image.name}</p>
                      ) : (
                        <p className="text-muted-foreground">Drag and drop an image, or click to select</p>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
  
            {/* Sticky buttons at the bottom */}
            <div className="sticky bottom-0 bg-background border-t p-4">
              <div className="mx-auto w-full max-w-sm space-y-2">
                <Button type="submit" variant="outline" className="w-full" onClick={handleFormSubmit}>
                  Submit
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
                </DrawerClose>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}