export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "What is Prism and how is it different from Flowscan?",
    answer:
      "Prism is an immediate state viewer. Our core purpose is the current state, not history. Flowscan is a blockchain explorer that indexes and shows the full historical ledger (past transactions, old logs, etc.). Prism connects directly to Access Nodes to provide an exact snapshot of an account right now, without loading any historical logs.",
  },
  {
    question: "Why doesn't my search show transaction history?",
    answer:
      "Prism focuses on current state, not historical data. We provide real-time account information and current blockchain state. For transaction history, you would need to use a blockchain explorer like Flowscan.",
  },
  {
    question: "How can Prism retrieve data so quickly?",
    answer:
      "Prism connects directly to Access Nodes on the Flow blockchain, bypassing the need for indexing or database queries. This direct connection allows us to fetch current state data almost instantaneously.",
  },
  {
    question: "Does the data on my screen update in real-time (live stream)?",
    answer:
      "Yes! When the LIVE indicator is active, Prism streams real-time updates directly from the blockchain. Any changes to the account state are reflected immediately on your screen.",
  },
  {
    question: "What are Access Nodes, and how are they relevant?",
    answer:
      "Access Nodes are the entry points to the Flow blockchain network. They provide a way to query blockchain data and submit transactions. Prism uses Access Nodes to fetch current state information directly, ensuring you always see the most up-to-date data.",
  },
  {
    question: 'What does the "LIVE" indicator mean in the search bar?',
    answer:
      "The LIVE indicator shows that Prism is actively streaming real-time updates from the blockchain. When active, any changes to the account or resource you're viewing will be automatically updated on your screen without needing to refresh.",
  },
];
