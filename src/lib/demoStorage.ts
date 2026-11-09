import {
    initialZones, initialBrands, initialCategories, initialVariants,
    initialWarehouses, initialStores, initialUsers, initialCustomers,
    initialDrivers, initialOrders
} from './demoData';

const STORAGE_KEY = 'green_alchemy_demo_data';

class DemoStorage {
    private data: any;

    constructor() {
        this.init();
    }

    private init() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            this.data = JSON.parse(stored);
            this.refreshInitialOrderDates();
            this.save();
        } else {
            this.data = {
                zones: initialZones,
                brands: initialBrands,
                categories: initialCategories,
                variants: initialVariants,
                warehouses: initialWarehouses,
                stores: initialStores,
                users: initialUsers,
                customers: initialCustomers,
                drivers: initialDrivers,
                orders: initialOrders,
                order_items: [],
                order_payments: [],
                order_timeline: [],
                currentUser: null
            };
            this.save();
        }
    }

    private refreshInitialOrderDates() {
        const initialOrdersById = new Map(initialOrders.map(order => [order.id, order]));
        const timestampFields = [
            'created_at', 'updated_at', 'validated_at', 'preparation_started_at',
            'ready_at', 'dispatched_at', 'delivered_at', 'cancelled_at'
        ];

        this.data.orders = this.getAll('orders').map((order: any) => {
            const initialOrder = initialOrdersById.get(order.id);
            if (!initialOrder || !order.created_at) return order;

            const dateOffset = new Date(initialOrder.created_at).getTime() - new Date(order.created_at).getTime();
            if (!Number.isFinite(dateOffset)) return order;

            const refreshedOrder = { ...order };
            timestampFields.forEach(field => {
                if (typeof order[field] !== 'string') return;
                const timestamp = Date.parse(order[field]);
                if (Number.isFinite(timestamp)) {
                    refreshedOrder[field] = new Date(timestamp + dateOffset).toISOString();
                }
            });
            return refreshedOrder;
        });
    }

    private save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        // Trigger a custom event for "realtime" simulation
        window.dispatchEvent(new CustomEvent('demo_storage_update'));
    }

    // --- Auth ---
    getCurrentUser() {
        return this.data.currentUser;
    }

    setCurrentUser(user: any) {
        this.data.currentUser = user;
        this.save();
    }

    // --- CRUD Generic ---
    getAll(collection: string) {
        return this.data[collection] || [];
    }

    getById(collection: string, id: string) {
        return this.getAll(collection).find((item: any) => item.id === id);
    }

    insert(collection: string, item: any) {
        const newItem = {
            id: Math.random().toString(36).substring(2, 9),
            created_at: new Date().toISOString(),
            is_active: true,
            ...item
        };
        this.data[collection] = [...this.getAll(collection), newItem];
        this.save();
        return newItem;
    }

    update(collection: string, id: string, updates: any) {
        this.data[collection] = this.getAll(collection).map((item: any) =>
            item.id === id ? { ...item, ...updates, updated_at: new Date().toISOString() } : item
        );
        this.save();
        return this.getById(collection, id);
    }

    delete(collection: string, id: string) {
        this.data[collection] = this.getAll(collection).filter((item: any) => item.id !== id);
        this.save();
    }

    // --- Specific Helpers ---
    getOrdersWithRelations() {
        return this.getAll('orders').map((order: any) => ({
            ...order,
            customer: this.getById('customers', order.customer_id),
            store: this.getById('stores', order.store_id),
            warehouse: this.getById('warehouses', order.warehouse_id),
            driver: order.driver_id ? this.getById('drivers', order.driver_id) : null,
            order_items: this.getAll('order_items').filter((i: any) => i.order_id === order.id),
            order_payments: this.getAll('order_payments').filter((p: any) => p.order_id === order.id)
        }));
    }

    deleteWhere(collection: string, field: string, value: any) {
        this.data[collection] = this.getAll(collection).filter((item: any) => item[field] !== value);
        this.save();
    }
}

export const demoStorage = new DemoStorage();
