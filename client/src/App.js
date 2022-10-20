import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [ allTransactions, setAllTransactions ] = useState(null);
  const [ newTransactionAdd, setNewTransactionAdd ] = useState(0);
  const [item, setItems] = useState("");
  const [price, setPrice] = useState(0); 
  
  useEffect(() => {
    axios
      .get('http://localhost:3010/transactions')
      .then(res => {
        setAllTransactions(res.data);
      })
      .catch(err => {
        console.log(err);
      }
    );
  }, [newTransactionAdd] );

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3010/transactions/${id}`)
      .then((res) => {
        setAllTransactions(allTransactions.filter(transaction => transaction.id !== id));
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3010/transactions", {
        item,
        price,
        record_time: new Date(),
      })
      .then((res) => {
        setNewTransactionAdd(newTransactionAdd + 1);
        console.log(res);
      })
      .catch((err) => console.log(err));
    setItems("");
    setPrice(0);
  };

  const calculateTotal = () => {
    let answer = 0;
    if(allTransactions && allTransactions.length > 0) {
      for (var trans of allTransactions) {
        answer += trans.price
      }
    }
    return answer.toFixed(2);
  }

  return (
    <div className="w-full ml-auto mr-auto md:w-3/4 lg:w-3/4">
      <h1 className="text-center text-2xl font-bold my-6">My Transactions</h1>
      <div>
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="flex flex-col justify-between bg-white shadow-md p-2 rounded-lg items-baseline mb-6 md:flex-row lg:flex-row"
        >
          <label htmlFor="item">Item: </label>
          <input
            type="text"
            id="item"
            value={item}
            onChange={(e) => setItems(e.target.value)}
            required
            className="border-b-2 border-orange-500"
          />
          <label htmlFor="price">Price: </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="border-b-2 border-orange-500"
          />
          <button className="mt-2 bg-green-500 hover:bg-green-700 text-white text-xs font-bold py-1 px-2 rounded md:mt-0 lg:mt-0">
            +
          </button>
        </form>
      </div>
      <table className="w-full text-center mb-6">
        <thead className="bg-white">
          <tr className="border-b-2 border-orange-500">
            <th className="py-1">Item</th>
            <th className="py-1">Price</th>
            <th className="py-1">Record Time</th>
            <th className="py-1">--</th>
          </tr>
        </thead>
        <tbody>
          {allTransactions?.length > 0 &&
            allTransactions.map((transaction) => (
              <tr
                key={transaction.trans_id}
                className="border-b-2 border-gray-500"
              >
                <td className="py-1">{transaction.item}</td>
                <td className="py-1">{transaction.price}</td>
                <td className="py-1">
                  {transaction.record_time.split("T")[0]}
                </td>
                <td className="py-1">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white text-xs font-bold py-1 px-2 rounded"
                    onClick={() => {
                      handleDelete(transaction.trans_id);
                    }}
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="text-right">
        <h2 className="text-xl font-bold">Total: ${calculateTotal()}</h2>
      </div>
    </div>
  );
};

export default App
