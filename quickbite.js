// QuickBite interactivity for restaurant dashboard demo

document.addEventListener('DOMContentLoaded', function () {
  // --- Restaurant Dashboard Logic (restaurants.html) ---
  if (window.location.pathname.includes('restaurants.html')) {
    const restaurantCards = document.querySelectorAll('.restaurant-card button')
    const restaurantListSection = document.querySelector('.restaurant-list')
    const dashboardSection = document.querySelector('.restaurant-dashboard')

    // Show dashboard when a restaurant is selected
    restaurantCards.forEach((btn) => {
      btn.addEventListener('click', function () {
        restaurantListSection.style.display = 'none'
        dashboardSection.style.display = 'block'
      })
    })

    // Demo: Order status cycling
    const statusCycle = [
      'Pending',
      'Accepted',
      'In the Kitchen',
      'Ready for Pickup',
      'Out for Delivery',
      'Completed',
    ]
    const orderCard = document.querySelector('.order-card')
    const statusSpan = orderCard
      ? orderCard.querySelector('.order-status')
      : null
    let statusIdx = 0

    if (orderCard && statusSpan) {
      orderCard.querySelectorAll('.order-actions button').forEach((btn, i) => {
        btn.addEventListener('click', function () {
          statusIdx = i < statusCycle.length ? i : statusIdx
          statusSpan.textContent = statusCycle[statusIdx]
          // Demo: Add timestamp
          const ts = new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })
          orderCard.querySelector(
            'p:last-of-type',
          ).textContent = `Timestamps: ${ts} (${statusCycle[statusIdx]})`
          // Demo: Notification
          showNotification(
            `Order status updated to "${statusCycle[statusIdx]}"`,
          )
        })
      })
    }
  }

  // --- Menu Page Logic (menu.html) ---
  if (window.location.pathname.includes('menu.html')) {
    // Menu items (demo data, must match menu.html)
    const menuItems = [
      { name: 'Margherita Pizza', price: 12.99 },
      { name: 'Spaghetti Carbonara', price: 13.99 },
      { name: 'Lasagna', price: 14.99 },
      { name: 'Chicken Parmigiana', price: 15.99 },
      { name: 'Soda', price: 2.5 },
      { name: 'Bottled Water', price: 1.5 },
    ]
    // Load cart from localStorage
    let cart = JSON.parse(localStorage.getItem('quickbite_cart') || '[]')

    // Add to cart
    document.querySelectorAll('.add-to-cart').forEach((btn, idx) => {
      btn.addEventListener('click', function () {
        const item = menuItems[idx]
        const found = cart.find((c) => c.name === item.name)
        if (found) {
          found.qty++
        } else {
          cart.push({ ...item, qty: 1 })
        }
        localStorage.setItem('quickbite_cart', JSON.stringify(cart))
        showNotification(`${item.name} added to cart`)
      })
    })
  }

  // --- Cart Page Logic (cart.html) ---
  if (window.location.pathname.includes('cart.html')) {
    let cart = JSON.parse(localStorage.getItem('quickbite_cart') || '[]')
    function updateCart() {
      const cartList = document.querySelector('.cart-list')
      const cartTotal = document.querySelector('.cart-total')
      cartList.innerHTML = ''
      let total = 0
      cart.forEach((item, idx) => {
        total += item.price * item.qty
        const li = document.createElement('li')
        li.innerHTML = `${item.name} x${item.qty} - $${(
          item.price * item.qty
        ).toFixed(
          2,
        )} <button data-idx="${idx}" class="remove-item">Remove</button>`
        cartList.appendChild(li)
      })
      cartTotal.textContent = `Total: $${total.toFixed(2)}`
      // Remove item
      document.querySelectorAll('.remove-item').forEach((btn) => {
        btn.addEventListener('click', function () {
          const idx = parseInt(btn.getAttribute('data-idx'))
          cart.splice(idx, 1)
          localStorage.setItem('quickbite_cart', JSON.stringify(cart))
          updateCart()
        })
      })
    }
    updateCart()
    // Checkout
    const checkoutBtn = document.querySelector('.checkout-btn')
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function () {
        if (cart.length === 0) {
          showNotification('Your cart is empty!')
          return
        }
        showNotification('Order placed! Tracking available soon.')
        cart = []
        localStorage.setItem('quickbite_cart', '[]')
        updateCart()
      })
    }
  }

  // --- Notification system (shared) ---
  function showNotification(msg) {
    let notif = document.createElement('div')
    notif.className = 'quickbite-notification'
    notif.textContent = msg
    document.body.appendChild(notif)
    setTimeout(() => notif.classList.add('show'), 10)
    setTimeout(() => {
      notif.classList.remove('show')
      setTimeout(() => notif.remove(), 400)
    }, 2500)
  }
})
