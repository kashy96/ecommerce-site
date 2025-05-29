
import type { Metadata } from "next";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import Header from "@/components/layouts/Header";
import { getServerSession } from "next-auth"
import {
    authOptions,
  } from "../api/auth/[...nextauth]/route";

const {SITE_NAME} = process.env;
export const metadata: Metadata = {
  title: `${SITE_NAME} dashboard`,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getServerSession(authOptions);
    
  return (
    <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
        <Header session={session}/>
        <div>
            {children}
        </div>
    </SidebarInset>
  </SidebarProvider>
  );
}