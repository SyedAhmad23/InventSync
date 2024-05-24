import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader } from '@/components/ui/table';
import { CardTitle } from '@/components/ui/card';

interface Invoice {
    _id: string;
    products: { name: string; }[];
    totalAmount: number;
    paid: boolean;
    createdAt: string;
}

interface TableProps {
    data: Invoice[] | undefined;
}

const RecentInvoices: React.FC<TableProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return <CardTitle>No recent invoices available</CardTitle>;
    }

    return (
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Id</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((invoice) => (
                        <TableRow key={invoice._id}>
                            {/* <TableCell>{invoice.products.every((product) => product.name)}</TableCell> */}
                            <TableCell>{invoice._id}</TableCell>
                            <TableCell>{new Date(invoice.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>{invoice.totalAmount}</TableCell>
                            <TableCell>{invoice.paid ? 'Paid' : 'Unpaid'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default RecentInvoices;
