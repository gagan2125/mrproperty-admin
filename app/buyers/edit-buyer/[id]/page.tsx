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
import { useState, useEffect, use } from "react"
import { API_BASE_URL } from "@/lib/constants"
import { toast } from "sonner"

export default function EditBuyerPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const router = useRouter()
    const [buyerName, setBuyerName] = useState("")
    const [buyerEmail, setBuyerEmail] = useState("")
    const [buyerPhone, setBuyerPhone] = useState("")
    const [buyerStatus, setBuyerStatus] = useState("")
    const [buyerAbout, setBuyerAbout] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        phone: ''
    })
    const [hasErrors, setHasErrors] = useState(false)

    useEffect(() => {
        const fetchBuyer = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/buyers/get-buyer-by-id/${resolvedParams.id}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch buyer')
                }
                const buyer = await response.json()
                setBuyerName(buyer.buyer_name)
                setBuyerEmail(buyer.buyer_email)
                setBuyerPhone(buyer.buyer_phone)
                setBuyerStatus(buyer.buyer_status)
                setBuyerAbout(buyer.buyer_about)
            } catch (error) {
                console.error('Error fetching buyer:', error)
                toast.error('Failed to fetch buyer details')
                router.push('/buyers')
            } finally {
                setIsLoading(false)
            }
        }

        fetchBuyer()
    }, [resolvedParams.id, router])

    useEffect(() => {
        const hasAnyErrors = Object.values(errors).some(error => error !== '')
        const hasRequiredFields = buyerName.trim() !== '' && buyerPhone.trim() !== ''
        setHasErrors(hasAnyErrors || !hasRequiredFields)
    }, [errors, buyerName, buyerPhone])

    const validateForm = () => {
        const newErrors = {
            name: '',
            email: '',
            phone: ''
        }

        if (!buyerName.trim()) {
            newErrors.name = 'Name is required'
        }

        if (buyerEmail && !isValidEmail(buyerEmail)) {
            newErrors.email = 'Please enter a valid email address'
        }

        if (!buyerPhone) {
            newErrors.phone = 'Phone number is required'
        } else if (!isValidPhone(buyerPhone)) {
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
                buyer_name: buyerName,
                buyer_email: buyerEmail,
                buyer_phone: buyerPhone,
                buyer_status: buyerStatus,
                buyer_about: buyerAbout
            }

            const response = await fetch(`${API_BASE_URL}/buyers/update-buyer/${resolvedParams.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to update buyer')
            }

            const updatedBuyer = await response.json()
            toast.success("Buyer updated successfully")
            router.push('/buyers')
        } catch (error) {
            console.error('Error updating buyer:', error)
            toast.error(error instanceof Error ? error.message : "Failed to update buyer")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setBuyerEmail(value)
        if (value && !isValidEmail(value)) {
            setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }))
        } else {
            setErrors(prev => ({ ...prev, email: '' }))
        }
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setBuyerPhone(value)
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
        setBuyerName(value)
        if (!value.trim()) {
            setErrors(prev => ({ ...prev, name: 'Name is required' }))
        } else {
            setErrors(prev => ({ ...prev, name: '' }))
        }
    }

    if (isLoading) {
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
                    <div className="flex flex-1 flex-col items-center justify-center">
                        <p>Loading...</p>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        )
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
                                <Button onClick={() => router.push('/buyers')}>
                                    <IconArrowBigLeft className="w-4 h-4" />
                                    Back
                                </Button>
                                <div className="mt-10 flex flex-col gap-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="grid w-full max-w-2xl items-center gap-1.5">
                                            <Label htmlFor="buyerName">Buyer Name *</Label>
                                            <Input 
                                                type="text" 
                                                id="buyerName" 
                                                placeholder="Enter buyer name"
                                                value={buyerName}
                                                onChange={handleNameChange}
                                                required
                                                className={errors.name ? "border-red-500" : ""}
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-red-500 mt-1 font-medium">{errors.name}</p>
                                            )}
                                        </div>
                                        <div className="grid w-full max-w-2xl items-center gap-1.5">
                                            <Label htmlFor="buyerEmail">Buyer Email</Label>
                                            <Input 
                                                type="email" 
                                                id="buyerEmail" 
                                                placeholder="Enter buyer email"
                                                value={buyerEmail}
                                                onChange={handleEmailChange}
                                                className={errors.email ? "border-red-500" : ""}
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-red-500 mt-1 font-medium">{errors.email}</p>
                                            )}
                                        </div>
                                        <div className="grid w-full max-w-2xl items-center gap-1.5">
                                            <Label htmlFor="buyerPhone">Buyer Phone *</Label>
                                            <Input 
                                                type="tel" 
                                                id="buyerPhone" 
                                                placeholder="Enter 10-digit phone number"
                                                value={buyerPhone}
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
                                            <Label htmlFor="buyerStatus">Buyer Status</Label>
                                            <Select value={buyerStatus} onValueChange={setBuyerStatus}>
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
                                            value={buyerAbout}
                                            onChange={(e) => setBuyerAbout(e.target.value)}
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

// Validation functions
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