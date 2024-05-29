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
  useGetCustomerDetailsQuery,
  useSearchCustomersQuery,
} from "@/feature/invoice/invoiceApi";
import { Customer, Product } from "@/types";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { calculateTotals, calculateValue } from "../lib/utils";

interface InvoiceItem {
  product?: Product;
  available_quantity?: number;
  quantity?: number;
  unitCode?: string;
  price?: string;
  discountType?: string;
  discount?: number;
  total?: string;
  customer?: Customer;
}

const AddInvoice: React.FC = () => {
  const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm();
  const [items, setItems] = useState<InvoiceItem[]>([{}]);
  const [productSearchTerm, setProductSearchTerm] = useState<string>("");
  const [customerSearchTerm, setCustomerSearchTerm] = useState<string>("");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );
  const [isNewCustomer, setIsNewCustomer] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [totalPaid, setTotalPaid] = useState<number>(0);
  const [totalDiscount, setTotalDiscount] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [customerDetails, setCustomerDetails] = useState<Customer | null>(null);
  const { data: searchResults } = useSearchProductsQuery(productSearchTerm, {
    skip: !productSearchTerm,
  });
  const [addInvoice] = useAddInvoiceMutation();
  const router = useRouter();
  const { data: productDetails } = useGetProductDetailsQuery(
    selectedProductId!,
    {
      skip: !selectedProductId,
    }
  );
  const { data: searchCustoemrs } = useSearchCustomersQuery(customerSearchTerm, {
    skip: !customerSearchTerm,
  });

  const handleCustomerSelect = async (customer: Customer) => {
    console.log("Selected Customer ID:", customer.id);
    setSelectedCustomerId(customer.id || null);
    //@ts-ignore
    setCustomerSearchTerm(customer.name);
    console.log("Selected Customer Name:", customer.name);

    try {
      //@ts-ignore
      const response = await useGetCustomerDetailsQuery(customer.id).unwrap();
      setCustomerDetails(response);
    } catch (error) {
      console.error("Failed to fetch customer details:", error);
    }
  };

  useEffect(() => {
    if (selectedCustomerId) {
      const fetchCustomerDetails = async () => {
        //@ts-ignore
        const response = await useGetCustomerDetailsQuery(selectedCustomerId).unwrap();
        setCustomerDetails(response);
      };
      fetchCustomerDetails();
    }
  }, [selectedCustomerId]);

  const discountTypes = {
    fixed: "fixed",
    percentage: "percentage",
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
      setProductSearchTerm("");
    }
  }, [productDetails, items.length]);

  const handleProductSelect = (product: Product) => {
    console.log("Selected Product ID:", product._id);
    setSelectedProductId(product._id);
    setProductSearchTerm(product.name);
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

  useEffect(() => {
    //@ts-ignore
    calculateTotals(items, totalPaid, setError, clearErrors, discountTypes, setTotalDiscount, setGrandTotal);
  }, [items, totalPaid]);


  const onSubmit = async () => {
    if (totalPaid < grandTotal) {
      setError("totalPaid", {
        type: "manual",
        message: "Total paid should be equal to or greater than the grand total",
      });
      return;
    }
    const invoiceData = {
      customer_type: isNewCustomer ? "new" : "old",
      customer: isNewCustomer ? {
        customer_name: customerName,
        phone: customerPhone,
        email: customerEmail,
      } : { _id: selectedCustomerId },
      date: date ? date.toISOString() : null,
      products: items.map((item) => ({
        //@ts-ignore
        productId: item.product && item.product.id,
        quantity: item.quantity || 0,
        discount: item.discount || 0,
        discount_type: item.discountType || discountTypes.fixed,
      })),
      totalPaid,
    };

    try {
      //@ts-ignore
      const response = await addInvoice(invoiceData).unwrap();
      console.log("Invoice added successfully:", response);
      toast.success("Invoice added successfully");
      router.push("/invoices");
    } catch (error) {
      console.error("Failed to add invoice:", error);
    }
  };

  const handleQuantityChange = (value: string, index: number) => {
    const newQuantity = parseFloat(value);
    const availableQuantity = items[index].available_quantity ?? 0;

    if (newQuantity > availableQuantity) {
      setError(`quantity-${index}`, {
        type: "manual",
        message: "Quantity should be equal or less than the available qty",
      });
    } else {
      clearErrors(`quantity-${index}`);
    }

    setItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleDiscountChange = (value: string, index: number) => {
    const newDiscount = parseFloat(value);

    setItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, discount: newDiscount } : item
      )
    );
  };


  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Add Invoice</h2>
      <hr className="mb-4" />
      <form onSubmit={handleSubmit(onSubmit)} method="POST" action="/invoices">
        <div className="grid grid-cols-4 gap-5 my-5">
          {!isNewCustomer && (
            <>
              <Input
                placeholder="Customer Name"
                className="mb-2"
                label="Select Customer"
                value={customerSearchTerm}
                onChange={(e) => setCustomerSearchTerm(e.target.value)}
              />
              <ul className="fixed border mt-20 bg-white max-w-40 max-h-40 overflow-y-auto w-full z-50">
                {customerSearchTerm && searchCustoemrs?.map((customer) => (
                  <li key={customer.id} onClick={() => handleCustomerSelect(customer)} className="cursor-pointer hover:bg-gray-200 p-2"
                  >
                    {customer.name}
                  </li>
                ))}
              </ul>
            </>
          )}
          {isNewCustomer && (
            <>
              <Input
                placeholder="Customer Name"
                className="mb-2"
                label="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
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
          <Button onClick={() => setIsNewCustomer((prev) => !prev)} className="mt-8">
            {isNewCustomer ? "Old Customer" : "New Customer"}
          </Button>
        </div>
        <DatePicker date={date} setDate={setDate} />

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
                      value={item.product ? item.product.name : productSearchTerm}
                      onChange={(e) => setProductSearchTerm(e.target.value)}
                    />
                    {productSearchTerm && searchResults && (
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
                    disabled
                  />
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="Quantity"
                    id={`quantity-${index}`}
                    value={item.quantity || ""}
                    onChange={(e) => handleQuantityChange(e.target.value, index)}
                    min={1}
                    max={item.available_quantity}
                  />
                  {errors[`quantity-${index}`] && (
                    <span className="text-red-500 text-xs absolute w-40">
                      {(errors[`quantity-${index}`]?.message)?.toString()}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="Unit Code"
                    id={`unit_code-${index}`}
                    value={item.unitCode || ""}
                    disabled
                  />
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="Price"
                    id={`price-${index}`}
                    value={item.price || ""}
                    disabled
                  />
                </TableCell>
                <TableCell>
                  <CustomSelect
                    placeholder="Discount Type"
                    items={[discountTypes.fixed, discountTypes.percentage]}
                    onSelect={(value) => handleDiscountTypeChange(value, index)}
                    //@ts-ignore
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
                    value={item.discount || 0}
                    onChange={(e) =>
                      handleDiscountChange(e.target.value, index)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="Total"
                    id={`total-${index}`}
                    //@ts-ignore
                    value={calculateValue(item)}
                    disabled
                  />
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                  >
                    Delete
                  </Button>
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
            value={totalDiscount.toFixed(2)}
            disabled
          />
          <Input
            placeholder="Grand Total"
            id="grand_total"
            className="mb-2"
            value={grandTotal.toFixed(2)}
            disabled
          />
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
            value={(totalPaid > grandTotal ? totalPaid - grandTotal : 0).toFixed(2)}
            disabled
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
