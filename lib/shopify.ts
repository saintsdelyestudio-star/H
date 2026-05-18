/**
 * Shopify Admin API client for Delyé
 *
 * Required environment variables:
 *   SHOPIFY_STORE_DOMAIN   — e.g. "delye.myshopify.com"
 *   SHOPIFY_ADMIN_API_TOKEN — Admin API access token
 *   SHOPIFY_API_VERSION    — e.g. "2024-04"
 */

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || ''
const SHOPIFY_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN || ''
const API_VERSION = process.env.SHOPIFY_API_VERSION || '2024-04'

const SHOPIFY_GRAPHQL_URL = `https://${SHOPIFY_DOMAIN}/admin/api/${API_VERSION}/graphql.json`
const SHOPIFY_REST_BASE = `https://${SHOPIFY_DOMAIN}/admin/api/${API_VERSION}`

interface ShopifyGraphQLResponse<T> {
  data: T
  errors?: Array<{ message: string }>
}

export async function shopifyGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(SHOPIFY_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error(`Shopify GraphQL request failed: ${res.status} ${res.statusText}`)
  }

  const json: ShopifyGraphQLResponse<T> = await res.json()

  if (json.errors?.length) {
    throw new Error(`Shopify GraphQL errors: ${json.errors.map((e) => e.message).join(', ')}`)
  }

  return json.data
}

export async function shopifyREST<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${SHOPIFY_REST_BASE}${endpoint}`

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_TOKEN,
      ...(options?.headers || {}),
    },
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error(`Shopify REST request failed: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

// ─── Orders ───────────────────────────────────────────────────────────────────

const ORDERS_QUERY = `
  query GetOrders($first: Int!, $after: String) {
    orders(first: $first, after: $after, sortKey: CREATED_AT, reverse: true) {
      edges {
        cursor
        node {
          id
          name
          email
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          displayFinancialStatus
          displayFulfillmentStatus
          createdAt
          customer {
            firstName
            lastName
            email
          }
          lineItems(first: 10) {
            edges {
              node {
                title
                quantity
                sku
                originalUnitPriceSet {
                  shopMoney {
                    amount
                  }
                }
              }
            }
          }
          shippingAddress {
            city
            country
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`

export async function getOrders(first = 50) {
  return shopifyGraphQL<{
    orders: {
      edges: Array<{ cursor: string; node: Record<string, unknown> }>
      pageInfo: { hasNextPage: boolean; endCursor: string }
    }
  }>(ORDERS_QUERY, { first })
}

// ─── Products ─────────────────────────────────────────────────────────────────

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          status
          totalInventory
          variants(first: 20) {
            edges {
              node {
                id
                sku
                title
                inventoryQuantity
                price
              }
            }
          }
          images(first: 1) {
            edges {
              node {
                url
              }
            }
          }
          createdAt
        }
      }
    }
  }
`

export async function getProducts(first = 100) {
  return shopifyGraphQL<{
    products: {
      edges: Array<{ node: Record<string, unknown> }>
    }
  }>(PRODUCTS_QUERY, { first })
}

// ─── Customers ────────────────────────────────────────────────────────────────

const CUSTOMERS_QUERY = `
  query GetCustomers($first: Int!) {
    customers(first: $first, sortKey: TOTAL_SPENT, reverse: true) {
      edges {
        node {
          id
          firstName
          lastName
          email
          phone
          amountSpent {
            amount
            currencyCode
          }
          numberOfOrders
          createdAt
          lastOrder {
            createdAt
          }
          addresses(first: 1) {
            city
            country
          }
          tags
        }
      }
    }
  }
`

export async function getCustomers(first = 100) {
  return shopifyGraphQL<{
    customers: {
      edges: Array<{ node: Record<string, unknown> }>
    }
  }>(CUSTOMERS_QUERY, { first })
}
