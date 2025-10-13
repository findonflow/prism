export const variants = {
  hidden: {
    opacity: 0,
    y: -20, // Use a number, not a string
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.05,
    },
  },
};
