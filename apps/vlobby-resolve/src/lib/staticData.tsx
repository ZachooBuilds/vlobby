'use client';
import { CarIconPath, HammerIconPath } from '../../public/svg/icons';
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

export const spaceRoleOptions = [
  { id: 'vl:owner', name: 'Owner' },
  { id: 'vl:owner-occupier', name: 'Owner Occupier' },
  { id: 'vl:occupant', name: 'Occupant' },
  { id: 'vl:tenant', name: 'Tenant' },
];

export const statusOptions = [
  { id: 'Pending', label: 'Pending' },
  { id: 'Assigned', label: 'Active' },
  { id: 'In Progress', label: 'In Progress' },
  { id: 'Resolved', label: 'Resolved' },
  { id: 'Closed', label: 'Closed' },
];

export const viewOptions = [
  { id: 'maintenance', label: 'Maintenance View', href: '/maintenance',icon:HammerIconPath },
  { id: 'parking', label: 'Parking View', href: '/parking',icon:CarIconPath },
];

export const requestStatuses = ['pending', 'assigned', 'complete'];
