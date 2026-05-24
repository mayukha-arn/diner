export type OrderStatus = "pending" | "accepted" | "preparing" | "ready" | "fulfilled" | "cancelled";

export interface OrderItem { name: string; quantity: number; unitPrice: number; }
export interface Order {
  id: number; customerName: string | null; status: OrderStatus;
  total: number; notes?: string; createdAt: string; items: OrderItem[];
}
export interface Customer {
  id: number; name: string; email: string; phone?: string;
  orderCount: number; totalSpend: number; lastOrderDate: string;
  orders: { id: number; status: OrderStatus; total: number; createdAt: string; }[];
}
export interface MenuItem {
  id: number; categoryId: number; categoryName: string; name: string;
  description?: string; price: number; available: boolean;
}
export interface Category { id: number; name: string; }

export const CATEGORIES: Category[] = [
  { id: 1, name: "Burgers" },
  { id: 2, name: "Sides" },
  { id: 3, name: "Desserts" },
  { id: 4, name: "Drinks" },
];

export const MENU_ITEMS: MenuItem[] = [
  { id: 1, categoryId: 1, categoryName: "Burgers", name: "Smash Burger", description: "Double-smashed patty, American cheese, shredded lettuce, house sauce on a brioche bun.", price: 12.99, available: true },
  { id: 2, categoryId: 3, categoryName: "Desserts", name: "Ice Cream Sundae", description: "Classic vanilla ice cream sundae with hot fudge and a cherry on top.", price: 2.00, available: true },
  { id: 3, categoryId: 1, categoryName: "Burgers", name: "Classic Cheeseburger", description: "Single patty, American cheese, yellow mustard, ketchup, pickle, onion.", price: 9.99, available: true },
  { id: 4, categoryId: 2, categoryName: "Sides", name: "Seasoned Fries", description: "Thin-cut fries tossed in our house seasoning blend.", price: 4.99, available: true },
  { id: 5, categoryId: 4, categoryName: "Drinks", name: "Homemade Cola", description: "Our scratch-made cola with house-made syrup and sparkling water.", price: 2.99, available: true },
  { id: 6, categoryId: 2, categoryName: "Sides", name: "Onion Rings", description: "Beer-battered thick-cut onion rings, crispy and golden.", price: 5.49, available: true },
  { id: 7, categoryId: 3, categoryName: "Desserts", name: "Banana Split", description: "Three scoops, caramel, hot fudge, whipped cream, nuts, cherry.", price: 8.99, available: true },
  { id: 8, categoryId: 3, categoryName: "Desserts", name: "Chocolate Shake", description: "Hand-spun thick shake, whole milk, house chocolate syrup.", price: 6.99, available: true },
  { id: 9, categoryId: 2, categoryName: "Sides", name: "Coleslaw", description: "Creamy house-made coleslaw with apple cider vinegar dressing.", price: 3.49, available: true },
  { id: 10, categoryId: 4, categoryName: "Drinks", name: "Lemonade", description: "Fresh-squeezed lemonade, sweetened with cane sugar.", price: 3.49, available: true },
  { id: 11, categoryId: 1, categoryName: "Burgers", name: "Mushroom Swiss Burger", description: "Sautéed mushrooms, Swiss cheese, garlic aioli, arugula.", price: 13.99, available: false },
  { id: 12, categoryId: 4, categoryName: "Drinks", name: "Root Beer Float", description: "Vanilla ice cream floating in ice-cold root beer.", price: 5.99, available: true },
];

