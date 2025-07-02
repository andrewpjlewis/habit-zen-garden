import Header from '../components/Header';
import Footer from '../components/Footer';

function Shop() {
  // Example product list - you can replace with real data later
  const products = [
    { id: 1, name: 'Plant Pot', price: '$15' },
    { id: 2, name: 'Fertilizer', price: '$10' },
    { id: 3, name: 'Watering Can', price: '$20' },
  ];

  return (
    <>
        <Header />
        <main>
            <div class="shopMenu">
              <h1>Shop</h1>
              <p>Welcome to the shop! Browse our products below.</p>
              <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                {products.map(product => (
                  <li key={product.id}>
                    <strong>{product.name}</strong> — {product.price}
                    {/* You can add buttons, images, descriptions here */}
                  </li>
                ))}
              </ul>
            </div>
        </main>
        <Footer />
    </>
  );
}

export default Shop;
