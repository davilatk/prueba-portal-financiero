'use client';

import { Bell, X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotificationStore } from "@/store/useNotificationStore";

export default function NotificationPanel() {
    const { notifications, removeNotification } = useNotificationStore();
    const hasNotifications = notifications.length > 0;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className={`h-5 w-5 transition-colors ${hasNotifications ? 'text-red-600' : 'text-gray-500'}`} />
                    {hasNotifications && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] rounded-full"
                        >
                            {notifications.length}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50/50">
                    <h4 className="font-semibold text-sm">Notificaciones</h4>
                    {hasNotifications && (
                        <span className="text-xs text-muted-foreground">
                            {notifications.length} nuevas
                        </span>
                    )}
                </div>

                {/* 4. Área de scroll para la lista */}
                <ScrollArea className="h-[300px]">
                    {hasNotifications ? (
                        <div className="flex flex-col">
                            {notifications.map((notifica) => (
                                <div
                                    key={notifica.id}
                                    className="flex items-start gap-3 px-4 py-3 border-b hover:bg-gray-50 transition-colors relative group"
                                >
                                    <div className="mt-1">
                                        {notifica.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                                        {notifica.type === 'error' && <AlertCircle className="h-4 w-4 text-red-600" />}
                                        {notifica.type === 'info' && <Info className="h-4 w-4 text-blue-600" />}
                                    </div>

                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {notifica.type === 'error' ? 'Error' : notifica.type === 'success' ? 'Éxito' : 'Info'}
                                        </p>
                                        <p className="text-xs text-muted-foreground break-words">
                                            {notifica.message}
                                        </p>
                                    </div>

                                    {/* Botón para eliminar */}
                                    <button
                                        onClick={() => removeNotification(notifica.id)}
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded-full"
                                    >
                                        <X className="h-3 w-3 text-gray-500" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[200px] text-center px-4">
                            <Bell className="h-8 w-8 text-gray-300 mb-2" />
                            <p className="text-sm text-gray-500 font-medium">No tienes notificaciones</p>
                            <p className="text-xs text-gray-400">Te avisaremos cuando haya actividad.</p>
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}