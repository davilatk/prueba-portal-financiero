"use client";

import { useAuthStore, useAuthStoreHydrate } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, FileText } from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { MenuItem } from "@/types/common";
import { SideMenu } from "@/components/common/SideMenu";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NotificationPanel from "@/components/common/NotificationPanel";
import { NotificationListener } from "@/components/common/NotificationListener";

/**
 * Layout para las rutas bajo /(dashboard)
 *
 * @param {{ children: React.ReactNode }} param0 
 * @param {React.ReactNode} param0.children 
 * @returns {*} 
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuthStore();
    useAuthStoreHydrate();
    const pathname = usePathname();
    const [menu, setMenu] = useState<MenuItem[]>([
        { label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, href: "/dashboard", selected: true },
        { label: "Solicitudes", icon: <FileText className="w-5 h-5" />, href: "/solicitudes", selected: false },
    ]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMenu(prev =>
            prev.map(item => ({ ...item, selected: item.href === pathname }))
        );
    }, [pathname]);

    const onLogout = async () => {
        await logout();
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    };

    return (
        <ResizablePanelGroup
            id="dashboard-layout"
            direction="horizontal"
            className="min-h-screen flex w-full overflow-hidden"
        >
            <ResizablePanel id="dashboard-layout-sidebar" defaultSize={10} style={{ background: "#fff" }} className="min-w-[50px] max-w-[50px] md:min-w-[150px] md:max-w-[300px] shadow-sm shadow-gray-300/20">
                <SideMenu menus={menu} />
            </ResizablePanel>
            <ResizableHandle className="bg-white" />
            <ResizablePanel defaultSize={90} id="main-r" style={{ background: "#00479315" }}>
                <div className="flex min-h-full w-full flex-col">
                    <div className="w-full">
                        <header className="w-full shadow-sm shadow-gray-300/20 p-4 flex justify-end items-center gap-4">
                            <NotificationPanel />
                            <NotificationListener />
                            <>
                                <span className="text-sm font-medium">{user?.name}</span>
                                {user?.avatar && (
                                    <Image
                                        src={user.avatar}
                                        alt="User photo"
                                        width={38}
                                        height={38}
                                        className="rounded-full border"
                                    />
                                )}
                                <Button variant="ghost" onClick={onLogout} className="flex items-center gap-2 hover:text-red-600">
                                    <LogOut size={16} />
                                </Button>
                            </>
                        </header>
                        <main className="p-6 flex-1">{children}</main>
                    </div>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}