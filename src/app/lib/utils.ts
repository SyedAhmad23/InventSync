export const calculateTotals = (
  items: {
    quantity: string;
    price: string;
    discount?: string;
    discountType?: string;
  }[],
  totalPaid: number,
  setError: (field: string, error: { type: string; message: string }) => void,
  clearErrors: (field: string) => void,
  discountTypes: { fixed: string; percentage: string },
  setTotalDiscount: (value: number) => void,
  setGrandTotal: (value: number) => void
): void => {
  let totalDiscount = 0;
  let grandTotal = 0;

  items.forEach((item) => {
    if (item.quantity && item.price) {
      const quantity = parseFloat(item.quantity);
      const price = parseFloat(item.price);
      const discount = item.discount ? parseFloat(item.discount) : 0;
      const discountAmount =
        item.discountType === discountTypes.percentage
          ? (price * discount) / 100
          : discount;
      const total = (price - discountAmount) * quantity;

      totalDiscount += discountAmount;
      grandTotal += total;
    }
  });

  setTotalDiscount(totalDiscount);
  setGrandTotal(grandTotal);

  if (totalPaid < grandTotal) {
    setError("totalPaid", {
      type: "manual",
      message: "Total paid should be equal to or greater than the grand total",
    });
  } else {
    clearErrors("totalPaid");
  }
};

const discountTypes: {
  fixed: string;
  percentage: string;
} = {
  fixed: "fixed",
  percentage: "percentage",
};

export const calculateValue = (item: {
  quantity: string;
  price: string;
  discountType?: string;
  discount?: string;
}): string => {
  if (item.quantity != null && item.price != null) {
    const price = parseFloat(item.price);
    const quantity = parseFloat(item.quantity);
    const totalPrice = price * quantity;
    const discountAmount =
      item.discountType === discountTypes.percentage
        ? (totalPrice * (item.discount ? parseFloat(item.discount) : 0)) / 100
        : (item.discount ? parseFloat(item.discount) : 0) * quantity;
    const finalPrice = totalPrice - discountAmount;

    return finalPrice.toFixed(2);
  }
  return "0.00";
};
