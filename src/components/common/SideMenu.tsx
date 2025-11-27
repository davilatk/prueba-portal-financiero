
import Link from 'next/link'
import { Button } from '../ui/button'
import Image from "next/image";
import { MenuItem } from '@/types/common';

function linksToRender(links: MenuItem[]) {
    return links.map((link, index) => (
        <Link href={link.href} className="w-full" key={index + "linksToRender"}>
            <Button variant={link.selected ? "secondary" : "ghost"} size="lg" className="w-full justify-start rounded-lg" style={{ height: "55px" }}>
                {link.icon}
                <span className="hidden md:block">{link.label}</span>
            </Button>
        </Link>
    ))
}

export function SideMenu({ menus }: { menus: MenuItem[] }) {
    return (
        <>
            <div className="flex w-full items-center justify-center mt-6">
                <Image
                    src="/brand-primary.png"
                    alt="Logo"
                    width={120}
                    height={40}
                    className="mx-auto hidden md:block"
                />
                <Image
                    src="/icon.png"
                    alt="Logo"
                    width={30}
                    height={40}
                    className="md:hidden"
                />
            </div>
            <div className="w-full" style={{ marginTop: "60px" }}>
                {linksToRender(menus)}
            </div>
        </>
    )
}
