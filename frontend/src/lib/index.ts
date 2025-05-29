import { CustomUser } from '@/app/api/auth/[...nextauth]/route';
import API from './api'; // Import the axios instance from api.ts
import { CATEGORY_URL, PRODUCT_URL } from './constants';

export async function fetchCategories() {
  try {
    const res = await API.get(CATEGORY_URL);    
    if (res.status === 200) {
      return res.data?.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
}

export async function fetchProducts(user: CustomUser, pageIndex?: number, pageSize?: number) {
  try {
    const baseUrl = PRODUCT_URL;
    let productUrl = baseUrl;
    if (pageIndex && pageSize) {
      productUrl = `${baseUrl}?pageIndex=${pageIndex}&pageSize=${pageSize}`; // Append pagination params if they exist
    }
    const res = await API.get(productUrl);
    
    if (res?.status === 200) {
      return res.data?.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
}

export async function fetchSiteProducts(category="") {
  try {
    const baseUrl = PRODUCT_URL+'/all';
    let productUrl = baseUrl;
    if (category) {
      productUrl = `${baseUrl}?category=${category}`; 
    }

    const res = await API.get(productUrl);
    if (res?.status === 200) {
      return res.data?.data?.products;
    }
    return null;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch website products');
  }
}

export async function productDetail(slug: string) {
  try {
    const url = PRODUCT_URL+'/'+slug;
    const res = await API.get(url);
    
    if (res?.status === 200) {
      return res.data?.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching product detail:', error);
    throw new Error('Failed to fetch website product detail');
  }
}

export async function addProduct(productData: ProductData) {
  try {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('category', productData.category);
    formData.append('stock', productData.stock);
    formData.append('price', productData.price);
     // Check if image is actually a File object with proper methods
     if (productData.image && productData.image instanceof File) {
      formData.append('image', productData.image);
    } else if (productData.image) {
      console.warn('Image is not a proper File object:', productData.image);
    }

    // Make sure to set the correct content type for multipart form data
    const res = await API.post(`${PRODUCT_URL}/add`, formData, {
      headers: {
        // Don't set Content-Type manually - let the browser set it with boundary
        'Content-Type': 'multipart/form-data'
      }
    });

    if (res?.status === 201 || res?.status === 200) {
      return res.data;
    }

    console.warn('Unexpected response status:', res?.status);
    return null;
  } catch (error) {
    console.error('Error adding product:', error);
    throw new Error('Failed to add product');
  }
}



