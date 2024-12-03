let productData = [];
function getProductList() {
  axios
    .get(
      "https://livejs-api.hexschool.io/api/livejs/v1/customer/gabrielle/products"
    )
    .then(function (res) {
      productData = res.data.products;
      renderProductList();
    })
    .catch(function(err) {
      errorAlert(err.response.data.message || '無法取得產品列表')
    })
}

getProductList();

function renderProductList() {
  let productStr = "";
  productData.forEach(function (item, i) {
    productStr += `<li class="productCard">
                    <h4 class="productType">${item.category}</h4>
                    <img src="${item.images}"
                        alt="">
                    <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
                    <h3>${item.title}</h3>
                    <del class="originPrice">NT$${item.origin_price}</del>
                    <p class="nowPrice">NT$${item.price}</p>
                </li>`;
  });

  const productWrap = document.querySelector(".productWrap");
  productWrap.innerHTML = productStr;

  productWrap.addEventListener('click', function(e) {
    if (e.target.classList.contains('addCardBtn')) {
      e.preventDefault()
      let productId = e.target.dataset.id
      addCartItem(productId)
    }
  })
}

// Cart
let cartData = [];
function getCart() {
  axios
    .get(
      "https://livejs-api.hexschool.io/api/livejs/v1/customer/gabrielle/carts"
    )
    .then(function (res) {
      cartData = res.data;
      renderCart();
    })
    .catch(function (err) {
      errorAlert(err.response.data.message || '無法取得購物車資訊')
    })
}

getCart();

function renderCart() {
  let cartStr = ``;
  cartStr += `<tr>
                    <th width="40%">品項</th>
                    <th width="15%">單價</th>
                    <th width="15%">數量</th>
                    <th width="15%">金額</th>
                    <th width="15%"></th>
                </tr>`;
  // item
  cartData.carts.forEach(function (item, i) {
    cartStr += `<tr>
                        <td>
                            <div class="cardItem-title">
                                <img src="${item.product.images}" alt="">
                                <p>${item.product.title}</p>
                            </div>
                        </td>
                        <td>NT$${item.product.price}</td>
                        <td>${item.quantity}</td>
                        <td>NT$${item.product.price * item.quantity}</td>
                        <td class="discardBtn">
                            <a href="#" class="material-icons discard-btn" data-clearid="${
                              item.id
                            }">
                                clear
                            </a>
                        </td>
                    </tr>`;
  });
  // total
  cartStr += `<tr>
                    <td>
                        <a href="#" class="discardAllBtn">刪除所有品項</a>
                    </td>
                    <td></td>
                    <td></td>
                    <td>
                        <p>總金額</p>
                    </td>
                    <td>NT$${cartData.finalTotal}</td>
                </tr>`;

  const cartTable = document.querySelector(".shoppingCart-table");
  cartTable.innerHTML = cartStr;

  cartTable.addEventListener('click', function(e) {
    // 刪除單一商品
    if (e.target.classList.contains('discard-btn')) {
      e.preventDefault()
      let clearId = e.target.dataset.clearid;
      deleteCartItem(clearId);
    }

    if (e.target.classList.contains('discardAllBtn')) {
      e.preventDefault()
      deleteAllCart()
    }
  })
}

function addCartItem(productId) {
  let num = 0
  // 檢查是否已經有該項產品
  cartData.carts.forEach(function(item, i) {
    if (item.product.id === productId) {
      num = item.quantity
    }
  })

  let obj = {
    data: {
      productId: productId,
      quantity: num + 1,
    },
  };

  axios.post("https://livejs-api.hexschool.io/api/livejs/v1/customer/gabrielle/carts",
      obj
    )
    .then(function (res) {
      cartData = res.data;
      renderCart();
    })
    .catch(function (err) {
      errorAlert(err.response.data.message || '新增產品失敗')
    })
}

function deleteCartItem(itemId) {
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/gabrielle/carts/${itemId}`
    )
    .then(function (res) {
      cartData = res.data;
      renderCart();
    })
    .catch(function (err) {
      errorAlert(err.response.data.message || '刪除產品失敗')
    })
}

function deleteAllCart() {
  axios
    .delete(
      "https://livejs-api.hexschool.io/api/livejs/v1/customer/gabrielle/carts"
    )
    .then(function (res) {
        cartData = res.data
        renderCart()
    })
    .catch(function (err) {
      errorAlert(err.response.data.message || '清空購物車失敗')
    })
}

function errorAlert(msg) {
  Swal.fire({
    title: "發生錯誤",
    text: msg,
    icon: "error",
    confirmButtonText: "我了解了",
  });
}

const orderBtn = document.querySelector('.orderInfo-btn')
orderBtn.addEventListener('click', function(e) {
  submitOrder()
})

function submitOrder() {
  const name = document.querySelector('#customerName')
  const tel = document.querySelector('#customerPhone')
  const mail = document.querySelector('#customerEmail')
  const address = document.querySelector('#customerAddress')
  const payment = document.querySelector('#tradeWay')

  axios.post(
    "https://livejs-api.hexschool.io/api/livejs/v1/customer/gabrielle/orders"
  , {
    data: {
      user: {
        name: name.value,
        tel: tel.value,
        email: mail.value,
        address: address.value,
        payment: payment.value
      }
    }
  })
  .then(function(res) {
    name.value = ''
    tel.value = ''
    mail.value = ''
    address.value = ''
    payment.value = ''

    getCart()
  })
  .catch(function(err) {
    errorAlert(err.response.data.message || '無法送出訂單')
  })
}