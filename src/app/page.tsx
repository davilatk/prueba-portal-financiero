"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

/**
 * Pagina de inicio de sesión
 *
 * @export
 * @returns {JSX.Element} 
 */
export default function Page() {
    const router = useRouter()

    useEffect(() => {
        router.replace("/login")
    }, [router]);

    return null
}
