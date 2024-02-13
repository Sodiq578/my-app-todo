import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./Product.css";

const Product = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productAddress, setProductAddress] = useState('');
  const [dollarRate, setDollarRate] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchDollarRate();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchDollarRate = () => {
    const apiUrl = 'https://api.exchangeratesapi.io/latest?base=USD';

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const usdToUzs = data.rates['UZS'];
        setDollarRate(usdToUzs);
      })
      .catch(error => {
        console.error('Valyuta kursini olishda xatolik:', error);
      });
  };

  const handleAddProduct = () => {
    const newProduct = {
      productName,
      purchasePrice,
      sellingPrice,
      productDescription,
      productAddress
    };
    setProducts([...products, newProduct]);
    setIsModalOpen(false);
    setProductName('');
    setPurchasePrice('');
    setSellingPrice('');
    setProductDescription('');
    setProductAddress('');
  };

  return (
    <div>
      <Link to="/">Products</Link>
      <div className='add__product-box'>
        <h2>Xozirgi dollar kursi: {dollarRate ? dollarRate.toFixed(2) : 'Ma\'lumot mavjud emas'} $</h2>
        <button className='add_product' onClick={() => setIsModalOpen(true)}>Add Product</button>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
            <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Maxsulot nomi" />
            <input type="text" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} placeholder="Olib kelingan narxi dollarda" />
            <input type="text" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} placeholder="Sotish narxi so'mda" />
            <input type="text" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} placeholder="Masulot xaqida" />
            <input type="text" value={productAddress} onChange={(e) => setProductAddress(e.target.value)} placeholder="Maxsulot olingan manzil yoki u xaqida maluot" />
            <button  onClick={handleAddProduct}>Add</button>
          </div>
        </div>
      )}

      <div className="wrap-table">
        <div className="table personal-styles">
          <div className="table__header">
            <div className="table__header__cell table__common-cell-1">Maxsulot nomi</div>
            <div className="table__header__cell table__common-cell-2">Olib kelingan narxi so'mda</div>
            <div className="table__header__cell table__common-cell-3">Sotish narxi So'mda</div>
            <div className="table__header__cell table__common-cell-4">Masulot xaqida</div>
            <div className="table__header__cell table__common-cell-4">Maxsulot olingan manzil yoki u xaqida maluot</div>
          </div>
          {products.map((product, index) => (
            <div className="table__row" key={index}>
              <div className="table__cell table__common-cell-1">{product.productName}</div>
              <div className="table__cell table__common-cell-2">{product.purchasePrice}</div>
              <div className="table__cell table__common-cell-3">{product.sellingPrice}</div>
              <div className="table__cell table__common-cell-4">{product.productDescription}</div>
              <div className="table__cell table__common-cell-4">{product.productAddress}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Product;
