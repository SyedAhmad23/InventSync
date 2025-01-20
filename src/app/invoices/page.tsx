"use client";
import React from "react";
import Layout from "@/components/layout/layout";
import { MdRemoveRedEye, MdAdd } from "react-icons/md";
import { Invoice } from "@/types";
import { useDispatch } from "react-redux";
import { openModal, closeModal } from "@/feature/modal/modalSlice";
import { toast } from "react-toastify";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDeleteInvoiceMutation,
  useGetAllInvoicesQuery,
  useUpdateInvoiceMutation,
} from "@/feature/invoice/invoiceApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const InvoicePage: React.FC = () => {
  const { data, error, isLoading } = useGetAllInvoicesQuery();
  const [deleteInvoice] = useDeleteInvoiceMutation();
  const [updateInvoice, { isLoading: isLoadingUpdate }] =
    useUpdateInvoiceMutation();
  const router = useRouter();
  const dispatch = useDispatch();
  //@ts-ignore
  const finaldata = data;
  console.log(finaldata);
  if (error) return <Layout>Error...</Layout>;

  const handleDeleteInvoice = async (id: string) => {
    try {
      await deleteInvoice({ id }).unwrap();
      toast.success("Invoice deleted successfully");
      dispatch(closeModal());
    } catch (error) {
      toast.error("Failed to delete Invoice");
    }
  };

  const onDeleteCategory = (id: string) => {
    dispatch(
      openModal({
        view: "DELETE_PERMISSION",
        data: {
          title: "Delete Invoice",
          id,
          onConfirm: () => handleDeleteInvoice(id),
        },
      })
    );
  };

  const handleUpdateInvoice = (selectedInvoice: Invoice) => {
    router.push(`/update-invoice?id=${selectedInvoice._id}`);
  };

  return (
    <Layout>
      <div className="flex items-center">
        <div className="ml-auto flex items-center gap-2">
          <Link href="/add-invoice">
            <Button size="sm" className="h-8 gap-1">
              <MdAdd className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Invoice
              </span>
            </Button>
          </Link>
        </div>
      </div>
      <Card className="mt-10">
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>
            Manage your Invoices and view their sales performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice No</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Total Paid</TableHead>
                <TableHead>Total Discount</TableHead>
                <TableHead>Total Return</TableHead>
                <TableHead>
                  <span>Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            {isLoading ? (
              <TableBody>
                {Array(4)
                  .fill(0)
                  .map((_, rowIndex) => (
                    <TableRow key={`skeleton-row-${rowIndex}`}>
                      <TableCell>
                        <Skeleton className="h-6 w-20 rounded-sm" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-32 rounded-sm" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-32 rounded-sm" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-32 rounded-sm" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-32 rounded-sm" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-full rounded-sm" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-10 rounded-sm" />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            ) : (
              <TableBody>
                {finaldata?.map((invoice: Invoice) => (
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
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MdRemoveRedEye className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {/* <DropdownMenuItem
                          onClick={() => handleUpdateInvoice(invoice)}
                        >
                          Update
                        </DropdownMenuItem> */}
                          <DropdownMenuItem
                            onClick={() => onDeleteCategory(invoice._id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default InvoicePage;
