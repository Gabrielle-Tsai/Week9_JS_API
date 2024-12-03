const apiPath = 'gabrielle'
const token = "gQIvRkhNS5NPadKMy55MmjHemBZ2";
const headers = {
    headers: {
        Authorization: token
    }
}

let orderData = []
function getOrder() {
    axios.get(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${apiPath}/orders`,
      headers
    )
    .then(function(res) {
        console.log(res.data)
        orderData = res.data.orders
        renderOrderList()
    })
}

getOrder()

function renderOrderList() {
    let orderStr = ''
    orderStr += `<thead>
                    <tr>
                        <th>訂單編號</th>
                        <th>聯絡人</th>
                        <th>聯絡地址</th>
                        <th>電子郵件</th>
                        <th>訂單品項</th>
                        <th>訂單日期</th>
                        <th>訂單狀態</th>
                        <th>操作</th>
                    </tr>
                </thead>`;
    // orders
    orderData.forEach(function(order, i) {
        let productList = ``
        order.products.forEach(function(item, i) {
            productList += `<li>${item.title}</li>`
        })
        orderStr += `<tr>
                        <td>${order.createdAt}</td>
                        <td>
                            <p>${order.user.name}</p>
                            <p>${order.user.tel}</p>
                        </td>
                        <td>${order.user.address}</td>
                        <td>${order.user.email}</td>
                        <td>
                            <ul>${productList}</ul>
                        </td>
                        <td>2021/03/08</td>
                        <td class="orderStatus">
                            <a href="#" class="orderStatus-Btn" data-orderid='${order.id}' data-status='${order.paid}'>${order.paid === true ? '已處理' : '未處理'}</a>
                        </td>
                        <td>
                            <input type="button" class="delSingleOrder-Btn" data-orderid="${order.id}" value="刪除">
                        </td>
                    </tr>`;
    })

    const orderTable = document.querySelector(".orderPage-table");
    orderTable.innerHTML = orderStr

    orderTable.addEventListener('click', function(e) {
        if (e.target.classList.contains('orderStatus-Btn')) {
            e.preventDefault()
            let id = e.target.dataset.orderid
            let status = e.target.dataset.status === 'true' ? true : false
            editOrderStatus(id, status)
        }

        if (e.target.classList.contains('delSingleOrder-Btn')) {
            let id = e.target.dataset.orderid
            deleteOrder(id)
        }
    })

    renderC3()
}

function editOrderStatus(id, status) {
    axios
      .put(
        `https://livejs-api.hexschool.io/api/livejs/v1/admin/${apiPath}/orders`,
        {
          data: {
            id: id,
            paid: !status,
          },
        },
        headers
      )
      .then(function (res) {
        orderData = res.data.orders
        renderOrderList()
      })
      .catch(function (err) {
        errorAlert(err.response.data.message || "無法修改訂單狀態");
      });
}

function deleteOrder(id) {
    axios.delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${apiPath}/orders/${id}`
    , headers)
    .then(function(res) {
        orderData = res.data.orders
        renderOrderList()
    })
    .catch(function(err) {
        errorAlert(err.response.data.message || '無法刪除訂單')
    });
}

const discardAllBtn = document.querySelector(".discardAllBtn");
discardAllBtn.addEventListener('click', function(e) {
    deleteAllOrder()
})

function deleteAllOrder() {
    axios.delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${apiPath}/orders`
    , headers)
    .then(function(res) {
        orderData = res.data.orders
        renderOrderList()
    })
    .catch(function(err) {
        errorAlert(err.response.data.message || '無法清空訂單')
    });
}

function errorAlert(msg) {
  Swal.fire({
    title: "發生錯誤",
    text: msg,
    icon: "error",
    confirmButtonText: "我了解了",
  });
}

// C3.js
function renderC3() {
    let categoryData = {};
    orderData.forEach(function (order, i) {
        order.products.forEach(function (product, i) {
        if (categoryData[product.category] === undefined) {
            categoryData[product.category] = 1;
        } else {
            categoryData[product.category] += 1;
        }
        });
    });

    let pieData = [];
    Object.keys(categoryData).forEach(function (category, i) {
        pieData.push([category, categoryData[category]]);
    });

    let chart = c3.generate({
      bindto: "#chart", // HTML 元素綁定
      data: {
        type: "pie",
        columns: pieData,
        colors: {
          "收納": "#DACBFF",
          "床架": "#9D7FEA",
          "窗簾": "#5434A7",
        },
      },
    });
}
