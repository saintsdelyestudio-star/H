// ─── Task Management ─────────────────────────────────────────────────────────

export type TaskCategory =
  | 'shooting'
  | 'drop'
  | 'content'
  | 'social'
  | 'design'
  | 'admin'

export type TaskPriority = 'high' | 'medium' | 'low'
export type TaskStatus = 'todo' | 'in-progress' | 'done'

export interface Task {
  id: string
  title: string
  description?: string
  category: TaskCategory
  priority: TaskPriority
  status: TaskStatus
  assignee?: string
  dueDate?: string // ISO date string
  createdAt: string
  updatedAt: string
  tags?: string[]
}

// ─── Products & Inventory ─────────────────────────────────────────────────────

export type ProductCategory =
  | 'hoodie'
  | 'tee'
  | 'pants'
  | 'outerwear'
  | 'accessory'
  | 'cap'
  | 'bag'

export type ProductStatus = 'active' | 'draft' | 'archived'

export interface SizeStock {
  XS: number
  S: number
  M: number
  L: number
  XL: number
  XXL: number
}

export interface Product {
  id: string
  sku: string
  name: string
  category: ProductCategory
  status: ProductStatus
  price: number
  costPrice: number
  stock: SizeStock
  totalStock: number
  drop?: string
  imageUrl?: string
  createdAt: string
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'fulfilled'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export interface OrderLineItem {
  productId: string
  productName: string
  sku: string
  quantity: number
  price: number
  size: string
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  customerName: string
  customerEmail: string
  status: OrderStatus
  lineItems: OrderLineItem[]
  subtotal: number
  shipping: number
  total: number
  currency: string
  createdAt: string
  updatedAt: string
  fulfillmentDate?: string
  trackingNumber?: string
  country: string
  city: string
}

// ─── Customers / CRM ──────────────────────────────────────────────────────────

export type CustomerTier = 'new' | 'regular' | 'vip' | 'whale'

export interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  country: string
  city: string
  tier: CustomerTier
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  firstOrderDate: string
  lastOrderDate: string
  tags?: string[]
}

// ─── Drops / Collections ──────────────────────────────────────────────────────

export type DropStatus =
  | 'planning'
  | 'upcoming'
  | 'live'
  | 'sold-out'
  | 'archived'

export interface Drop {
  id: string
  name: string
  season: string
  year: number
  status: DropStatus
  releaseDate?: string
  endDate?: string
  totalRevenue: number
  totalUnits: number
  unitsSold: number
  description?: string
  coverImage?: string
  products: string[] // product IDs
  createdAt: string
}

// ─── Team ─────────────────────────────────────────────────────────────────────

export interface TeamMember {
  id: string
  name: string
  role: string
  equity: number // percentage
  email: string
  bio?: string
  responsibilities: string[]
  stats: {
    tasksCompleted: number
    dropsManaged: number
    revenue?: number
  }
  avatarInitials: string
  joinedDate: string
  socials?: {
    instagram?: string
    linkedin?: string
  }
}

// ─── Collaborators ────────────────────────────────────────────────────────────

export type CollaboratorRole =
  | 'photographer'
  | 'videographer'
  | 'art-director'
  | 'stylist'
  | 'model'
  | 'graphic-designer'
  | 'marketing'
  | 'pr'
  | 'other'

export interface Collaborator {
  id: string
  name: string
  role: CollaboratorRole
  description?: string
  email?: string
  instagramHandle?: string
  portfolio?: string
  location?: string
  tags?: string[]
  activeDrops?: string[]
  featured: boolean
}

// ─── Finances ─────────────────────────────────────────────────────────────────

export interface MonthlyFinancials {
  month: string // "Jan", "Feb", etc.
  year: number
  revenue: number
  expenses: number
  profit: number
  orders: number
  aov: number // average order value
}

export interface ExpenseCategory {
  label: string
  amount: number
  percentage: number
  color: string
}

// ─── Moodboard ────────────────────────────────────────────────────────────────

export type MoodboardItemType =
  | 'image'
  | 'link'
  | 'note'
  | 'color'
  | 'typography'

export type MoodboardCategory =
  | 'palette'
  | 'texture'
  | 'reference'
  | 'typography'
  | 'product'
  | 'campaign'

export interface MoodboardItem {
  id: string
  type: MoodboardItemType
  category: MoodboardCategory
  title?: string
  content: string // URL for images/links, text for notes, hex for colors
  notes?: string
  tags?: string[]
  createdAt: string
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface SalesDataPoint {
  month: string
  revenue: number
  orders: number
  units: number
}

export interface MetricCard {
  label: string
  value: string | number
  change: number // percentage
  changeLabel: string
  prefix?: string
  suffix?: string
}
