import React from 'react'
import { fetchCategories } from '@/lib'
import LeftSidebar from '@/components/layouts/left-sidebar';
import SortList from '@/components/layouts/sorting';

const layout = async({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const categories = await fetchCategories();
  const updatedCategories = [{ slug: 'all', name: 'All' }, ...categories];

  return (
    <div>
  
        <div className="2xl:px-52">
          <div className="flex flex-col lg:flex-row">

            {/* Left Sidebar: Categories */}
            <LeftSidebar updatedCategories={updatedCategories} />

            {/* Middle Section: Data (Product Cards) */}
            <div className="w-full lg:w-8/12 p-4">
              {children}
            </div>

            {/* Right Sidebar: Sorting */}
            <SortList />

          </div>
        </div>
        

    </div>
  )
}

export default layout