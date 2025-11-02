# Platform Gold API Documentation

## Base URL

- **Production**: `https://api.platform.gold`
- **Sandbox**: Contact Platform Gold for sandbox credentials

## Authentication

All requests require Bearer token authentication:

```
Authorization: Bearer {token}
```

---

## 🔐 Authentication

### POST `/login`

Fetch durable access token

**⚠️ WARNING**: This invalidates any previous access tokens!

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**

```json
{
  "token": "string"
}
```

---

## 📦 System Endpoints

### GET `/shipping-instructions`

Fetch available shipping instructions for Sales Orders

**Response (200):**

```json
[
  {
    "id": 0,
    "name": "string"
  }
]
```

---

### GET `/warehouse-locations`

Fetch available warehouse locations for Purchase Orders

**Response (200):**

```json
[
  {
    "id": 0,
    "name": "string",
    "address": {
      "addressee": "string",
      "attention": "string",
      "addr1": "string",
      "addr2": "string",
      "city": "string",
      "state": "string",
      "zip": "string",
      "country": "string"
    }
  }
]
```

---

### GET `/payment-methods`

Fetch available payment methods for Sales/Purchase Orders

**Response (200):**

```json
[
  {
    "id": 0,
    "title": "string",
    "description": "string",
    "scope": "string",
    "fee": 0,
    "feeWaived": 0
  }
]
```

---

### GET `/spot-prices`

Fetch metal spot prices

**Query Parameters:**

- `currency` (optional): AUD, CAD, CHF, CZK, EUR, GBP, JPY, PLN, SGD, TRY, USD, ZAR

**Response (200):**

```json
[
  {
    "symbol": "XAU",
    "currency": "USD",
    "currencyMultiplier": 0,
    "open": 0,
    "ask": 0,
    "bid": 0,
    "timestamp": "string"
  }
]
```

---

### GET `/status`

Get current system status

**Response (200):**

```json
{
  "SYSTEM_MESSAGE": "string",
  "SYSTEM_MESSAGE_URL": "string",
  "TRADING_ENABLED": true
}
```

---

## 📊 Inventory Endpoints

### GET `/inventory`

List available inventory with pricing

**Query Parameters:**

- `ids` (optional): Comma-separated item IDs (e.g., "1,2,3")
- `favorite` (optional): Boolean - only include favorited items
- `limit` (optional): Maximum results (default: 25)
- `offset` (optional): Number to skip (default: 0)

**Response (200):**

```json
{
  "count": 0,
  "page": 0,
  "nextPage": 0,
  "records": [
    {
      "id": 2915,
      "sku": "ATBG",
      "name": "string",
      "metalOz": 0,
      "bidPriceFormat": "Fixed",
      "bidPremium": 0,
      "askPriceFormat": "Fixed",
      "askPremium": 0,
      "disablePerOzCalc": true,
      "metalSymbol": "XAU",
      "metalType": "GOLD - Hedge",
      "metalContent": {
        "gold": 0,
        "silver": 0,
        "platinum": 0,
        "palladium": 0
      },
      "manufacturer": "string",
      "purity": "string",
      "buyQuantity": 0,
      "sellQuantity": 0,
      "minQuantity": 0,
      "minBidQty": 0,
      "minAskQty": 0,
      "year": "string",
      "grade": "string",
      "gradingService": "string",
      "mintMark": "string",
      "iraEligible": true,
      "askPrice": 0,
      "bidPrice": 0,
      "metalAsk": 0,
      "metalBid": 0,
      "mainImage": "string",
      "altImage1": "string",
      "altImage2": "string",
      "altImage3": "string",
      "stockStatus": "string",
      "categories": [
        {
          "name": "string",
          "primary": true,
          "children": ["string"]
        }
      ]
    }
  ]
}
```

---

### GET `/inventory/{id}`

Fetch inventory by ID with pricing

**Path Parameters:**

- `id` (required): Inventory unique ID

**Response (200):** Same as single inventory record above

---

## 🛒 Sales Order Endpoints (BUYING from Platform Gold)

### POST `/sales-order`

Create Sales Order

**⚠️ WARNING**: Unless in sandbox, this creates REAL orders!

