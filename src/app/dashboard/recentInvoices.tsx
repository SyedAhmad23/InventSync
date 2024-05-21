import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader } from '@/components/ui/table';

const RecentInvoices = () => {
    const invoices = [
        { id: 1, name: 'Mr test', number: 91, amount: 23000, status: 'Unpaid' },
        { id: 2, name: 'Miss Kelly', number: 90, amount: 157, status: 'Paid' },
        { id: 3, name: 'talha', number: 89, amount: 0, status: 'Paid' },
        { id: 4, name: 'Mr jhon', number: 87, amount: 800, status: 'Paid' },
        { id: 5, name: '657', number: 85, amount: 600, status: 'Unpaid' },
        { id: 6, name: 'Miss Kelly', number: 84, amount: 104.8, status: 'Paid' },
        { id: 7, name: 'umair', number: 83, amount: 6000, status: 'Unpaid' },
        { id: 8, name: 'Mustapha', number: 82, amount: 6000, status: 'Unpaid' },
        { id: 9, name: 'Mustapha', number: 81, amount: 230000, status: 'Paid' },
    ];

    return (
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
            <Table>
                <TableHeader className="w-[100px]">
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Number</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                            <TableCell>{invoice.name}</TableCell>
                            <TableCell>{invoice.number}</TableCell>
                            <TableCell>{invoice.amount}</TableCell>
                            <TableCell>{invoice.status}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default RecentInvoices;
