import React from 'react';

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
        <div className="overflow-hidden bg-white shadow sm:rounded-lg whitespace-nowrap">
            <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-200 text-black text-xs font-medium ">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left  uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left  uppercase tracking-wider">
                                            Number
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left  uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left  uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {invoices.map((invoice) => (
                                        <tr key={invoice.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{invoice.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{invoice.number}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{invoice.amount}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{invoice.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecentInvoices;