**Request Body:**

```json
[
  {
    "asynchronous": false,
    "confirmationNumber": "string",
    "items": [
      {
        "id": 0,
        "quantity": 0
      }
    ],
    "shippingAddress": {
      "addressee": "string",
      "attention": "string",
      "addr1": "string",
      "addr2": "string",
      "city": "string",
      "state": "string",
      "zip": "string",
      "country": "string"
    },
    "email": "string",
    "paymentMethodId": 0,
    "shippingInstructionId": 0,
    "customerReferenceNumber": "string",
    "notes": "string"
  }
]
```

**Response (200) - Synchronous:**

```json
[
  {
    "id": 2915,
    "confirmationNumber": "string",
    "recordType": "salesOrder",
    "shippingInstruction": {
      "id": 0,
      "name": "string"
    },
    "paymentMethod": {
      "id": 0,
      "title": "string",
      "description": "string",
      "scope": "string",
      "fee": 0,
      "feeWaived": 0
    },
    "shippingAddress": {
      "addressee": "string",
      "attention": "string",
      "addr1": "string",
      "addr2": "string",
      "city": "string",
      "state": "string",
      "zip": "string",
      "country": "string"
    },
    "itemFulfillments": [
      {
        "shipDate": "string",
        "shipMethod": "string",
        "items": [
          {
            "id": 0,
            "quantity": 0
          }
        ],
        "trackingNumbers": ["string"]
      }
    ],
    "status": "Awaiting Payment",
    "trackingNumbers": ["abc", "123"],
    "lineItems": [
      {
        "id": 0,
        "name": "string",
        "quantity": 0,
        "rate": 0
      }
    ],
    "amount": 0,
    "transactionDate": "string",
    "customerReferenceNumber": "string",
    "transactionId": "string"
  }
]
```

**Response (202) - Asynchronous:**

```json
[
  {
    "handle": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "recordType": "quote",
    "quoteExpiration": "string",
    "lineItems": [
      {
        "id": 0,
        "name": "string",
        "quantity": 0,
        "rate": 0
      }
    ],
    "handlingFee": 0,
    "amount": 0,
    "transactionDate": "string",
    "customerReferenceNumber": "string"
  }
]
```

---

### POST `/sales-order/status`

Fetch Sales Order statuses by IDs

**Request Body:**

```json
[
  {
    "id": 0
  }
]
```

**Response (200):** Same as synchronous sales order response

---

### POST `/sales-order/search`

Search for sales orders by criteria

**Request Body:**

```json
{
  "transactionId": "string",
  "customerReferenceNumber": "string",
  "transactionDate": {
    "from": "string",
    "to": "string"
  }
}
```

**Response (200):**

```json
[
  {
    "id": 2915,
    "recordType": "salesOrder",
    "status": "Awaiting Payment",
    "trackingNumbers": ["abc", "123"],
    "amount": 0,
    "transactionDate": "string",
    "customerReferenceNumber": "string",
    "transactionId": "string"
  }
]
```

---

### POST `/sales-order/poll`

Poll Sales Order submission status by handle (for async orders)

**Request Body:**

```json
[
  {
    "handle": "string"
  }
]
```

**Response (200):**

```json
[
  {
    "id": 0,
    "handle": "string",
    "transactionId": "string",
    "confirmationNumber": "string",
    "syncError": "string",
    "syncAttempts": 0,
    "syncAttemptsRemaining": 0
  }
]
```

---

### PUT `/sales-order/{id}`

Update Sales Order (subject to lock status)

**Path Parameters:**

- `id` (required): Sales Order ID

**Request Body:**

```json
{
  "shippingAddress": {
    "addressee": "string",
    "attention": "string",
    "addr1": "string",
    "addr2": "string",
    "city": "string",
    "state": "string",
    "zip": "string",
    "country": "string"
  },
  "shippingInstructionId": 0,
  "customerReferenceNumber": "string",
  "orderNotes": "string"
}
```

**Response (200):** Same as sales order status response

---

### POST `/sales-order/quote/create`

Create Sales Order Quote (get pricing without committing)

**⚠️ WARNING**: Unless in sandbox, this creates REAL quotes!

