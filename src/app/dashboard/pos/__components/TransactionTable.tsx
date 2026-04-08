"use client";

import { Box, Button, Divider, IconButton, Stack, TextField, Typography, useTheme } from "@mui/material";
import { startTransition, useActionState, useEffect, useState } from "react";

import { CartType } from "@/types/POSTypes";
import { CloseIcon } from "@/constants/icons";
import GridTable from "@/components/ui/GridTable";
import addSalesAction from "@/actions/sales/add-sales-action";
import formatNumber from "@/utils/formatNumber";
import { toast } from "sonner";
import { useDialog } from "@/providers/DialogProvider";

// ---------- Receipt Sub-Component ----------
const Receipt = ({ customer, items, total }: { customer: string, items: CartType[], total: number }) => {
    const theme = useTheme();
    return (
        <Box sx={{ p: 1, minWidth: 300 }}>
            <Typography variant="h6" align="center" gutterBottom fontWeight="bold">
                TRANSACTION RECEIPT
            </Typography>
            <Typography variant="caption" display="block" align="center" sx={{ mb: 2, color: theme.palette.text.secondary }}>
                {new Date().toLocaleString()}
            </Typography>

            <Divider sx={{ borderStyle: 'dashed', my: 2 }} />

            <Typography variant="subtitle2">Customer: <b>{customer}</b></Typography>
            
            <Stack spacing={1} sx={{ my: 2 }}>
                {items.map((item, i) => (
                    <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">{item.quantity}x {item.name}</Typography>
                        <Typography variant="body2">{formatNumber(item.price * item.quantity, { currency: true })}</Typography>
                    </Box>
                ))}
            </Stack>

            <Divider sx={{ borderStyle: 'dashed', my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary.main">
                    {formatNumber(total, { currency: true })}
                </Typography>
            </Box>

            <Button 
                variant="outlined" 
                fullWidth 
                sx={{ mt: 3, display: 'print-none' }} 
                onClick={() => window.print()}
            >
                Print Receipt
            </Button>
        </Box>
    );
};

// ---------- Main TransactionTable ----------
export type TransactionProps = {
    area: string;
    carts: CartType[];
    onEditQuantityAction: (quantity: number, index: number) => void;
    onDeleteAction: (index: number) => void;
    onClearAction: () => void;
};

export default function TransactionTable({ area, carts, onEditQuantityAction, onClearAction, onDeleteAction }: TransactionProps) {
    const [prev, action, isLoading] = useActionState(addSalesAction, null);
    const { openDialog } = useDialog();
    const [clientName, setClientName] = useState('');
    const totalPrice = carts.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    useEffect(() => {
        if (!prev) return;
        if (prev.success) {
            // SHOW THE RECEIPT HERE
            openDialog(
                <Receipt 
                    customer={clientName} 
                    items={[...carts]} // Spread to pass a snapshot
                    total={totalPrice} 
                />, 
                { maxWidth: 'xs' }
            );

            toast.success('Transaction Completed');
            onClearAction();
            setClientName('');
        } else {
            toast.error(prev.error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [prev]);

    const handleOnSubmit = async () => {
        if (!clientName) return toast.error("Name not provided!");
        if (carts.length === 0) return toast.error("Please select at least one product!");

        const formData = new FormData();
        formData.append("customerName", clientName);
        formData.append("carts", JSON.stringify(carts));
        
        startTransition(() => action(formData));
    };

    return (
        <Box
            sx={{
                gridArea: area,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                height: "100%",
                overflow: "auto",
                "&::-webkit-scrollbar": { display: "none" },
            }}
        >
            <Button onClick={onClearAction} sx={{ alignSelf: "flex-end" }}>Clear</Button>

            <TextField 
                label="Customer Name" 
                fullWidth 
                variant="outlined" 
                size="small" 
                value={clientName} 
                onChange={(e) => setClientName(e.target.value)} 
                required 
            />

            <GridTable<{ name: string; price: number; quantity: number; total: number, action: unknown }>
                headers={[
                    { label: "name", displayLabel: "Product Name", size: 3, textAlign: "start" },
                    { label: "price", displayLabel: "Price", size: 3, textAlign: "center" },
                    { label: "quantity", displayLabel: "Qty", size: 1, textAlign: "center" },
                    { label: "total", displayLabel: "Sub Total", size: 4, textAlign: "end" },
                    { label: "action", displayLabel: "", size: 1, textAlign: "center" }
                ]}
                rows={carts.map((item) => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    total: item.price * item.quantity,
                    action: null,
                }))}
                renderRowAction={(product, column, index) => {
                    if (column.label === 'price') return (
                        <Typography textAlign={column.textAlign}>{formatNumber(product.price, {currency: true})}</Typography>
                    );
                    if (column.label === 'total') return (
                        <Typography textAlign={column.textAlign}>{formatNumber(product.total, {currency: true})}</Typography>
                    );
                    if (column.label === 'quantity') return (
                        <TextField
                            type="number"
                            size="small"
                            value={product.quantity}
                            onFocus={(e) => e.currentTarget.select()}
                            onChange={(e) => {
                                const parsed = parseInt(e.target.value.replaceAll(',', ''));
                                onEditQuantityAction(isNaN(parsed) || parsed < 1 ? 1 : parsed, index);
                            }}
                            sx={{ width: 80 }}
                        />
                    );
                    if (column.label === 'action') return (
                        <IconButton color="error" size="small" onClick={() => onDeleteAction(index)} sx={{ border: 1 }}>
                            <CloseIcon/>
                        </IconButton>
                    );
                    return null;
                }}
            />

            <Button 
                sx={{ mt: 2 }} 
                fullWidth 
                variant="contained" 
                size="large" 
                onClick={handleOnSubmit} 
                loading={isLoading}
            >
                Pay {formatNumber(totalPrice, { currency: true })}
            </Button>
        </Box>
    );
}