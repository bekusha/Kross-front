interface Order {
    id: number;
    order_type: string;
    phone: string;
    address: string;
    email: string;
    ordered_at: string;
    status: string;
    user: number;
}

interface OrderItem {
    product: number;
    quantity: number;
}

interface OilChangeOrder {
    order: Order;
    order_items: OrderItem[];
}
