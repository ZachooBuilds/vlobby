'use client';
import React from 'react';
import { motion } from 'framer-motion';
import NavigationBar from '../../../_components/navigation';
import VehicleSearch from '../_components/search';
import ParkingOptionsTabs from '../_components/tab-menu';
import NewRequestForm from '../_forms/new-pickup-request';

const container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function SearchPage() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow pt-16 overflow-auto p-4 gap-4 space-y-4">
        <ParkingOptionsTabs />
        <motion.div
          className="flex flex-col gap-4 items-start justify-start pb-[120px] w-full"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={item} className="w-full">
            <VehicleSearch />
          </motion.div>
          <motion.div variants={item} className="w-full">
            <NewRequestForm />
          </motion.div>
        </motion.div>
      </div>
      <div className="w-full bg-white">
        <NavigationBar />
      </div>
    </div>
  );
}
