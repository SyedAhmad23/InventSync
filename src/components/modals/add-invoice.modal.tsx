import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { useGetAllProductsQuery } from '@/feature/product/productApi'; // Update this path

type Product = {
    id: number;
    name: string;
    availableQty: number;
    unitCode: string;
    rate: number;
};

type InvoiceItem = {
    productId: number;
    quantity: number;
    discount: number;
    total: number;
};

const InvoiceModal: React.FC = () => {
    const { data: products, error, isLoading } = useGetAllProductsQuery();
    const [items, setItems] = useState<InvoiceItem[]>([]);
    const [date, setDate] = useState<Date | null>(null);
    const [customer, setCustomer] = useState<string>('');
    const [paymentType, setPaymentType] = useState<string>('');
    const [paidAmount, setPaidAmount] = useState<number>(0);

    const handleAddItem = () => {
        setItems([...items, { productId: 0, quantity: 0, discount: 0, total: 0 }]);
    };

    const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
        const newItems = [...items];
        newItems[index][field] = value;
        if (field === 'productId') {
            const product = products.find((p: Product) => p.id === value);
            if (product) {
                newItems[index].total = (product.rate * newItems[index].quantity) - newItems[index].discount;
            }
        }
        setItems(newItems);
    };

    const calculateTotals = () => {
        let totalDiscount = 0;
        let grandTotal = 0;

        items.forEach(item => {
            const product = products.find((p: Product) => p.id === item.productId);
            if (product) {
                item.total = (product.rate * item.quantity) - item.discount;
                totalDiscount += item.discount;
                grandTotal += item.total;
            }
        });

        return { totalDiscount, grandTotal };
    };

    const { totalDiscount, grandTotal } = calculateTotals();

    return (
        <Dialog>
            <DialogTrigger>
                <button>Add Invoice</button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Invoice</DialogTitle>
                </DialogHeader>
                <div>
                    <div>
                        <label>Customer</label>
                        <input
                            type="text"
                            placeholder="Customer"
                            value={customer}
                            onChange={(e) => setCustomer(e.target.value)}
                        />
                        <button>New Customer</button>
                    </div>
                    <div>
                        <label>Date</label>
                        <Calendar value={date} onChange={setDate} />
                    </div>
                    {items.map((item, index) => (
                        <div key={index}>
                            <select
                                value={item.productId}
                                onChange={(e) => handleItemChange(index, 'productId', parseInt(e.target.value))}
                            >
                                <option value={0}>Select Product</option>
                                {products?.data?.map((product: Product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                placeholder="Available Qty"
                                value={products.find((p: Product) => p.id === item.productId)?.availableQty || 0}
                                disabled
                            />
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                            />
                            <input
                                type="text"
                                placeholder="Unit Code"
                                value={products.find((p: Product) => p.id === item.productId)?.unitCode || ''}
                                disabled
                            />
                            <input
                                type="number"
                                placeholder="Rate"
                                value={products.find((p: Product) => p.id === item.productId)?.rate || 0}
                                disabled
                            />
                            <input
                                type="number"
                                placeholder="Discount"
                                value={item.discount}
                                onChange={(e) => handleItemChange(index, 'discount', parseFloat(e.target.value))}
                            />
                            <span>Total: {item.total}</span>
                            <button onClick={() => setItems(items.filter((_, i) => i !== index))}>Delete</button>
                        </div>
                    ))}
                    <button onClick={handleAddItem}>Add New Item</button>
                    <div>
                        <label>Total Discount: {totalDiscount}</label>
                    </div>
                    <div>
                        <label>Grand Total: {grandTotal}</label>
                    </div>
                    <div>
                        <label>Payment Type</label>
                        <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
                            <option value="">Select Payment Type</option>
                            <option value="cash">Cash</option>
                            <option value="card">Card</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label>Paid Amount</label>
                        <input
                            type="number"
                            value={paidAmount}
                            onChange={(e) => setPaidAmount(parseFloat(e.target.value))}
                        />
                    </div>
                    <div>
                        <label>Change: {paidAmount - grandTotal}</label>
                    </div>
                </div>
                <div>
                    <button onClick={() => Dialog.close()}>Cancel</button>
                    <button onClick={() => {/* Handle add invoice logic here */ }}>Add Invoice</button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InvoiceModal;