import React from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeader,
} from "@/components/ui/table";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Invoice {
  _id: string;
  products: { name: string }[];
  totalAmount: number;
  paid: boolean;
  invoiceNumber: number;
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
    <div className="overflow-hidden bg-gray-500 text-white shadow sm:rounded-lg">
      <Table>
        <TableHeader className="bg-slate-200">
          <TableRow>
            <TableHead className="text-black">Invoice No</TableHead>
            <TableHead className="text-black">Status</TableHead>
            <TableHead className="text-black">Total Amount</TableHead>
            <TableHead className="text-black">Total Paid</TableHead>
            <TableHead className="text-black">Total Discount</TableHead>
            <TableHead className="text-black">Total Return</TableHead>
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
              <TableCell>{invoice.totalAmount}</TableCell>
              <TableCell>{invoice.totalPaid}</TableCell>
              <TableCell>{invoice.total_discount}</TableCell>
              <TableCell>{invoice.return_amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentInvoices;