**Request/Response:** Same as `/sales-order` endpoint

---

### POST `/sales-order/quote/execute`

Execute a previously created quote

**Request Body:**

```json
[
  {
    "handle": "string"
  }
]
```

**Response (200/202):** Same as `/sales-order` endpoint

---

## 📤 Purchase Order Endpoints (SELLING to Platform Gold)

### POST `/purchase-order`

Create Purchase Order

**⚠️ WARNING**: Unless in sandbox, this creates REAL orders!

**Request Body:**

```json
[
  {
    "asynchronous": false,
    "confirmationNumber": "string",
    "warehouseLocationId": 0,
    "items": [
      {
        "id": 0,
        "quantity": 0
      }
    ],
    "customerReferenceNumber": "string",
    "notes": "string"
  }
]
```

**Response (200) - Synchronous:**

```json
[
  {
    "id": 2915,
    "confirmationNumber": "string",
    "recordType": "salesOrder",
    "warehouseAddress": {
      "addressee": "string",
      "attention": "string",
      "addr1": "string",
      "addr2": "string",
      "city": "string",
      "state": "string",
      "zip": "string",
      "country": "string"
    },
    "status": "Fully Billed",
    "lineItems": [
      {
        "id": 0,
        "name": "string",
        "quantity": 0,
        "rate": 0
      }
    ],
    "amount": 0,
    "transactionDate": "string",
    "customerReferenceNumber": "string",
    "transactionId": "string"
  }
]
```

**Response (202) - Asynchronous:** Same as sales order async response

---

### POST `/purchase-order/status`

Fetch Purchase Order statuses by IDs

**Request Body:**

```json
[
  {
    "id": 0
  }
]
```

**Response (200):** Same as synchronous purchase order response

---

### POST `/purchase-order/poll`

Poll Purchase Order submission status by handle (for async orders)

**Request Body:**

```json
[
  {
    "handle": "string"
  }
]
```

**Response (200):** Same as sales order poll response

---

## 📋 Key Concepts

### Sales Order vs Purchase Order

- **Sales Order**: YOU are buying FROM Platform Gold (customer purchasing gold)
- **Purchase Order**: YOU are selling TO Platform Gold (not used in e-commerce)

### Order Statuses (Sales Order)

- `Awaiting Payment` - Order created, payment pending
- `Awaiting Shipping Instructions` - Paid, needs shipping info
- `Pending Fulfillment` - Ready to ship
- `Partially Fulfilled` - Some items shipped
- `Fulfillment Complete` - All items shipped
- `Cancelled` - Order cancelled
- `On Hold - Contact Desk` - Issue requires support

### Synchronous vs Asynchronous

- **Synchronous** (`asynchronous: false`): Immediate response with order ID
- **Asynchronous** (`asynchronous: true`): Returns handle, poll for status later

### Required IDs

Before creating a sales order, you must fetch:

1. **Payment Method ID**: From `/payment-methods`
2. **Shipping Instruction ID**: From `/shipping-instructions`

### Confirmation Numbers

- Optional but recommended
- Use your internal order ID (e.g., Firebase order ID)
- Helps track orders across systems

---

## 🧪 Testing Strategy

### Sandbox Environment

Contact Platform Gold to request sandbox credentials. Sandbox allows:

- ✅ Creating test orders without real fulfillment
- ✅ Testing all API endpoints safely
- ✅ Simulating order statuses

### Production Testing (⚠️ Use with Caution)

If no sandbox is available:

1. Create the smallest/cheapest order possible
2. Use a real address you control
3. Expect actual fulfillment and charges
4. Cancel immediately if possible (check with Platform Gold)

---

## 🔗 Integration Flow (Summit Bullion)

```
1. Customer adds items to cart (inventory IDs from Platform Gold)
2. Customer completes checkout with Stripe
3. Stripe webhook fires → Create order in Firebase
4. Fetch payment method ID and shipping instruction ID
5. Create Platform Gold sales order
6. Store Platform Gold order ID in Firebase
7. Poll order status periodically
8. Update customer with tracking info when available
```

---

## 📞 Support

Contact Platform Gold support for:

- Sandbox access
- API issues
- Order problems
- Account setup
