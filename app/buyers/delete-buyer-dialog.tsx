"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface DeleteBuyerDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    buyerName: string
    isDeleting: boolean
}

export function DeleteBuyerDialog({
    isOpen,
    onClose,
    onConfirm,
    buyerName,
    isDeleting
}: DeleteBuyerDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete Buyer</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete {buyerName}'s information? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isDeleting}>
                        Cancel
                    </Button>
                    <Button 
                        variant="destructive" 
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 