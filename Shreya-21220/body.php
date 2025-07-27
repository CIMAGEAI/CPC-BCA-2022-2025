<script>
  fetch('products.php')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('productContainer');
      data.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
          <img src="${product.image}" alt="${product.title}">
          <h3>${product.title}</h3>
          <p>₹${product.price}</p>
          <button class="buy-btn" onclick="window.location.href='payment.php?product_id=${product.id}'">Buy Now</button>
        `;
        container.appendChild(card);
      });
    });
</script>
