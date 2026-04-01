"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

interface ProductClientWrapperProps {
  children: ReactNode;
}

export const ProductAnimationWrapper = ({
  children,
}: ProductClientWrapperProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-linear-to-b from-white to-gray-50/50 min-h-screen"
    >
      {children}
    </motion.div>
  );
};

export const ProductImageWrapper = ({
  children,
}: ProductClientWrapperProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full md:w-1/2"
    >
      {children}
    </motion.div>
  );
};

export const ProductDetailsWrapper = ({
  children,
}: ProductClientWrapperProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="w-full md:w-1/2 flex flex-col gap-5"
    >
      {children}
    </motion.div>
  );
};

export const ProductActionWrapper = ({
  children,
  delay = 0.3,
}: ProductClientWrapperProps & { delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
};

export const ProductSectionWrapper = ({
  children,
  delay = 0.6,
}: ProductClientWrapperProps & { delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
};
