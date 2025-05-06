"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"
import { useState } from "react"
import { postData } from "@/lib/api"
import { API_BASE_URL } from "@/lib/constants"
import { toast } from "sonner"

interface AddFieldDialogProps {
    onFieldAdded: () => void
}

export function AddFieldDialog({ onFieldAdded }: AddFieldDialogProps) {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState<string>("");
    const [tag, setTag] = useState<string>("")

    const handleSubmit = async () => {
        try {
            const payload = {
                title,
                description,
                category: tag,
                type
            };
            await postData(`${API_BASE_URL}/fields/add-field`, payload);
            toast.success("Field added successfully");
            setOpen(false);
            setTitle("");
            setDescription("");
            setTag("");
            setType("");
            onFieldAdded(); // Trigger table refresh
        } catch (err) {
            console.error("Submit error:", err);
            toast.error("Failed to add field");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4" />
                    Add field
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>New Field</DialogTitle>
                    <DialogDescription>
                        Add a new field to your library.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Title
                        </Label>
                        <Input
                            id="name"
                            placeholder="Field title"
                            className="col-span-3"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="description" className="text-right pt-2">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Field description"
                            className="col-span-3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">
                            Category
                        </Label>
                        <Select value={tag} onValueChange={setTag}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="buyer">Buyer</SelectItem>
                                <SelectItem value="seller">Seller</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Type</Label>
                        <div className="col-span-3 space-y-2">
                            {["input", "textarea", "upload"].map((t) => (
                                <div key={t} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={t}
                                        checked={type === t}
                                        onCheckedChange={() => setType(t)}
                                    />
                                    <Label htmlFor={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</Label>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} type="submit">Add</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 