'use client'

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
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
import { useState, useEffect } from "react"
import { API_BASE_URL } from "@/lib/constants"
import { toast } from "sonner"

const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return email === '' || emailRegex.test(email)
}

const isValidPhone = (phone: string) => {
    const digitsOnly = phone.replace(/\D/g, '')
    if (digitsOnly.length !== 10) {
        return false
    }
    const phoneRegex = /^(\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/
    return phoneRegex.test(phone)
}

export default function Page() {
    const router = useRouter()
    const [sellerName, setSellerName] = useState("")
    const [sellerEmail, setSellerEmail] = useState("")
    const [sellerPhone, setSellerPhone] = useState("")
    const [sellerStatus, setSellerStatus] = useState("")
    const [sellerAbout, setSellerAbout] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        phone: ''
    })
    const [hasErrors, setHasErrors] = useState(false)

    useEffect(() => {
        const hasAnyErrors = Object.values(errors).some(error => error !== '')
        const hasRequiredFields = sellerName.trim() !== '' && sellerPhone.trim() !== ''
        setHasErrors(hasAnyErrors || !hasRequiredFields)
    }, [errors, sellerName, sellerPhone])

    const validateForm = () => {
        const newErrors = {
            name: '',
            email: '',
            phone: ''
        }

        if (!sellerName.trim()) {
            newErrors.name = 'Name is required'
        }

        if (sellerEmail && !isValidEmail(sellerEmail)) {
            newErrors.email = 'Please enter a valid email address'
        }

        if (!sellerPhone) {
            newErrors.phone = 'Phone number is required'
        } else if (!isValidPhone(sellerPhone)) {
            newErrors.phone = 'Please enter a valid 10-digit phone number'
        }

        setErrors(newErrors)
        return !Object.values(newErrors).some(error => error !== '')
    }

    const handleSubmit = async () => {
        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)
        try {
            const payload = {
                seller_name: sellerName,
                seller_email: sellerEmail,
                seller_phone: sellerPhone,
                seller_status: sellerStatus,
                seller_about: sellerAbout
            }

            const response = await fetch(`${API_BASE_URL}/sellers/add-seller`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                throw new Error('Failed to add buyer')
            }

            toast.success("Seller added successfully")
            router.push('/sellers')
        } catch (error) {
            console.error('Error adding seller:', error)
            toast.error("Failed to add seller")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSellerEmail(value)
        if (value && !isValidEmail(value)) {
            setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }))
        } else {
            setErrors(prev => ({ ...prev, email: '' }))
        }
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSellerPhone(value)
        if (!value) {
            setErrors(prev => ({ ...prev, phone: 'Phone number is required' }))
        } else if (!isValidPhone(value)) {
            setErrors(prev => ({ ...prev, phone: 'Please enter a valid 10-digit phone number' }))
        } else {
            setErrors(prev => ({ ...prev, phone: '' }))
        }
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSellerName(value)
        if (!value.trim()) {
            setErrors(prev => ({ ...prev, name: 'Name is required' }))
        } else {
            setErrors(prev => ({ ...prev, name: '' }))
        }
    }

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
                                <Button onClick={() => router.push('/sellers')}>
                                    <IconArrowBigLeft className="w-4 h-4" />
                                    Back
                                </Button>
                                <div className="mt-10 flex flex-col gap-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="grid w-full max-w-2xl items-center gap-1.5">
                                            <Label htmlFor="buyerName">Seller Name *</Label>
                                            <Input
                                                type="text"
                                                id="buyerName"
                                                placeholder="Enter seller name"
                                                value={sellerName}
                                                onChange={handleNameChange}
                                                required
                                                className={errors.name ? "border-red-500" : ""}
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-red-500 mt-1 font-medium">{errors.name}</p>
                                            )}
                                        </div>
                                        <div className="grid w-full max-w-2xl items-center gap-1.5">
                                            <Label htmlFor="buyerEmail">Seller Email</Label>
                                            <Input
                                                type="email"
                                                id="buyerEmail"
                                                placeholder="Enter seller email"
                                                value={sellerEmail}
                                                onChange={handleEmailChange}
                                                className={errors.email ? "border-red-500" : ""}
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-red-500 mt-1 font-medium">{errors.email}</p>
                                            )}
                                        </div>
                                        <div className="grid w-full max-w-2xl items-center gap-1.5">
                                            <Label htmlFor="buyerPhone">Seller Phone *</Label>
                                            <Input
                                                type="tel"
                                                id="buyerPhone"
                                                placeholder="Enter 10-digit phone number"
                                                value={sellerPhone}
                                                onChange={handlePhoneChange}
                                                required
                                                maxLength={14}
                                                className={errors.phone ? "border-red-500" : ""}
                                            />
                                            {errors.phone && (
                                                <p className="text-sm text-red-500 mt-1 font-medium">{errors.phone}</p>
                                            )}
                                        </div>
                                        <div className="grid w-full max-w-2xl items-center gap-1.5">
                                            <Label htmlFor="buyerStatus">Seller Status</Label>
                                            <Select value={sellerStatus} onValueChange={setSellerStatus}>
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
                                        <Label htmlFor="aboutBuyer">About Seller</Label>
                                        <Textarea
                                            id="aboutBuyer"
                                            placeholder="Enter details about the seller"
                                            className="min-h-[100px]"
                                            value={sellerAbout}
                                            onChange={(e) => setSellerAbout(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="flex mt-5 items-end justify-end">
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting || hasErrors}
                                        className={hasErrors ? "opacity-50 cursor-not-allowed" : ""}
                                    >
                                        {isSubmitting ? "Saving..." : "Save"}
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
