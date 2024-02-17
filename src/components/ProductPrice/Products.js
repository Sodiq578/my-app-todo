import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./Product.css";
import Header from '../../layout/Header';

const Product = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState(
    JSON.parse(localStorage.getItem('products')) || []
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [productName, setProductName] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productAddress, setProductAddress] = useState('');
  const [dollarRatePrompt, setDollarRatePrompt] = useState(false);
  const [dollarRate, setDollarRate] = useState(12486); // 1 doların Uzbek som'ı karşılığı
  const [editingItemIndex, setEditingItemIndex] = useState(null); // Yangi o'zgartirish uchun tartib raqami

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchDollarRate();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const fetchDollarRate = () => {
    // Döviz kuru almak için API çağrısı yapılmayacak, çünkü sabit bir değer kullanıyoruz
  };

  const handleAddProduct = () => {
    if (!productName || !purchasePrice || !productDescription || !productAddress) {
      alert("Barcha maydonlarni to'ldiring!");
      return;
    }
  
    const purchasePriceUSD = Number(purchasePrice);
    const sellingPriceUZS = purchasePriceUSD * dollarRate;
  
    const newProduct = {
      productName,
      purchasePrice: purchasePriceUSD,
      sellingPrice: sellingPriceUZS,
      productDescription,
      productAddress
    };
    setProducts([...products, newProduct]);
    setIsModalOpen(false);
    clearInputs();
  };
  
  const clearInputs = () => {
    setProductName('');
    setPurchasePrice('');
    setProductDescription('');
    setProductAddress('');
  };

  const handleDeleteProduct = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  const handleEditProduct = (index, updatedProduct) => {
    const updatedProducts = [...products];
    updatedProducts[index] = updatedProduct;
    setProducts(updatedProducts);
  };

  const handleDollarRateChange = () => {
    if (window.confirm("Dollar kursini o'zgartirmoqchimisiz?")) {
      setDollarRatePrompt(true);
    }
  };

  const handleEditButtonClick = (index) => {
    setEditingItemIndex(index);
    const productToEdit = products[index];
    setProductName(productToEdit.productName);
    setPurchasePrice(productToEdit.purchasePrice);
    setProductDescription(productToEdit.productDescription);
    setProductAddress(productToEdit.productAddress);
    setIsModalOpen(true);
  };

  const handleEditConfirm = () => {
    const updatedProducts = [...products];
    const purchasePriceUSD = Number(purchasePrice);
    const sellingPriceUZS = purchasePriceUSD * dollarRate;
    updatedProducts[editingItemIndex] = {
      productName,
      purchasePrice: purchasePriceUSD,
      sellingPrice: sellingPriceUZS,
      productDescription,
      productAddress
    };
    setProducts(updatedProducts);
    setIsModalOpen(false);
    setEditingItemIndex(null);
    clearInputs();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingItemIndex(null);
    clearInputs();
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div>
      <Header className="header" />
      <div className='add__product-box'>
      
          <input
            type="text"
            placeholder="Qidiruv..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
          <h2 className='dollar-title'>Xozirgi dollar kursi: 1 USD = {dollarRate} UZS</h2>
      
        <div className="searchbtn-box-product">
          <button className='add_product' onClick={() => setIsModalOpen(true)}>Add Product</button>
          <button onClick={handleDollarRateChange}>Change Dollar Rate</button>
        </div>
        {dollarRatePrompt && (
          <div>
            <input type="number" value={dollarRate} onChange={(e) => setDollarRate(e.target.value)} />
            <button onClick={() => setDollarRatePrompt(false)}>Confirm</button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
            <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Product Name" />
            <input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} placeholder="Purchase Price in USD" />
            <input type="text" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} placeholder="Product Description" />
            <input type="text" value={productAddress} onChange={(e) => setProductAddress(e.target.value)} placeholder="Product Address or Additional Info" />
            <button onClick={editingItemIndex !== null ? handleEditConfirm : handleAddProduct}>
              {editingItemIndex !== null ? 'Confirm' : 'Add'}
            </button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}

      <div className="wrap-table">
        <div className="table personal-styles">
          <div className="table__header">
            <div className="table__header__cell table__common-cell-1">Product Name</div>
            <div className="table__header__cell table__common-cell-2">Purchase Price in USD</div>
            <div className="table__header__cell table__common-cell-3">Selling Price in UZS</div>
            <div className="table__header__cell table__common-cell-4">Product Description</div>
            <div className="table__header__cell table__common-cell-4">Product Address or Additional Info</div>
            <div className="table__header__cell table__common-cell-4">Actions</div>
          </div>
          {products.filter(product =>
            product.productName.toLowerCase().includes(searchQuery.toLowerCase())
          ).map((product, index) => (
            <div className="table__row" key={index}>
              <div className="table__cell table__common-cell-1">{product.productName}</div>
              <div className="table__cell table__common-cell-2">{product.purchasePrice} $</div>
              <div className="table__cell table__common-cell-3">{product.sellingPrice}</div>
              <div className="table__cell table__common-cell-4">{product.productDescription}</div>
              <div className="table__cell table__common-cell-4">{product.productAddress}</div>
              <div className="table__cell table__common-cell-4">
                <button className="edit-button" onClick={() => handleEditButtonClick(index)}>✏️</button>
                <button className="delete-button" onClick={() => handleDeleteProduct(index)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Product;
