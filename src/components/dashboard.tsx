'use client';

import React from 'react';
import EnhancedComprehensiveDashboard from './enhanced-comprehensive-dashboard';

interface DashboardProps {
  userEmail: string;
  userName: string;
  personalityLevel: number;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  userEmail, 
  userName, 
  personalityLevel 
}) => {
  // For now, we'll use mock data for coupleId and userId
  // In a real app, these would come from authentication/session
  const coupleId = 'mock-couple-123';
  const userId = 'mock-user-123';

  return (
    <EnhancedComprehensiveDashboard
      userEmail={userEmail}
      userName={userName}
      coupleId={coupleId}
      userId={userId}
      personalityLevel={personalityLevel as 1 | 2 | 3}
      coupleBackstory="A loving couple working on their relationship through interactive therapy games"
    />
  );
};

export default Dashboard;
