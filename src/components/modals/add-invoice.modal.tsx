import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { useGetAllProductsQuery } from "@/feature/product/productApi";
import { DatePicker } from "../ui/date";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { MdRemoveRedEye, MdAdd } from "react-icons/md";
import { Table, TableCell, TableRow } from "../ui/table";

const InvoiceModal: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <MdAdd className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Invoice
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className=" text-2xl font-semibold ">
          Add Invoice
        </DialogHeader>
        <hr />
        <DatePicker />
        <Table>
          <TableRow>
            <TableCell>
              <Input
                label="Product Name"
                id="name"
                defaultValue="Pedro Duarte"
              />
            </TableCell>
            <TableCell>
              <Input
                label="Available Qty"
                id="available_quantity"
                defaultValue=""
              />
            </TableCell>
            <TableCell>
              <Input label="Quantity" id="quantity" defaultValue="" />
            </TableCell>
            <TableCell>
              <Input label="Unit Code" id="unit_code" defaultValue="" />
            </TableCell>
            <TableCell>
              <Input label="Price" id="price" defaultValue="" />
            </TableCell>
            <TableCell>
              <Input
                label="Discount/Item"
                id="available_quantity"
                defaultValue=""
              />
            </TableCell>
            <TableCell>
              <Input label="Total" id="total" defaultValue="" />
            </TableCell>
            <TableCell>
              <Button>Delete</Button>
            </TableCell>
          </TableRow>
        </Table>
        <DialogFooter>
          <Button>Cancel</Button>
          <Button type="submit">Add Invoice</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModal;
