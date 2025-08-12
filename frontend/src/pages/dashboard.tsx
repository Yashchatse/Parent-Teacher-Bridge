"use client";

import React from 'react';
import { DashboardContent } from '../components/dashboard-content';

interface DashboardPageProps {
  onLogout: () => void;
  user: { email: string; name?: string; role?: string } | null;
}

export default function DashboardPage({ onLogout, user }: DashboardPageProps) {
  return <DashboardContent onLogout={onLogout} user={user} />;
}
