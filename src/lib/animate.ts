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


export const rowBoundaries = {
  initial: {
    margin: 0,
  },
  selected: {
    margin: "1.25rem 0",
  },
};
