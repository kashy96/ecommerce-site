import React from 'react'
import Navbar from '@/components/navbar'
import { fetchCategories } from '@/lib';

const layout = async({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const menu = await fetchCategories();
  const updatedMenu = [{ slug: 'all', name: 'All' }, ...menu];
  return (
    <div>
        <Navbar menu={updatedMenu} />
  
        <div>
            {children}
        </div>
        

    </div>
  )
}

export default layout