export const ORDERS: Order[] = [
  { id: 13, customerName: null, status: "pending", total: 14.48, createdAt: "2026-05-24T18:30:00Z", items: [{ name: "Smash Burger", quantity: 1, unitPrice: 12.99 }, { name: "Lemonade", quantity: 1, unitPrice: 3.49 }] },
  { id: 12, customerName: "Elena Shaw", status: "pending", total: 20.96, createdAt: "2026-05-24T18:15:00Z", notes: "No pickles please", items: [{ name: "Classic Cheeseburger", quantity: 2, unitPrice: 9.99 }, { name: "Homemade Cola", quantity: 1, unitPrice: 2.99 }] },
  { id: 11, customerName: "Dan Kowalski", status: "accepted", total: 12.99, createdAt: "2026-05-24T18:00:00Z", items: [{ name: "Smash Burger", quantity: 1, unitPrice: 12.99 }] },
  { id: 10, customerName: "Carmen Vega", status: "preparing", total: 22.47, createdAt: "2026-05-24T17:50:00Z", items: [{ name: "Smash Burger", quantity: 1, unitPrice: 12.99 }, { name: "Seasoned Fries", quantity: 1, unitPrice: 4.99 }, { name: "Homemade Cola", quantity: 1, unitPrice: 2.99 }] },
  { id: 9, customerName: "Bobby Ray", status: "ready", total: 17.98, createdAt: "2026-05-24T17:40:00Z", items: [{ name: "Classic Cheeseburger", quantity: 1, unitPrice: 9.99 }, { name: "Onion Rings", quantity: 1, unitPrice: 5.49 }, { name: "Lemonade", quantity: 1, unitPrice: 3.49 }] },
  { id: 8, customerName: "Frank Osei", status: "cancelled", total: 9.99, createdAt: "2026-05-23T17:30:00Z", items: [{ name: "Classic Cheeseburger", quantity: 1, unitPrice: 9.99 }] },
  { id: 7, customerName: "Alice Monroe", status: "fulfilled", total: 24.46, createdAt: "2026-05-23T16:00:00Z", items: [{ name: "Smash Burger", quantity: 1, unitPrice: 12.99 }, { name: "Seasoned Fries", quantity: 1, unitPrice: 4.99 }, { name: "Chocolate Shake", quantity: 1, unitPrice: 6.99 }] },
  { id: 6, customerName: "Gina Park", status: "fulfilled", total: 9.99, createdAt: "2026-05-23T15:00:00Z", items: [{ name: "Classic Cheeseburger", quantity: 1, unitPrice: 9.99 }] },
  { id: 5, customerName: "Dan Kowalski", status: "fulfilled", total: 30.44, createdAt: "2026-05-24T14:00:00Z", items: [{ name: "Smash Burger", quantity: 2, unitPrice: 12.99 }, { name: "Seasoned Fries", quantity: 1, unitPrice: 4.99 }] },
  { id: 4, customerName: "Bobby Ray", status: "fulfilled", total: 22.47, createdAt: "2026-05-23T13:00:00Z", items: [{ name: "Smash Burger", quantity: 1, unitPrice: 12.99 }, { name: "Seasoned Fries", quantity: 1, unitPrice: 4.99 }, { name: "Homemade Cola", quantity: 1, unitPrice: 2.99 }] },
];

export const CUSTOMERS: Customer[] = [
  { id: 1, name: "Dan Kowalski", email: "dan@example.com", orderCount: 2, totalSpend: 43.43, lastOrderDate: "2026-05-24", orders: [{ id: 11, status: "accepted", total: 12.99, createdAt: "2026-05-24T18:00:00Z" }, { id: 5, status: "fulfilled", total: 30.44, createdAt: "2026-05-24T14:00:00Z" }] },
  { id: 2, name: "Elena Shaw", email: "elena@example.com", orderCount: 1, totalSpend: 20.96, lastOrderDate: "2026-05-24", orders: [{ id: 12, status: "pending", total: 20.96, createdAt: "2026-05-24T18:15:00Z" }] },
  { id: 3, name: "Bobby Ray", email: "bobby@example.com", orderCount: 2, totalSpend: 40.45, lastOrderDate: "2026-05-24", orders: [{ id: 9, status: "ready", total: 17.98, createdAt: "2026-05-24T17:40:00Z" }, { id: 4, status: "fulfilled", total: 22.47, createdAt: "2026-05-23T13:00:00Z" }] },
  { id: 4, name: "Carmen Vega", email: "carmen@example.com", orderCount: 1, totalSpend: 22.47, lastOrderDate: "2026-05-24", orders: [{ id: 10, status: "preparing", total: 22.47, createdAt: "2026-05-24T17:50:00Z" }] },
  { id: 5, name: "Frank Osei", email: "frank@example.com", orderCount: 1, totalSpend: 9.99, lastOrderDate: "2026-05-23", orders: [{ id: 8, status: "cancelled", total: 9.99, createdAt: "2026-05-23T17:30:00Z" }] },
  { id: 6, name: "Alice Monroe", email: "alice@example.com", orderCount: 1, totalSpend: 24.46, lastOrderDate: "2026-05-23", orders: [{ id: 7, status: "fulfilled", total: 24.46, createdAt: "2026-05-23T16:00:00Z" }] },
  { id: 7, name: "Gina Park", email: "gina@example.com", orderCount: 1, totalSpend: 9.99, lastOrderDate: "2026-05-23", orders: [{ id: 6, status: "fulfilled", total: 9.99, createdAt: "2026-05-23T15:00:00Z" }] },
];

export const DASHBOARD = {
  totalOrders: 13,
  totalRevenue: 258.63,
  pendingOrders: 2,
  popularItem: "Smash Burger",
  topItems: [
    { id: 1, name: "Smash Burger", categoryName: "Burgers", price: 12.99, orderCount: 8 },
    { id: 5, name: "Homemade Cola", categoryName: "Drinks", price: 2.99, orderCount: 6 },
    { id: 4, name: "Seasoned Fries", categoryName: "Sides", price: 4.99, orderCount: 6 },
    { id: 2, name: "Ice Cream Sundae", categoryName: "Desserts", price: 2.00, orderCount: 5 },
  ],
};
