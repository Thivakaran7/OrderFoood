// 1. Firebase Setup (இதை மூன்று பக்கங்களிலும் சேர்க்க வேண்டும்)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, query, where } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = JSON.parse(__firebase_config); // உங்கள் Firebase Config
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'my-food-app';

// --- CUSTOMER SIDE LOGIC ---
export async function placeOrder(orderData) {
    // ஆர்டரை Firebase-ல் சேர்த்தல்
    const ordersRef = collection(db, 'artifacts', appId, 'public', 'data', 'orders');
    await addDoc(ordersRef, {
        ...orderData,
        status: 'NEW', // ஆரம்ப நிலை
        timestamp: new Date()
    });
}

// --- RESTAURANT SIDE LOGIC ---
export function listenForNewOrders(callback) {
    const ordersRef = collection(db, 'artifacts', appId, 'public', 'data', 'orders');
    // புதிய ஆர்டர்களை மட்டும் கவனித்தல்
    onSnapshot(ordersRef, (snapshot) => {
        const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(orders);
    }, (error) => console.error("Error fetching orders:", error));
}

export async function updateOrderStatus(orderId, newStatus) {
    const orderRef = doc(db, 'artifacts', appId, 'public', 'data', 'orders', orderId);
    await updateDoc(orderRef, { status: newStatus });
}

// --- KITCHEN SIDE LOGIC ---
export function listenForKitchenOrders(callback) {
    const ordersRef = collection(db, 'artifacts', appId, 'public', 'data', 'orders');
    // 'PREPARING' நிலையில் உள்ளவற்றை மட்டும் திரையிடல்
    onSnapshot(ordersRef, (snapshot) => {
        const kitchenOrders = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(order => order.status === 'PREPARING');
        callback(kitchenOrders);
    }, (error) => console.error("Error fetching kitchen orders:", error));
}