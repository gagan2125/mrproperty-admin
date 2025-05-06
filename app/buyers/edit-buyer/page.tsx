'use client'

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { DataTable } from "../data-table"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { IconArrowBigLeft } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function Page() {
    const router = useRouter()

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <div className="container mx-auto px-10">
                                <Button onClick={() => router.push('/buyers')}>
                                    <IconArrowBigLeft className="w-4 h-4" />
                                    Back
                                </Button>
                                <div className="mt-10 flex flex-col gap-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="grid w-full max-w-2xl items-center gap-1.5">
                                            <Label htmlFor="buyerName">Buyer Name *</Label>
                                            <Input type="text" id="buyerName" placeholder="Enter buyer name" />
                                        </div>
                                        <div className="grid w-full max-w-2xl items-center gap-1.5">
                                            <Label htmlFor="buyerEmail">Buyer Email</Label>
                                            <Input type="text" id="buyerEmail" placeholder="Enter buyer email" />
                                        </div>
                                        <div className="grid w-full max-w-2xl items-center gap-1.5">
                                            <Label htmlFor="buyerPhone">Buyer Phone *</Label>
                                            <Input type="text" id="buyerPhone" placeholder="Enter buyer phone" />
                                        </div>
                                        <div className="grid w-full max-w-2xl items-center gap-1.5">
                                            <Label htmlFor="buyerStatus">Buyer Status</Label>
                                            <Select>
                                                <SelectTrigger id="buyerStatus" className="w-full">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="active">Active</SelectItem>
                                                    <SelectItem value="inactive">Inactive</SelectItem>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5">
                                    <div className="grid w-full items-center gap-1.5">
                                        <Label htmlFor="aboutBuyer">About Buyer</Label>
                                        <Textarea 
                                            id="aboutBuyer" 
                                            placeholder="Enter details about the buyer" 
                                            className="min-h-[100px]"
                                        />
                                    </div>
                                </div>
                                <div className="flex mt-5 items-end justify-end">
                                    <Button>
                                        Update
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
