// GET ORDERS
function getOrders() {
    return JSON.parse(localStorage.getItem("orders")) || [];
}

// SAVE ORDERS
function saveOrders(orders) {
    localStorage.setItem("orders", JSON.stringify(orders));
}

// CREATE ORDER
function createOrder(items) {
    const orders = getOrders();

    const newOrder = {
        id: "ORD-" + Math.floor(Math.random() * 10000),
        items: items,
        status: "NEW",
        time: new Date().toLocaleTimeString()
    };

    orders.push(newOrder);
    saveOrders(orders);

    return newOrder;
}

// UPDATE STATUS
function updateOrderStatus(orderId, status) {
    const orders = getOrders();

    const updated = orders.map(order => {
        if (order.id === orderId) {
            order.status = status;
        }
        return order;
    });

    saveOrders(updated);
}

function getMenu() {
    return JSON.parse(localStorage.getItem("menu")) || [];
}

function saveMenu(menu) {
    localStorage.setItem("menu", JSON.stringify(menu));
}

function addMenuItem(name, price) {
    const menu = getMenu();

    menu.push({
        id: Date.now(),
        name,
        price
    });

    saveMenu(menu);
}

function deleteMenuItem(id) {
    let menu = getMenu();
    menu = menu.filter(item => item.id !== id);
    saveMenu(menu);
}