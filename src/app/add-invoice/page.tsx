"use client";
import React, { useState } from "react";
import { DatePicker } from "@/components/ui/date";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
  TableHeader,
} from "@/components/ui/table";
import Layout from "@/components/layout/layout";
import { useGetAllProductsQuery } from "@/feature/product/productApi";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/types";
import { CustomSelect } from "@/components/ui/custom-select";

interface InvoiceItem {
  product?: string;
  availableQuantity?: string;
  quantity?: string;
  unitCode?: string;
  price?: string;
  discount?: string;
  total?: string;
}

const AddInvoice: React.FC = () => {
  const { data, error, isLoading } = useGetAllProductsQuery();
  const finaldata = data?.products;

  const [items, setItems] = useState<InvoiceItem[]>([{}]);

  const addItem = () => {
    setItems([...items, {}]);
  };

  const removeItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleProductChange = (index: number, productId: string) => {
    const selectedProduct = finaldata?.find(
      (product: Product) => product.id === productId
    );

    if (selectedProduct) {
      console.log(
        "Selected Product:",
        selectedProduct.name,
        selectedProduct.id
      );

      const updatedItems = items.map((item, i) =>
        i === index
          ? {
              ...item,
              product: selectedProduct.id,
              availableQuantity: selectedProduct.quantity,
              price: selectedProduct.price,
            }
          : item
      );
      setItems(updatedItems);
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Add Invoice</h2>
      <hr className="mb-4" />
      <DatePicker />
      <Table className="my-4">
        <TableHeader>
          <TableRow>
            <TableCell>Product Name</TableCell>
            <TableCell>Available Qty</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Unit Code</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Discount/Item</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                {/* <Select
                  value={item.product || ""}
                  onValueChange={(value) => handleProductChange(index, value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue>
                      {item.product
                        ? finaldata?.find(
                            (product: Product) => product.id === item.product
                          )?.name
                        : "Select Product"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {finaldata?.map((product: Product) => (
                      <SelectGroup key={product.id}>
                        <SelectItem value={product.id}>
                          {product.name}
                        </SelectItem>
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select> */}
                <CustomSelect
                  placeholder="Select Product"
                  items={
                    finaldata?.map((product: Product) => product.name) || []
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  placeholder="Available Qty"
                  id={`available_quantity-${index}`}
                  value={item.availableQuantity || ""}
                  readOnly
                />
              </TableCell>
              <TableCell>
                <Input
                  placeholder="Quantity"
                  id={`quantity-${index}`}
                  min={1}
                  max={item.availableQuantity}
                />
              </TableCell>
              <TableCell>
                <Input
                  placeholder="Unit Code"
                  id={`unit_code-${index}`}
                  value={item.unitCode || ""}
                  onChange={(e) =>
                    setItems((prevItems) =>
                      prevItems.map((item, i) =>
                        i === index
                          ? { ...item, unitCode: e.target.value }
                          : item
                      )
                    )
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  placeholder="Price"
                  id={`price-${index}`}
                  value={item.price || ""}
                  readOnly
                />
              </TableCell>
              <TableCell>
                <Input
                  placeholder="Discount/Item"
                  id={`discount-${index}`}
                  value={item.discount || ""}
                  onChange={(e) =>
                    setItems((prevItems) =>
                      prevItems.map((item, i) =>
                        i === index
                          ? { ...item, discount: e.target.value }
                          : item
                      )
                    )
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  placeholder="Total"
                  id={`total-${index}`}
                  value={item.total || ""}
                  readOnly
                />
              </TableCell>
              <TableCell>
                <Button onClick={() => removeItem(index)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={addItem} className="mb-4">
        Add New Item
      </Button>
      <div className="mb-4">
        <Input
          placeholder="Total Discount"
          id="total_discount"
          className="mb-2"
        />
        <Input placeholder="Grand Total" id="grand_total" className="mb-2" />
        <Input placeholder="Cash Taken" id="cash_taken" className="mb-2" />
        <Input
          placeholder="Return Change"
          id="return_change"
          className="mb-2"
        />
      </div>
      <div className="flex space-x-2">
        <Button variant="secondary">Cancel</Button>
        <Button type="submit">Full Paid</Button>
      </div>
    </Layout>
  );
};

export default AddInvoice;
