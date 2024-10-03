"use client"
import { ValueLabelPair } from './app-types';

import { Mail, Box, Utensils, HelpCircle } from 'lucide-react';

export const parcelTypeOptions = [
  { value: 'mail', label: 'Mail', icon: Mail },
  { value: 'package', label: 'Package', icon: Box },
  { value: 'food_delivery', label: 'Food Delivery', icon: Utensils },
  { value: 'other', label: 'Other', icon: HelpCircle },
];

export const colorsList = [
  { name: 'Primary', hex: '#1847ED' },
  { name: 'Vibrant Blue', hex: '#00A3FF' },
  { name: 'Teal', hex: '#00D1C1' },
  { name: 'Navy', hex: '#0C2B9E' },
  { name: 'Royal Purple', hex: '#6A0DAD' },
  { name: 'Magenta', hex: '#FF00FF' },
  { name: 'Coral', hex: '#FF6B6B' },
  { name: 'Lime Green', hex: '#32CD32' },
  { name: 'Amber', hex: '#FFBF00' },
  { name: 'Deep Red', hex: '#C41E3A' },
];

export const requestStatuses = ['pending', 'assigned', 'complete'];
