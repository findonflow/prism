# Prism

A Flow blockchain explorer that provides human-readable access to account, contract, and transaction data directly from the chain.

## Overview

Prism is a Next.js web application that allows users to inspect live Flow blockchain state, view account details, explore NFT collections, manage contracts, and interact with the chain through wallet authentication. It supports both **Mainnet** and **Testnet** networks.

## Features

### Account Explorer
- **Tokens**: View fungible token balances with registry integration for token metadata (name, symbol, logo)
- **NFT Collections**: Browse NFT collections with metadata display, collection images, and individual token previews
- **Staking**: View staking delegations, node information, rewards, and staking positions
- **Keys**: Inspect account keys with hash algorithms, signature algorithms, weights, and revocation status
- **Contracts**: View deployed Cadence contracts with syntax highlighting and external Flowscan links
- **Storefront**: Manage NFT Storefront V2 listings, cleanup ghosted/expired/purchased listings
- **Linked Accounts**: Explore Hybrid Custody relationships including COA (Cadence Owned Accounts), child accounts, and owned accounts
- **Storage**: Inspect raw storage paths, public capabilities, and stored resources with JSON visualization

### Transaction Explorer
- View transaction scripts with Cadence syntax highlighting
- Inspect transaction arguments and their types
- View transaction events and error messages

### Contract Deployment
- Deploy new Cadence contracts directly from the browser
- Monaco editor with Cadence support
- Automatic contract name extraction and collision detection

### Address Resolution
- Supports Flow addresses (0x prefixed)
- Supports .find name resolution
- Automatic address validation and formatting

## Tech Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 with DaisyUI components
- **State Management**: TanStack React Query
- **Flow Integration**: @onflow/fcl (Flow Client Library)
- **Code Editor**: Monaco Editor
- **Animations**: Motion (Framer Motion)
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── [network]/          # Network-specific routes (mainnet/testnet)
│   │   ├── account/[id]/   # Account explorer pages
│   │   │   ├── collections/
│   │   │   ├── contracts/
│   │   │   ├── keys/
│   │   │   ├── linked-accounts/
│   │   │   ├── staking/
│   │   │   ├── storage/
│   │   │   └── storefront/
│   │   ├── tx/[hash]/      # Transaction explorer
│   │   └── deploy/         # Contract deployment
│   └── design/             # Design system components
├── components/
│   ├── flowscan/           # Blockchain-specific components
│   └── ui/                 # Reusable UI components
├── fetch/
│   ├── cadence/            # Cadence scripts for on-chain queries
│   └── *.ts                # Data fetching functions
├── hooks/                  # React hooks for data fetching and state
├── interfaces/             # Flow network configuration and login
├── lib/                    # Utility functions and helpers
├── mutate/                 # Transaction mutation functions
└── types.d.ts              # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9.15+

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Start development server with Turbopack
pnpm dev
```

The application will be available at `http://localhost:3000`.

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

### Code Quality

```bash
# Run linter
pnpm lint

# Format code
pnpm format
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_GA_ID` | Google Analytics tracking ID (optional) |
| `AUTHUSER` | API authentication username (for FIND API) |
| `AUTHPASS` | API authentication password (for FIND API) |

## Supported Networks

| Network | Access Node | Discovery Wallet |
|---------|-------------|------------------|
| Mainnet | `https://rest-mainnet.onflow.org` | `https://fcl-discovery.onflow.org/authn` |
| Testnet | `https://rest-testnet.onflow.org` | `https://fcl-discovery.onflow.org/testnet/authn` |

## Wallet Authentication

Prism uses FCL (Flow Client Library) for wallet authentication. Users can connect their Flow wallets to:
- Deploy contracts to their accounts
- Manage NFT Storefront listings
- Interact with Hybrid Custody features
- Claim child accounts

## Cadence Scripts

The application includes Cadence scripts for querying on-chain data:
- Account storage and public capabilities
- NFT collection metadata and displays
- Staking information and delegator details
- Hybrid Custody relationships
- NFT Storefront listings
- COA (Cadence Owned Account) information

## Hybrid Custody Support

Prism provides full support for Flow's Hybrid Custody standard:
- View parent/child account relationships
- Inspect capability filters and factories
- Manage owned accounts
- Claim unclaimed child accounts
- Set display metadata for child accounts

## Makefile Commands

The project includes Makefile targets for Hybrid Custody operations on testnet:

```bash
# Create a new child account
make create-new-account

# Remove a parent from child account
make remove-parent

# Publish child account to parent
make publish-to-parent

# Setup NFT factory manager
make setup-factory-nft-manager

# Setup allow-all filter
make setup-filter-allow-all
```

## License

MIT License - Copyright (c) 2025 Find On Flow

## Author

Find Labs