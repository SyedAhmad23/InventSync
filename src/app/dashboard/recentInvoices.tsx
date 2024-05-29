import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader } from '@/components/ui/table';
import { CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MdRemoveRedEye } from 'react-icons/md';

interface Invoice {
    _id: string;
    products: { name: string; }[];
    totalAmount: number;
    paid: boolean;
    invoiceNumber:number;
    totalPaid: number;
    total_discount: number;
    return_amount: number;
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
                <TableHead>Invoice No</TableHead>
                <TableHead>Status</TableHead>
                <TableHead >
                  Total Amount
                </TableHead>
                <TableHead>
                  Total Paid
                </TableHead>
                <TableHead >
                  Total Discount
                </TableHead>
                <TableHead >
                  Total Return
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((invoice: Invoice) => (
                <TableRow key={invoice._id}>
                  <TableCell className="font-medium">
                    {invoice.invoiceNumber}
                  </TableCell>
                  <TableCell>
                    <Button size="sm">Paid</Button>
                  </TableCell>
                  <TableCell>
                    {invoice.totalAmount}
                  </TableCell>
                  <TableCell>
                    {invoice.totalPaid}
                  </TableCell>
                  <TableCell>
                    {invoice.total_discount}
                  </TableCell>
                  <TableCell>
                    {invoice.return_amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
    );
};

export default RecentInvoices;
