"use client";
import React, { useState, useEffect } from "react";
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
import { useForm } from "react-hook-form";
import Layout from "@/components/layout/layout";
import { CustomSelect } from "@/components/ui/custom-select";
import {
  useSearchProductsQuery,
  useGetProductDetailsQuery,
  useAddInvoiceMutation,
} from "@/feature/invoice/invoiceApi";
import { Product } from "@/types";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface InvoiceItem {
  product?: Product;
  available_quantity?: number;
  quantity?: string;
  unitCode?: string;
  price?: string;
  discountType?: string;
  discount?: string;
  total?: string;
}

const AddInvoice: React.FC = () => {
  const { register, handleSubmit } = useForm();
  const [items, setItems] = useState<InvoiceItem[]>([{}]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [isNewCustomer, setIsNewCustomer] = useState<boolean>(true);
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [date, setDate] = useState<Date | null>(null);
  const [totalPaid, setTotalPaid] = useState<number>(0);
  const { data: searchResults } = useSearchProductsQuery(searchTerm, {
    skip: !searchTerm,
  });
  const [addInvoice] = useAddInvoiceMutation();
  const router = useRouter();
  const { data: productDetails } = useGetProductDetailsQuery(
    selectedProductId!,
    {
      skip: !selectedProductId,
    }
  );

  const discountTypes = {
    fixed: "Fixed",
    percentage: "Percentage",
  };

  useEffect(() => {
    console.log("Product Details:", productDetails);
    if (productDetails) {
      setItems((prevItems) =>
        prevItems.map((item, i) =>
          i === items.length - 1
            ? {
                ...item,
                product: productDetails,
                available_quantity: productDetails.available_quantity,
                unitCode: productDetails.unitCode,
                price: productDetails.sellPrice.toString(),
              }
            : item
        )
      );
      setSelectedProductId(null);
      setSearchTerm("");
    }
  }, [productDetails, items.length]);

  const handleProductSelect = (product: Product) => {
    console.log("Selected Product ID:", product._id);
    setSelectedProductId(product._id);
    setSearchTerm(product.name);
    console.log("Selected Product Name:", product.name);
  };

  const addItem = () => {
    setItems([...items, {}]);
  };

  const removeItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const toggleCustomerType = () => {
    setIsNewCustomer((prev) => !prev);
  };

  const handleDiscountTypeChange = (value: string, index: number) => {
    setItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, discountType: value } : item
      )
    );
  };
  const onSubmit = async () => {
    const invoiceData = {
      customer_type: isNewCustomer ? "new" : "existing",
      customer: {
        customer_name: customerName,
        phone: customerPhone,
        email: customerEmail,
      },
      date: date ? date.toISOString() : null,
      products: items.map((item) => ({
        productId: item.product?._id,
        quantity: item.quantity || "0",
        discount: item.discount || "0",
        discount_type: item.discountType || discountTypes.fixed,
      })),
      totalPaid,
    };

    try {
      const response = await addInvoice(invoiceData).unwrap();
      console.log("Invoice added successfully:", response);
      toast.success("Invoice added successfully");
      router.push("/invoices");
    } catch (error) {
      console.error("Failed to add invoice:", error);
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Add Invoice</h2>
      <hr className="mb-4" />
      <form onSubmit={handleSubmit(onSubmit)} method="POST" action="/invoices">
        <div className="grid grid-cols-4 gap-5 my-5">
          <Input
            placeholder="Customer Name"
            className="mb-2"
            label="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          {isNewCustomer && (
            <>
              <Input
                placeholder="Customer Phone"
                className="mb-2"
                label="Customer Phone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
              <Input
                placeholder="Customer Email"
                className="mb-2"
                label="Customer Email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
            </>
          )}
          <Button className="mt-8" onClick={toggleCustomerType}>
            {isNewCustomer ? "New Customer" : "Old Customer"}
          </Button>
        </div>
        <DatePicker />

        <Table className="my-4">
          <TableHeader>
            <TableRow>
              <TableCell className="w-40">Product Name</TableCell>
              <TableCell>Available Qty</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Unit Code</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Discount Type</TableCell>
              <TableCell>Discount/Item</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="relative">
                    <Input
                      placeholder="Search product"
                      className="w-40"
                      value={item.product ? item.product.name : searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && searchResults && (
                      <ul className="fixed bg-white border mt-1 max-w-40 max-h-40 overflow-y-auto w-full z-50">
                        {searchResults.map((product) => (
                          <li
                            key={product._id}
                            onClick={() => handleProductSelect(product)}
                            className="cursor-pointer hover:bg-gray-200 p-2"
                          >
                            {product.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="Available Qty"
                    id={`available_quantity-${index}`}
                    value={item.available_quantity || ""}
                    readOnly
                  />
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="Quantity"
                    id={`quantity-${index}`}
                    value={item.quantity || ""}
                    onChange={(e) => {
                      const newQuantity = e.target.value;
                      if (
                        item.available_quantity &&
                        parseInt(newQuantity) > item.available_quantity
                      ) {
                        return;
                      }
                      setItems((prevItems) =>
                        prevItems.map((itm, i) =>
                          i === index ? { ...itm, quantity: newQuantity } : itm
                        )
                      );
                    }}
                    min={1}
                    max={item.available_quantity}
                  />
                </TableCell>

                <TableCell>
                  <Input
                    placeholder="Unit Code"
                    id={`unit_code-${index}`}
                    value={item.unitCode || ""}
                    readOnly
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
                  <CustomSelect
                    placeholder="Discount Type"
                    items={[discountTypes.fixed, discountTypes.percentage]}
                    onSelect={(value) => handleDiscountTypeChange(value, index)}
                    value={item.discountType || discountTypes.fixed}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    placeholder={
                      item.discountType === discountTypes.percentage
                        ? "Discount (%)"
                        : "Discount (Rs)"
                    }
                    id={`discount-${index}`}
                    value={item.discount || ""}
                    onChange={(e) =>
                      setItems((prevItems) =>
                        prevItems.map((itm, i) =>
                          i === index
                            ? { ...itm, discount: e.target.value }
                            : itm
                        )
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="Total"
                    id={`total-${index}`}
                    value={
                      item.quantity != null && item.price != null
                        ? (
                            (parseFloat(item.price) -
                              (item.discountType === discountTypes.percentage
                                ? parseFloat(item.price) *
                                  ((parseFloat(item.discount) ?? 0) / 100)
                                : parseFloat(item.discount) ?? 0)) *
                            parseFloat(item.quantity)
                          ).toFixed(2)
                        : ""
                    }
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
          <Input
            placeholder="Cash Taken"
            id="cash_taken"
            className="mb-2"
            value={totalPaid.toString()}
            onChange={(e) => setTotalPaid(parseInt(e.target.value))}
            min={1}
          />
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
      </form>
    </Layout>
  );
};

export default AddInvoice;
